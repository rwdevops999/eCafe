'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Meta } from "../tabs/data/meta";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { log } from "@/lib/utils";
import TooltipMessage from "@/components/ecafe/tooltip-message";

const detailFirstName = "firstname";
const detailName = "name";
const detailPhone = "phone";
const detailPhonecode = "code";

const   UserSectionDetails = ({_meta}:{_meta: Meta;}) => {
  log (true, "USD", "IN", _meta.data, true);
  const renderComponent = () => {
    if (_meta.form) {
      return (
        <Card className="border-stone-500">
          <CardHeader>
            <CardTitle className="underline text-yellow-500">Identification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 mb-1">
              <div className="col-span-6">
                <div className="grid grid-cols-6 items-center">
                  <TooltipMessage label="First name:" message="between 1 and 50 characters" className="col-span-1"/>
                  <Input
                    id={detailFirstName}
                    placeholder={`${detailFirstName}...`}
                    className="h-8 col-span-4"
                    {..._meta.form.register!(detailFirstName)}
                    />
                </div>
              </div>
              <div className="col-span-6">
                <div className="grid grid-cols-6 items-center">
                <TooltipMessage label="Name:" message="between 1 and 50 characters" className="col-span-1"/>
                <Input
                    id={detailName}
                    placeholder={`${detailName}...`}
                    className="h-8 col-span-4"
                    {..._meta.form.register!("name")}
                  />
                </div>
                {_meta.form && _meta.form.errors && _meta.form.errors.name &&
                  <span className="text-red-500">{_meta.form.errors.name.message}</span>
                }
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
                    // onChange={()=>{}}
                    value={`(${_meta.data.country.dialCode})`}
                    />
                  <Input
                    id={detailPhone}
                    placeholder={`${detailPhone}...`}
                    className="h-8 col-span-3"
                    {..._meta.form.register!(detailPhone)}
                    />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    return null;
  }

  return (
    <>
      {renderComponent()}
    </>);
}

export default UserSectionDetails;
