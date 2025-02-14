'use client'

import NotificationDialog from "@/components/ecafe/notification-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { MaxLoginAttemps } from "@/data/constants";
import { useDebug } from "@/hooks/use-debug";
import { useUser } from "@/hooks/use-user";
import { ConsoleLogger } from "@/lib/console.logger";
import { addHistory, handleLoadOTP, handleLoadUserById, handleUpdateOtp } from "@/lib/db";
import { NotificationButtonsType, OtpType, UserType } from "@/types/ecafe";
import { register } from "module";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FormSchema, FormSchemaType } from "./data/form-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createHistoryType } from "@/lib/utils";


const LoginOTP = () => {
  const {push} = useRouter();
  const {login} = useUser();
  const {debug} = useDebug();

  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const formMethods = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otpcode: "",
    },
  })

  const {handleSubmit, getValues, setValue, register, formState: {errors}} = formMethods;

  // const [value, setValue] = useState("")
  const searchParams = useSearchParams();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const setDialogState = (state: boolean): void => {
      setOpenDialog(state);
  }

  const dialogTitleRef = useRef<string>("");
  const dialogMessageRef = useRef<string>("");
  const dialogButtonsRef = useRef<NotificationButtonsType>({leftButton: "No", rightButton: "Yes"});
  const dialogDataRef = useRef<any>(undefined);
  
  logger.debug("LoginOTP", "Reading OTP ID");
  const otpId = searchParams.get("otpId");
  logger.debug("LoginOTP", "OTP ID = " + otpId);

  if (otpId) {
    logger.debug("LoginOTP", "OTP for email", otpId);
  }

  const handleInvalidOtpCode = (attemps: number) => {
    logger.debug("LoginOTP", "OTP code invalid", "Show notification");
    dialogTitleRef.current = `Invalid OTP code (attemp ${attemps+1}/${MaxLoginAttemps})`;
    dialogMessageRef.current = "OTP code incorrect. Retry Login or OTP again?";
    dialogButtonsRef.current = {leftButton: "Cancel", centerButton: "Login", rightButton: "OTP"};

    setDialogState(true);
  }

  const handleAttempsExceeded = () => {
    logger.debug("LoginOTP", "OTP login attemps exceed", "Show notification");
    dialogTitleRef.current = `Attemps exceeded ${MaxLoginAttemps}`;
    dialogMessageRef.current = "Too many retries. Retry Login ?";
    dialogButtonsRef.current = {leftButton: "Cancel", centerButton: "Login"};

    setDialogState(true);
  }

  const userLoadedCallback = (data: any) => {
    logger.debug("LoginOTP", "OTP login login success", "data", JSON.stringify(data));

    if (data.status === 200) {
      logger.debug("LoginOTP", "userLoadedCallback", "user found -> set user", JSON.stringify(data.payload));
      addHistory(createHistoryType("info", "Valid login", `${data.email} logged in as authorised.`, "Login[OTP]"));
      login(data.payload);
      push("/dashboard")
    } else {
      logger.debug("LoginOTP", "userLoadedCallback", "user not found -> ERROR");
    }
  }

  const focusToOTPInput = () => {
    const element: HTMLInputElement|null = document.getElementById("otpinput") as HTMLInputElement;
    if (element) {
      element.focus();
    }
  }

  useEffect(() => {
    setValue("otpcode", "");
    focusToOTPInput();
  }, []);

  const [retry, setRetry] = useState<number>(0);

  useEffect(() => {
    setValue("otpcode", "");
    focusToOTPInput();
  }, [retry]);

  const setGuest = (_email: string) => {
    const user: UserType = {
      name: "",
      firstname: "guest",
      email: _email,
      password: "",
      phone: "",
      attemps: 0,
      blocked: false
    }
    logger.debug("LoginOTP", "OTP login as guest", "set user", JSON.stringify(user));

    addHistory(createHistoryType("info", "Valid login", `${_email} logged in as guest.`, "Login[OTP]"));
    login(user);
    push("/dashboard")
  }

  const otpLoadedCallback = (data: any) => {
    logger.debug("LoginOTP", "otpLoadedCallback", JSON.stringify(data));
    if (data.status === 200) {
      const otp: any = data.payload;

      logger.debug("LoginOTP", "otpLoadedCallback", "value = ", JSON.stringify(getValues("otpcode")));
      logger.debug("LoginOTP", "otpLoadedCallback", "OTP = ", JSON.stringify(otp));

      if (otp.OTP !== getValues("otpcode")) {
        logger.debug("LoginOTP", "otpLoadedCallback", "OTP invalid");
        otp.attemps++;

        if (otp.attemps >= MaxLoginAttemps) {
          addHistory(createHistoryType("info", "Invalid login", `${data.email} attemps exceeded.`, "Login[OTP]"));
          handleAttempsExceeded();          
        } else {
          handleUpdateOtp(otp, ()=>{});
          addHistory(createHistoryType("info", "Invalid login", `${getValues("otpcode")} doesn't match ${data.OTP}.`, "Login[OTP]"));
          handleInvalidOtpCode(otp.attemps);
        }
      } else {
        if (otp.used) {
          addHistory(createHistoryType("info", "Invalid login", `${data.OTP} was already used for ${data.email}.`, "Login[OTP]"));
          logger.debug("LoginOTP", "otpLoadedCallback", "OTP code already used", "Show notification");
          dialogTitleRef.current = `OTP code invalid`;
          dialogMessageRef.current = "OTP code already used. Retry Login?";
          dialogButtonsRef.current = {leftButton: "Cancel", centerButton: "Login"};
      
          setDialogState(true);
        } else {
          otp.used = true;
          handleUpdateOtp(otp, ()=>{});

          logger.debug("LoginOTP", "otpLoadedCallback", "OTP valid");
          if (otp.userId && otp.userId > 0) {
            logger.debug("LoginOTP", "otpLoadedCallback", "OTP valid", "Load User", otp.userId);
            handleLoadUserById(otp.userId, userLoadedCallback);
          } else {
            logger.debug("LoginOTP", "otpLoadedCallback", "OTP valid", "No User => Guest", otp.email);
            setGuest(otp.email);
          }
        }
      }
    } else {
      logger.debug("LoginOTP", "otpLoadedCallback", "OTP not found (404)");
    }
  };

  const handleOTPLogin = () => {
    logger.debug("LoginOTP", "handleOTPLogin");

    if (otpId) {
      logger.debug("LoginOTP", "Load OTP with id", otpId);
      handleLoadOTP(otpId, otpLoadedCallback);
    }
  }

  const cancelDialogAndRedirect = (url: string) => {
    logger.debug("LoginOTP", "Close dialog and redirect", url);
    setDialogState(false);
    push(url);
  }
  
  const handleCancelLogin = () => {
    logger.debug("LoginOTP", "handleCancelLogin");
    cancelDialogAndRedirect("/dashboard");
  }

  const handleRetryLogin = () => {
    logger.debug("LoginOTP", "handleRetryLogin");
    cancelDialogAndRedirect("/login/main");
  }

  const handleRetryOTP = () => {
    logger.debug("LoginOTP", "handleRetryOTP");
    setRetry((x: number) => x+1);
    cancelDialogAndRedirect("/login/OTP?otpId="+otpId);
  }

  const onSubmit = (data: any) => {
    logger.debug("LoginOTP", "onSubmit Login Form: ", otpId);
    if (otpId) {
      logger.debug("LoginOTP", "Load OTP with id", otpId);
      handleLoadOTP(otpId, otpLoadedCallback);
    }
  }

  return (
      <div className="w-[100%] h-[100%]">
        <div className="h-screen flex items-center justify-center">
            <Card className="mt-[20%] max-w-[350px] bg-[#F8F9FD] rounded-3xl p-[25px] border-[5px] border-solid border-[#FFFFFF] bg-login-pattern shadow-login-shadow m-5">
              <CardHeader>
                  <CardTitle className="flex justify-center text-center font-black text-3xl text-blue-400">Sign In</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...formMethods}>
                  <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    {/* <div className="block justify-center space-y-2"> */}
                      {/* <div className="justify-center text-black text-sm">
                        An email was sent to your account with a code. Enter this code here.
                      </div> */}
                      {/* <div> */}
                      <FormField
                        control={formMethods.control}
                        name="otpcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black font-bold">OTP</FormLabel>
                            <FormControl>
                              <InputOTP maxLength={6} {...field} id="otpinput">
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
                            </FormControl>
                            <FormDescription className="text-black">
                              An email was sent to your account with a code. Enter this code here.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-center">
                        <Button className="w-[50%] font-bold bg-login-button text-white m-20px rounded-2xl border-0 transition-all" onClick={handleOTPLogin}>Log In</Button>
                      </div>
                    {/* </div> */}
                  </form>
                </Form>
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