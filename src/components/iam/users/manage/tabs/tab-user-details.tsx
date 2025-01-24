'use client'

import PageTitle from "@/components/ecafe/page-title";
import { cancelButton, createButton, FormSchema, FormSchemaType, Meta, updateButton } from "./data/meta";
import ActionButtons from "../components/action-buttons";
import { Separator } from "@/components/ui/separator";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { CountryType, defaultCountry, UserType } from "@/data/iam-scheme";
import { log } from "@/lib/utils";
import UserSectionDetails from "../components/user-section-details";
import AddressSectionDetails from "../components/address-section-details";
import LoginSectionDetails from "../components/login-section-details";
import { Button } from "@/components/ui/button";


const TabUserDetails = ({_meta, updateCountry}:{_meta:Meta; updateCountry(country: CountryType): void;}) => {
  const [metaForTabUserDetails, setMetaForTabUserDetails] = useState<Meta>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues
  } = useForm<FormSchemaType>({ 
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: _meta.user?.name,
      firstname: _meta.user?.firstname,
      phone: _meta.user?.phone,
      code: (_meta.user ? `(${_meta.user.address.country.dialCode})` : defaultCountry.dialCode),
      street: _meta.user?.address.street,
      number: _meta.user?.address.number,
      box: _meta.user?.address.box,
      city: _meta.user?.address.city,
      postalcode: _meta.user?.address.postalcode,
      county: _meta.user?.address.county,
      email: _meta.user?.email,
      password: _meta.user?.password,
    }
   });

  const [reRender, setReRender] = useState<number>(0);

  const [phoneCode, setPhoneCode] = useState<string>();
  
  useEffect(() => {
    if (_meta.user) {
      setPhoneCode(_meta.user.address.country.dialCode);
    } else {
      setPhoneCode(defaultCountry.dialCode);
    }

    _meta.control?.test ? _meta.control.test("TabUserDetails") : () => {};

    _meta.sender = "TabUserDetails";
    _meta.data ? _meta.data.updateData = updateUserCountry : _meta.data = {updateData: updateUserCountry};
    _meta.buttons = [(_meta.user ? updateButton : createButton), cancelButton];

    _meta.form ? _meta.form.register = register : _meta.form = {register: register}
    _meta.form ? _meta.form.errors = errors : _meta.form = {errors: errors}
    _meta.form ? _meta.form.reset = reset : _meta.form = {reset: reset}
    _meta.form ? _meta.form.getValues = getValues : _meta.form = {getValues: getValues}

    setMetaForTabUserDetails(_meta);
    _meta.changeMeta ? _meta.changeMeta(_meta) : null;
  }, [])

  const updateUserCountry = (country: CountryType) => {
    setPhoneCode(country.dialCode);
    setReRender((x: any) => x+1);
    updateCountry(country);
  }

  const renderComponent = () => {
    if (metaForTabUserDetails) {
      return (
          <>
          <input hidden defaultValue={reRender}/>
          <PageTitle className="m-2" title={`User Details`} />
          <Separator />
          <div className="block space-y-1">
            <form className="form w-[100%]" >
              <div className="grid grid-cols-12">
                <div className="col-span-11 space-y-1">
                  <UserSectionDetails _meta={metaForTabUserDetails} phonecode={phoneCode}/>
                  <AddressSectionDetails _meta={metaForTabUserDetails}/>
                  <LoginSectionDetails _meta={metaForTabUserDetails}/>
                </div>
                <div className=" flex justify-end">
                  <ActionButtons _meta={metaForTabUserDetails}/>
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

    return null;
  }

  return (
    <>{renderComponent()}</>
  );
}

export default TabUserDetails;