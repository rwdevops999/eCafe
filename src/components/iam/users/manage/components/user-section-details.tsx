'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { FormSchemaType, Meta } from "../tabs/data/meta";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { log } from "@/lib/utils";

const detailFirstName = "firstname";
const detailName = "name";
const detailPhone = "phone";
const detailPhonecode = "code";

const   UserSectionDetails = ({_meta, phonecode}:{_meta: Meta<FormSchemaType>; phonecode: string|undefined}) => {
  const [dialCode, setDialCode] = useState<string>("");

  useEffect(() => {
    setDialCode(`(${phonecode})`);
  });

  const renderComponent = () => {
    return (
      <Card className="border-stone-500">
        <CardHeader>
          <CardTitle className="underline text-yellow-500">Identification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 mb-1">
            <div className="col-span-6">
              <div className="grid grid-cols-6 items-center">
                <Label className="col-span-1" htmlFor={detailFirstName}>First name:</Label>
                <Input
                  id={detailFirstName}
                  placeholder={`${detailFirstName}...`}
                  className="h-8 col-span-4"
                  {..._meta.form!.register!(detailFirstName)}
                  />
              </div>
              {_meta.form!.errors?.firstname && 
                <span className="text-red-500">Error in firstname"</span>
              }
            </div>
            <div className="col-span-6">
              <div className="grid grid-cols-6 items-center">
                <Label className="col-span-1" htmlFor={detailName}>Name:</Label>
                <Input
                  id={detailName}
                  placeholder={`${detailName}...`}
                  className="h-8 col-span-4"
                  {..._meta.form!.register!("name")}
                />
              </div>
              {_meta.form && _meta.form.errors && _meta.form.errors.name &&
                <span className="text-red-500">{_meta.form.errors.name.message}</span>
              }
              {/* {_meta.form!.errors?.name && 
                <span className="text-red-500">{}</span>
              } */}
            </div>
          </div>
  
          <div className="grid grid-cols-12 mb-1">
            <div className="col-span-6">
              <div className="grid grid-cols-6 items-center">
                <Label className="col-span-1" htmlFor={detailPhone}>Phone:</Label>
                <Input
                  disabled
                  id={detailPhonecode}
                  placeholder={`${detailPhonecode}...`}
                  className="h-8 col-span-1"
                  {..._meta.form!.register!(detailPhonecode)}
                  onChange={()=>{}}
                  value={dialCode}
                  />
                <Input
                  id={detailPhone}
                  placeholder={`${detailPhone}...`}
                  className="h-8 col-span-3"
                  {..._meta.form!.register!(detailPhone)}
                  />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {renderComponent()}
    </>);
}

export default UserSectionDetails;