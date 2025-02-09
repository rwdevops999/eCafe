import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultCountry } from "@/data/constants";
import { useEffect, useRef, useState } from "react";
import PageTitle from "@/components/ecafe/page-title";
import UserSection from "./user-section";
import { FormSchema, FormSchemaType } from "../data/form-scheme";
import LogonSection from "./logon-section";
import { Separator } from "@/components/ui/separator";
import ActionButtons from "@/components/iam/components/action-buttons";
import { ConsoleLogger } from "@/lib/console.logger";
import { Meta } from "../../meta/meta";
import { ButtonConfig, CountryType, UserType } from "@/types/ecafe";
import { defineActionButtons } from "@/components/iam/lib/util";
import { storeUserFormValues } from "../data/util";
import AddressSection from "./address-section";
import { handleLoadCountries } from "@/lib/db";

const TabUser = ({_meta, onTabLeave, setFormMethods}:{_meta: Meta; onTabLeave: boolean; setFormMethods(methods: UseFormReturn<any>): void;}) => {
  const logger = new ConsoleLogger({ level: 'debug' });

  // logger.debug("TabUsers", "IN(_meta)", JSON.stringify(_meta))
  logger.debug("TabUsers", "IN(onTabLeave)", onTabLeave);

  const storedUserRef = useRef<UserType|undefined>(undefined);

  let user: UserType|undefined = _meta.currentSubject as UserType;
  
  if (storedUserRef.current) {
    logger.debug("TabUsers", "IN(storedUserRef)", "Using Stored Values");
    user = storedUserRef.current;
  }

  logger.debug("TabUsers", ">>> IN(user)", user?.passwordless);

  const formMethods = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
     name: "",
     firstname: "",
     dialcode: "",
     phone: "",
     email: "",
     password: "",
     passwordless: false,
     number: "",
     box: "",
     street: "",
     city: "",
     postalcode: "",
     county: "",
     country: ""
    },
    values: {
      name: user?.name??"",
      firstname: user?.firstname ?? "",
      email: user?.email ?? "",
      password: user?.password ?? "",
      passwordless: user?.passwordless ?? false,
      phone: user?.phone ?? "",
      dialcode: user?.address?.country.dialCode ? `${user.address.country.dialCode}`: `${defaultCountry.dialCode}`,
      city: user?.address?.city?? "",
      number: user?.address?.number?? "",
      box: user?.address?.box ?? "",
      street: user?.address?.street ?? "",
      postalcode: user?.address?.postalcode ?? "",
      county: user?.address?.county?? "",
      country: user?.address?.country.name?? defaultCountry.name
    },
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: true
    }
  });

  // const [rerender, setRerender] = useState<number>(0);

  const actionButtons = useRef<ButtonConfig>({})

  // const {getValues, setValue} = formMethods;
  const [nrOfItemsToValidate, setNrOfItemsToValidate] = useState<number>(0);

  const countries = useRef<CountryType[]>([])
  const countriesLoadedCallback = (data: CountryType[]) => {
    countries.current = data;
  }

  useEffect(() => {
    logger.debug("TabUser", "useEffect[]", JSON.stringify(_meta.currentSubject));

    actionButtons.current = defineActionButtons(_meta.currentSubject as UserType)
    setFormMethods(formMethods);

    const itemsToValidate: number = _meta.control.calculateValidationItems();
    logger.debug("TabUsers", "ItemsToValidate", itemsToValidate);
    setNrOfItemsToValidate(itemsToValidate);

    handleLoadCountries(countriesLoadedCallback);
  }, []);

  const {handleSubmit, getValues} = formMethods;

  useEffect(() => {
    if (onTabLeave) {
      const _user: UserType = storeUserFormValues(_meta.currentSubject as UserType, getValues, countries.current);
      logger.debug("TabUser", "LeavingTab => STORE USER", JSON.stringify(_user));

      storedUserRef.current = _user;
    }
  }, [onTabLeave]);

  const onSubmit = async (data: any) => {
    logger.debug("TabUsers", "onSubmit", "SUBMITTING...");
  };

  const renderComponent = () => {
    logger.debug("TabUsers", "RENDER");
    return (
      <>
        <PageTitle className="m-2" title={`User Details`} />
        <Separator />
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12">
            <div className="col-span-11 space-y-1">
              <UserSection formMethods={formMethods}/>
              <LogonSection formMethods={formMethods}/>
              <AddressSection formMethods={formMethods}/>
            </div>
            <div className="ml-5 col-span-1">
              <ActionButtons buttonConfig={actionButtons.current} meta={_meta} nrOfItemsToValidate={nrOfItemsToValidate} />
            </div>
          </div>
        </form>
      </>
    );
  }

  return (<>{renderComponent()}</>);
}

export default TabUser;