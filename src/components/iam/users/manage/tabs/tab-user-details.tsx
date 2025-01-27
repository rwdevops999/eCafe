'use client'

import PageTitle from "@/components/ecafe/page-title";
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
import { FormSchema, FormSchemaType, Meta } from "./data/meta";
import { cancelButton, createButton, updateButton } from "@/data/meta";


const TabUserDetails = ({_meta}:{_meta:Meta<FormSchemaType>;}) => {
  log (true, "TUD", "IN", _meta.data, true);
  const [metaForTabUserDetails, setMetaForTabUserDetails] = useState<Meta<FormSchemaType>>();

  const {
    register,
    formState: { errors },
    reset,
    getValues,
    handleSubmit
  } = useForm<FormSchemaType>({ 
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: _meta.subject?.name,
      firstname: _meta.subject?.firstname,
      phone: _meta.subject?.phone,
      code: _meta.data.country.dialCode,
      street: _meta.subject?.address?.street,
      number: _meta.subject?.address?.number,
      box: _meta.subject?.address?.box,
      city: _meta.subject?.address?.city,
      postalcode: _meta.subject?.address?.postalcode,
      county: _meta.subject?.address?.county,
      email: _meta.subject?.email,
      password: _meta.subject?.password,
    }
   });

  const [reRender, setReRender] = useState<number>(0);

  useEffect(() => {
    let createMode: boolean = (_meta.subject === undefined);
    if (! createMode) {
      createMode = (_meta.subject.id === 0);
    }

    _meta.sender = "TabUserDetails";
    _meta.buttons = [createMode ? createButton : updateButton, cancelButton];
    _meta.form ? _meta.form.register = register : _meta.form = {register: register}
    _meta.form ? _meta.form.errors = errors : _meta.form = {errors: errors}
    _meta.form ? _meta.form.reset = reset : _meta.form = {reset: reset}
    _meta.form ? _meta.form.getValues = getValues : _meta.form = {getValues: getValues}

    setMetaForTabUserDetails(_meta);
    _meta.changeMeta ? _meta.changeMeta(_meta) : null;
  }, [])

  const renderComponent = () => {
    if (metaForTabUserDetails) {
      return (
          <>
          <input hidden defaultValue={reRender}/>
          <PageTitle className="m-2" title={`User Details`} />
          <Separator />
          <div className="block space-y-1">
            <form className="form w-[100%]">
              <div className="grid grid-cols-12">
                <div className="col-span-11 space-y-1">
                  <UserSectionDetails _meta={metaForTabUserDetails}/>
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