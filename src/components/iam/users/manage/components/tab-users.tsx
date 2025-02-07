import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultCountry } from "@/data/constants";
import { useEffect, useRef, useState } from "react";
import { NewButtonConfig } from "@/data/types";
import PageTitle from "@/components/ecafe/page-title";
import UserSection from "./user-section";
import { FormSchema, FormSchemaType } from "../data/form-scheme";
import LogonSection from "./logon-section";
import AddressSection, { countries } from "./address-section";
import { Separator } from "@/components/ui/separator";
import { Meta } from "../../data/meta";
import { defineActionButtons, storeUserFormValues } from "../data/util";
import ActionButtons from "@/components/iam/components/action-buttons";
import { ConsoleLogger } from "@/lib/console.logger";

const TabUsers = ({_meta, onTabLeave, setFormMethods}:{_meta: Meta; onTabLeave: boolean; setFormMethods(methods: UseFormReturn<any>): void;}) => {
  const logger = new ConsoleLogger({ level: 'debug' });

  // logger.debug("TabUsers", "IN(_meta)", JSON.stringify(_meta))
  logger.debug("TabUsers", "IN(onTabLeave)", onTabLeave);

  const storedUserRef = useRef<NewUserType|undefined>(undefined);

  let user: NewUserType|undefined = _meta.currentSubject as NewUserType;
  
  if (storedUserRef.current) {
    logger.debug("TabUsers", "IN(storedUserRef)", "Using Stored Values");
    user = storedUserRef.current;
  }

  logger.debug("TabUsers", "IN(user)", JSON.stringify(user));

  const formMethods = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
     name: "",
     firstname: "",
     dialcode: "",
     phone: "",
     email: "",
     password: "",
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

  const actionButtons = useRef<NewButtonConfig>({})

  // const {getValues, setValue} = formMethods;
  const [nrOfItemsToValidate, setNrOfItemsToValidate] = useState<number>(0);

  useEffect(() => {
    logger.debug("TabUser", "useEffect[]", JSON.stringify(_meta.currentSubject));

    actionButtons.current = defineActionButtons(_meta.currentSubject as NewUserType)
    setFormMethods(formMethods);

    const itemsToValidate: number = _meta.control.calculateValidationItems();
    logger.debug("TabUsers", "ItemsToValidate", itemsToValidate);
    setNrOfItemsToValidate(itemsToValidate);

    // initUserForm(_meta.currentSubject as NewUserType, setValue);
  }, []);

  const {handleSubmit, getValues} = formMethods;

  useEffect(() => {
    if (onTabLeave) {
      const _user: NewUserType = storeUserFormValues(_meta.currentSubject as NewUserType, getValues, countries);
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

  return (
    <>{renderComponent()}</>
  )
}

export default TabUsers;