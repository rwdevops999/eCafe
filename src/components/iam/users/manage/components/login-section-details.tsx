'use client'

import { EmailInput } from "@/components/ecafe/email-input";
import { PasswordInput } from "@/components/ecafe/password-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FormSchemaType, Meta } from "../tabs/data/meta";

const logonEmail = "email";
const logonPassword = "password";

const LoginSectionDetails = ({_meta}:{_meta: Meta<FormSchemaType>}) => {
  return (
    <Card className="border-stone-500">
      <CardHeader>
        <CardTitle className="underline text-yellow-500">Logon Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12 mb-1">
          <div className="col-span-6">
            <div className="grid grid-cols-6 items-center">
              <Label className="col-span-1" htmlFor={logonEmail}>Email:</Label>
              <EmailInput 
                type="email"
                id={logonEmail}
                className="col-span-4"
                {..._meta.form!.register!(logonEmail)}
                />
            </div>
            {_meta.form!.errors?.email && 
              <span className="text-red-500">{_meta.form!.errors.email.message}</span>
            }
          </div>
          <div className="col-span-6">
            <div className="grid grid-cols-6 items-center">
              <Label className="col-span-1" htmlFor={logonPassword}>Password:</Label>
              <PasswordInput 
                type="password"
                id={logonPassword}
                className="col-span-4"
                {..._meta.form!.register!(logonPassword)}
              />
            </div>
            {_meta.form!.errors?.password && 
              <span className="text-red-500">{_meta.form!.errors.password.message}</span>
            }
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default LoginSectionDetails;