'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { FormSchema, FormSchemaType } from "./data/form-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const LoginPassword = () => {
  const formMethods = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
    },
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: true
    }
  });

  const {handleSubmit, setValue, register, formState: {errors}} = formMethods;
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const handleSwitchPassword = () => {
    setViewPassword(!viewPassword);
  }

  const onSubmit = (data: any) => {
      console.log("onSubmit Login Form");
  }

  return (
    <div className="w-[100%] h-[100%]">
        <div className="flex items-center justify-center">
            <Card className="mt-[20%] max-w-[350px] bg-[#F8F9FD] rounded-3xl p-[25px] border-[5px] border-solid border-[#FFFFFF] bg-login-pattern shadow-login-shadow m-5">
                <CardHeader>
                    <CardTitle className="flex justify-center text-center font-black text-3xl text-blue-400 mb-5">Sign In</CardTitle>
                    <CardTitle className="flex justify-center text-center font-black text-sm text-black/50">Enter your password</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center">
                        <form className="form" onSubmit={handleSubmit(onSubmit)}>
                            <div className="block space-y-2">
                              <div className="w-[100%] grid grid-cols-12 items-center space-x-2">
                                {/* <Label className="col-span-3 text-black" htmlFor="password">Password:</Label> */}
                                <Input 
                                  type={viewPassword ? "text" : "password"}
                                  id="password"
                                  placeholder="password..."
                                  className="h-8 col-span-11 text-black"
                                  {...register("password")}
                                />
                                {viewPassword ? 
                                    <EyeOff width={18} height={18} onClick={handleSwitchPassword} className="text-red-500"/> : 
                                    <Eye width={18} height={18} onClick={handleSwitchPassword} className="text-black"/>
                                }
                              </div>
                              {errors.password && errors.password.type === "too_small" && <span className="text-red-500" role="alert">Enter at least 8 characters</span>}
                              {errors.password && errors.password.type === "too_big" && <span className="text-red-500" role="alert">Enter not more than 12 characters</span>}
                              <Button className="w-[100%] font-bold bg-login-button text-stone-700 m-20px rounded-2xl border-0 transition-all" type="submit">Continue</Button>
                            </div>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
        {/* <NotificationDialog  
            _open={openDialog}
            _title={dialogTitleRef.current}
            _message={dialogMessageRef.current}
            _buttonnames={dialogButtonsRef.current}
            _handleButtonLeft={handleCancelLogin}
            _handleButtonRight={handleRetryLogin}
        /> */}
    </div>
)
}

export default LoginPassword;