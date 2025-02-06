'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSchemaType } from "../data/form-scheme";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const LogonSection = ({formMethods}:{formMethods: UseFormReturn<FormSchemaType>}) => {
  const {register, formState: { errors }} = formMethods;
  const [viewPassword, setViewPassword] = useState<boolean>(false);

  const handleSwitchPassword = () => {
    setViewPassword(!viewPassword);
  }

  return (
    <Card className="border-stone-500">
      <CardHeader>
        <CardTitle className="underline text-yellow-500">Logon</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-[100%] grid grid-cols-12 space-x-2">
          <div className="col-span-4">
            <div className="grid grid-cols-8 items-center space-x-2">
              <Label className="col-span-2" htmlFor="email">Email:</Label>
              <Input
                type="text" 
                id="email"
                placeholder="email..."
                className="h-8 col-span-5"
                {...register("email")}
              />
            </div>
            {errors.email && errors.email.type === "too_small" && <span className="text-red-500" role="alert">Email is required</span>}
            {errors.email && errors.email.type === "invalid_string" && <span className="text-red-500" role="alert">Email be valid</span>}
          </div>

          <div className="col-span-4">
            <div className="grid grid-cols-8 items-center space-x-2">
              <Label className="col-span-2" htmlFor="password">Password:</Label>
              <Input 
                type={viewPassword ? "text" : "password"}
                id="password"
                placeholder="password..."
                className="h-8 col-span-4"
                {...register("password")}
              />
              &nbsp;
              {viewPassword ? 
                <EyeOff width={18} height={18} onClick={handleSwitchPassword}/> : 
                <Eye width={18} height={18} onClick={handleSwitchPassword}/>}
            </div>
            {errors.password && errors.password.type === "too_small" && <span className="text-red-500" role="alert">Password must be at least 8 characters</span>}
            {errors.password && errors.password.type === "too_big" && <span className="text-red-500" role="alert">Password may not be longer than 12 characters</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default LogonSection;