'use client'

import { GroupType } from "@/data/iam-scheme";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormSchema, FormSchemaType } from "./data/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { cancelButton, createButton, Meta, updateButton } from "@/components/iam/users/manage/dist/data/meta";
import PageTitle from "@/components/ecafe/page-title";
import { Separator } from "@radix-ui/react-separator";
import ActionButtons from "@/components/iam/users/manage/components/action-buttons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const groupName = "name";
const groupDescription = "description";

const TabGroup = ({meta}:{meta: Meta<FormSchemaType>;}) => {
  const [metaForTabGroup, setMetaForTabGroup] = useState<Meta<FormSchemaType>>();

  const {
    register,
    formState: { errors },
    reset,
    getValues
  } = useForm<FormSchemaType>({ 
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: meta.subject?.name,
      description: meta.subject?.description,
    }
   });

  useEffect(() => {
    meta.sender = "TabGroup";
    meta.buttons = [(meta.subject ? updateButton : createButton), cancelButton];

    meta.form ? meta.form.register = register : meta.form = {register: register}
    meta.form ? meta.form.errors = errors : meta.form = {errors: errors}
    meta.form ? meta.form.reset = reset : meta.form = {reset: reset}
    meta.form ? meta.form.getValues = getValues : meta.form = {getValues: getValues}

    setMetaForTabGroup(meta);
    meta.changeMeta ? meta.changeMeta(meta) : null;
  }, []);

  const GroupDetails = () => {
    return (
      <Card className="border-stone-500">
        <CardHeader>
          <CardTitle className="underline text-yellow-500">Identification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 mb-1">
            <div className="col-span-6">
              <div className="grid grid-cols-6 items-center">
                <Label className="col-span-1" htmlFor={groupName}>Name:</Label>
                <Input
                  id={groupName}
                  placeholder={`${groupName}...`}
                  className="h-8 col-span-4"
                  {...register(groupName)}
                  />
              </div>
              {errors.name && 
                <span className="text-red-500">{errors.name.message}</span>
              }
            </div>
          </div>
  
          <div className="grid grid-cols-12 mb-1">
              <div className="grid col-span-12 grid-cols-12 items-center">
                <Label className="col-span-1" htmlFor={groupDescription}>Description :</Label>
                <Input
                  id={groupDescription}
                  placeholder={`${groupDescription}...`}
                  className="h-8 col-span-10"
                  {...register("description")}
                  />
              </div>
              {errors.description && 
                <span className="text-red-500">{errors.description.message}</span>
              }
            </div>
        </CardContent>
      </Card>
    )
  }

  const renderComponent = () => {
    if (metaForTabGroup) {
      return (
        <>
          <PageTitle className="m-2" title={`Group Details`} />
          <Separator />
          <div className="block space-y-1">
            <form className="form w-[100%]" >
              <div className="grid grid-cols-12">
                <div className="col-span-11 space-y-1">
                  <GroupDetails />
                </div>
                <div className=" flex justify-end">
                  <ActionButtons _meta={metaForTabGroup}/>
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
  )
}

export default TabGroup;