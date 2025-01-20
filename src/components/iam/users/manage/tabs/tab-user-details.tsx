'use client'

import PageTitle from "@/components/ecafe/page-title";
import { cancelButton, FormSchema, FormSchemaType, Meta, okButton, updateButton } from "./data/meta";
import ActionButtons from "../components/action-buttons";
import { Separator } from "@/components/ui/separator";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { CountryType, defaultCountry, UserType } from "@/data/iam-scheme";
import { log } from "@/lib/utils";
import UserSectionDetails from "../components/user-section-details";
import AddressSectionDetails from "../components/address-section-details";
import LoginSectionDetails from "../components/login-section-details";


const TabUserDetails = ({_meta, user, updateCountry}:{_meta:Meta; user: UserType|undefined; updateCountry(country: CountryType): void;}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormSchemaType>({ 
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user?.name,
      firstname: user?.firstname,
      phone: user?.phone,
      code: (user ? `(${user.address.country.dialCode})` : defaultCountry.dialCode),
      street: user?.address.street,
      number: user?.address.number,
      box: user?.address.box,
      city: user?.address.city,
      postalcode: user?.address.postalcode,
      county: user?.address.county,
      email: user?.email,
      password: user?.password,
    }
   });

  const [reRender, setReRender] = useState<number>(0);

  if (user) {
    _meta.buttons = [updateButton, cancelButton]
  } else {
    _meta.buttons = [okButton, cancelButton]
  }

  const metaform = {
      register: register,
      errors: errors
  }

  _meta.form = metaform;

  const [phoneCode, setPhoneCode] = useState<string>();
  
  useEffect(() => {
    if (user) {
      setPhoneCode(user.address.country.dialCode);
    } else {
      setPhoneCode(defaultCountry.dialCode);
    }
  }, [user])

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    _meta.manageSubject(data);
  }

  const updateUserCountry = (country: CountryType) => {
    setPhoneCode(country.dialCode);
    setReRender((x: any) => x+1);
    updateCountry(country);
  }

  const metaUserData = {
    updateData: updateUserCountry
}

  _meta.userData = metaUserData;

  const renderComponent = () => {
    return (
        <>
        <input hidden defaultValue={reRender}/>
        <PageTitle className="m-2" title={`User Details`} />
        <Separator />
        <div className="block space-y-1">
          <form className="form w-[100%]" onSubmit={handleSubmit(onSubmit)} >
            <div className="grid grid-cols-12">
              <div className="col-span-11 space-y-1">
                <UserSectionDetails _meta={_meta} phonecode={phoneCode}/>
                <AddressSectionDetails _meta={_meta} user={user}/>
                <LoginSectionDetails _meta={_meta}/>
              </div>
              <div className=" flex justify-end">
                <ActionButtons _meta={_meta}/>
              </div>
            </div>
            {/* <div>
              {JSON.stringify(errors)}
            </div> */}
          </form>
        </div>
      </>
    )
  }

  return (
    <>{renderComponent()}</>
  );
}

export default TabUserDetails;