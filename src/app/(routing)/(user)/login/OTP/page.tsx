'use client'

import NotificationDialog from "@/components/ecafe/notification-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { handleLoadOTP } from "@/lib/db";
import { NotificationButtonsType, OtpType } from "@/types/ecafe";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LoginOTP = () => {
  const {push} = useRouter();

  const [value, setValue] = useState("")
  const searchParams = useSearchParams();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const setDialogState = (state: boolean): void => {
      setOpenDialog(state);
  }

  const dialogTitleRef = useRef<string>("");
  const dialogMessageRef = useRef<string>("");
  const dialogButtonsRef = useRef<NotificationButtonsType>({leftButton: "No", rightButton: "Yes"});
  const dialogDataRef = useRef<any>(undefined);
  
  const otpId = searchParams.get("otpId");

  if (otpId) {
    console.log("OTP for email", otpId);
  }

  const handleInvalidOtpCode = () => {
    dialogTitleRef.current = "Invalid OTP code";
    dialogMessageRef.current = "OTP code incorrect. Retry Login or OTP again?";
    dialogButtonsRef.current = {leftButton: "Cancel", centerButton: "Login", rightButton: "OTP"};

    setDialogState(true);
  }

  const otpLoadedCallback = (data: any) => {
    console.log("otpLoadedCallback", JSON.stringify(data));
    if (data.status === 200) {
      const otp: OtpType = data;

      if (otp.otp !== value) {
        handleInvalidOtpCode();
      }
    }
  };

  const handleOTPLogin = () => {
    console.log("Try OTP Login with code", value);

    const otpId = "555";

    if (otpId) {
      handleLoadOTP(parseInt(otpId), otpLoadedCallback);
    }
  }

  const cancelDialogAndRedirect = (url: string) => {
    setDialogState(false);
    push(url);
  }
  
  const handleCancelLogin = () => {
    cancelDialogAndRedirect("/dashboard");
  }

  const handleRetryLogin = () => {
    cancelDialogAndRedirect("/login/main");
  }

  const handleRetryOTP = () => {
    cancelDialogAndRedirect("/login/OTP");
  }

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
                          <Button className="w-[50%] font-bold bg-login-button text-white m-20px rounded-2xl border-0 transition-all" onClick={handleOTPLogin}>Log In</Button>
                        </div>
                      </div>
                      </CardContent>
              </Card>
          </div>
            <NotificationDialog  
                _open={openDialog}
                _title={dialogTitleRef.current}
                _message={dialogMessageRef.current}
                _buttonnames={dialogButtonsRef.current}
                _handleButtonLeft={handleCancelLogin}
                _handleButtonCenter={handleRetryLogin}
                _handleButtonRight={handleRetryOTP}
                _data={dialogDataRef.current}
            />
      </div>
    );
}

export default LoginOTP;