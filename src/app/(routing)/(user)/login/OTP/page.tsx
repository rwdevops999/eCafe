'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const LoginOTP = () => {
  const [value, setValue] = useState("")
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");
  
  return (
      <div className="w-[100%] h-[100%]">
          <div className="flex items-center justify-center">
              <Card className="mt-[20%] max-w-[350px] bg-[#F8F9FD] rounded-3xl p-[25px] border-[5px] border-solid border-[#FFFFFF] bg-login-pattern shadow-login-shadow m-5">
                  <CardHeader>
                      <CardTitle className="flex justify-center text-center font-black text-3xl text-blue-400">Sign In</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="block justify-center space-y-2">
                        <div className="justify-center text-black text-sm">
                          An email was sent to your account with a code. Enter this code here.
                        </div>
                        <div>
                          <InputOTP
                            maxLength={6}
                            value={value}
                            onChange={(value) => setValue(value)}
                            autoFocus
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0}/>
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>                        
                        <div className="flex justify-center">
                          <Button className="w-[50%] font-bold bg-login-button text-white m-20px rounded-2xl border-0 transition-all" type="submit">Log In</Button>
                        </div>
                      </div>
                      </CardContent>
              </Card>
          </div>
      </div>
    );
}

export default LoginOTP;