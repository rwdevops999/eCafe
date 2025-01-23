import { GroupType } from "@/data/iam-scheme";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormSchema, FormSchemaType } from "./data/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { cancelButton, createButton, Meta, updateButton } from "@/components/iam/users/manage/tabs/data/meta";
import PageTitle from "@/components/ecafe/page-title";
import { Separator } from "@radix-ui/react-separator";
import ActionButtons from "@/components/iam/users/manage/components/action-buttons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

const groupName = "name";
const groupDescription = "description";

const TabGroup = ({meta, group}:{meta: Meta; group:GroupType|undefined}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormSchemaType>({ 
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: group?.name,
      description: group?.description,
    }
   });

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    console.log("SUBMIT");
    // if (meta.manageSubject) {
    //   meta.manageSubject(data);
    // }
  }
  
  useEffect(() => {
    if (group === undefined) {
      reset();
    }
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
            {/* <div className="col-span-12"> */}
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
          {/* </div> */}
        </CardContent>
      </Card>
    )
  }

  meta.buttons = [(group ? updateButton : createButton), cancelButton]
  
  const renderComponent = () => {
    return (
      <>
      <PageTitle className="m-2" title={`Group Details`} />
      <Separator />
      <div className="block space-y-1">
        <form className="form w-[100%]" onSubmit={handleSubmit(onSubmit)} >
          <div className="grid grid-cols-12">
            <div className="col-span-11 space-y-1">
              <GroupDetails />
            </div>
            <div className=" flex justify-end">
              <ActionButtons _meta={meta}/>
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
  )
}

export default TabGroup;