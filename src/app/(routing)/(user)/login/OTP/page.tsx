'use client'

import NotificationDialog from "@/components/ecafe/notification-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { MaxLoginAttemps } from "@/data/constants";
import { useDebug } from "@/hooks/use-debug";
import { useUser } from "@/hooks/use-user";
import { ConsoleLogger } from "@/lib/console.logger";
import { createHistory, createTask, handleLoadOTP, handleLoadUserById, handleUpdateOtp, handleUpdateUser } from "@/lib/db";
import { ExtendedUserType, NotificationButtonsType, OtpType, TaskType, UserType } from "@/types/ecafe";
import { register } from "module";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FormSchema, FormSchemaType } from "./data/form-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createHistoryType, js } from "@/lib/utils";
import { useProgressBar } from "@/hooks/use-progress-bar";
import { ACTION_TYPE_USER, ACTION_UNBLOCK_USER } from "@/app/(routing)/task/[id]/data/taskInfo";
import { ApiResponseType } from "@/types/db";


const LoginOTP = () => {
  const {push} = useRouter();
  const {login} = useUser();
  const {debug} = useDebug();
  const searchParams = useSearchParams();
  const progress = useProgressBar();

  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const otpId = searchParams.get("otpId");
  if (otpId) {
    logger.debug("LoginOTP", "OTP Login", otpId);
  }

  const formMethods = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otpcode: "",
    },
  })
  const {handleSubmit, getValues, setValue, register, formState: {errors}} = formMethods;

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const setDialogState = (state: boolean): void => {
      setOpenDialog(state);
  }

  const user = useRef<UserType|undefined>(undefined);
  const otp = useRef<OtpType|undefined>(undefined);

  const [retry, setRetry] = useState<number>(0);

  const dialogTitleRef = useRef<string>("");
  const dialogMessageRef = useRef<string>("");
  const dialogButtonsRef = useRef<NotificationButtonsType>({leftButton: "No", rightButton: "Yes"});
  const dialogDataRef = useRef<any>(undefined);
  
  const handleInvalidOtpCode = (attemps: number) => {
    logger.debug("LoginOTP", "OTP code invalid", "Show notification");
    dialogTitleRef.current = `Invalid OTP code (attemp ${attemps+1}/${MaxLoginAttemps})`;
    dialogMessageRef.current = "OTP code incorrect. Retry Login or OTP again?";
    dialogButtonsRef.current = {leftButton: "Cancel", centerButton: "Back to Login", rightButton: "Retry OTP"};

    setDialogState(true);
  }

  const handleAttempsExceeded = () => {
    logger.debug("LoginOTP", "OTP login attemps exceed", "Show notification");
    dialogTitleRef.current = `Attemps exceeded ${MaxLoginAttemps}`;
    dialogMessageRef.current = "Too many retries. Retry Login ?";
    dialogButtonsRef.current = {leftButton: "Cancel", centerButton: "Retry Login"};

    setDialogState(true);
  }

  const handleAccountBlocked = () => {
    logger.debug("LoginOTP", "OTP Account is blocked", "Show notification");
    dialogTitleRef.current = `Attemps exceeded ${MaxLoginAttemps}`;
    dialogMessageRef.current = "Your cccount is blocked. Contact your admin.";
    dialogButtonsRef.current = {leftButton: "Cancel"};

    setDialogState(true);
  }

  const redirect = (href: string) => {
      progress.start(); // show the indicator
  
      startTransition(() => {
        push(href);
        progress.done(); // only runs when the destination page is fully loaded
        });
  }

  const focusToOTPInput = () => {
    setValue("otpcode", "");

    const element: HTMLInputElement|null = document.getElementById("otpinput") as HTMLInputElement;
    if (element) {
      element.focus();
    }
  }

  const userLoadedOnEntryCallback = (data: ApiResponseType) => {
    if (data.status === 200) {
      user.current = data.payload; 
      logger.debug("LoginPassword", "User loaded on entry", data.payload.id);
    }
  }

  const otpLoadedOnEntryCallback = (_data: ApiResponseType) => {
    if (_data.status === 200) {
      const otpData: OtpType = _data.payload;
      logger.debug("LoginPassword", "Otp loaded on entry", otpData.id);

      otp.current = otpData;
      handleLoadUserById(otpData.userId!, userLoadedOnEntryCallback)
    }
  }
  
  useEffect(() => {
    if (otpId) {
      handleLoadOTP(otpId, otpLoadedOnEntryCallback)
    }

    focusToOTPInput();
  }, []);

  useEffect(() => {
    focusToOTPInput();
  }, [retry]);

  const userLoadedCallback = (data: any) => {
    logger.debug("LoginOTP", "OTP login login success", "data", JSON.stringify(data));

    if (data.status === 200) {
      logger.debug("LoginOTP", "userLoadedCallback", "user found -> set user", JSON.stringify(data.payload));
      createHistory(createHistoryType("info", "Valid login", `${data.email} logged in as authorised.`, "Login[OTP]"));
      login(data.payload);
      redirect("/dashboard")
    } else {
      logger.debug("LoginOTP", "userLoadedCallback", "user not found -> ERROR");
    }
  }

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

    createHistory(createHistoryType("info", "Valid login", `${_email} logged in as guest.`, "Login[OTP]"));
    login(user);
    redirect("/dashboard")
  }

  const otpLoadedCallback = (_data: ApiResponseType) => {
    logger.debug("LoginOTP", "otpLoadedCallback", js(_data));
    if (_data.status === 200) {
      const otp: OtpType = _data.payload;

      logger.debug("LoginOTP", "otpLoadedCallback", "entered value = ", js(getValues("otpcode")));
      logger.debug("LoginOTP", "otpLoadedCallback", "stored OTP = ", js(otp));

      if (otp.OTP !== getValues("otpcode")) {
        logger.debug("LoginOTP", "otpLoadedCallback", "OTP invalid");
        createHistory(createHistoryType("info", "Invalid login", `${getValues("otpcode")} doesn't match ${otp.OTP}.`, "Login[OTP]"));

        otp.attemps++;

        handleUpdateOtp(otp, ()=>{});

        if (otp.attemps >= MaxLoginAttemps) {
          createHistory(createHistoryType("info", "Invalid login", `${otp.email} attemps exceeded.`, "Login[OTP]"));

          if (user.current) {
            const _user: ExtendedUserType = {
              id: user.current.id,
              name: user.current.name,
              firstname: user.current.firstname,
              email: user.current.email,
              password: user.current.password,
              passwordless: user.current.passwordless,
              phone: user.current.phone,
              attemps: otp.attemps,
              blocked: true,
              address: user.current.address,
              roles: {},
              policies: {},
              groups: {}
            }
          
            handleUpdateUser(_user, ()=>{});

            const task: TaskType = {
                name: ACTION_UNBLOCK_USER,
                description: `Unblock the user from email ${user.current.email}`,
                subject: ACTION_TYPE_USER,
                subjectId: user.current.id,
                status: "open"
            }
                    
            logger.debug("LoginPassword", "userLoadedCallback", "Create Task", js(task));
            createHistory(createHistoryType("action", "Task created", `Unblock ${user.current.email}`, "Login[Password]"));
            createTask(task, () => {});
          
            handleAccountBlocked();
          } else {
            handleAttempsExceeded();
          }
        } else {
          logger.debug("LoginOTP", "otpLoadedCallback", "Update attemps");

          createHistory(createHistoryType("info", "Invalid login", `${getValues("otpcode")} doesn't match ${otp.OTP}.`, "Login[OTP]"));
          handleInvalidOtpCode(otp.attemps);
        }
      } else {
        if (otp.used) {
          createHistory(createHistoryType("info", "Invalid login", `${otp.OTP} was already used for ${otp.email}.`, "Login[OTP]"));
          logger.debug("LoginOTP", "otpLoadedCallback", "OTP code already used", "Show notification");
          dialogTitleRef.current = `OTP code invalid`;
          dialogMessageRef.current = "OTP code already used. Retry Login?";
          dialogButtonsRef.current = {leftButton: "Cancel", centerButton: "Retry"};
      
          setDialogState(true);
        } else {
          otp.used = true;
          handleUpdateOtp(otp, ()=>{});

          logger.debug("LoginOTP", "otpLoadedCallback", "OTP valid");
          if (user.current) {
            logger.debug("LoginOTP", "otpLoadedCallback", "user already loaded: use it", user.current.id);
            userLoadedCallback({status: 200, payload: user.current});
          } else if (otp.userId && otp.userId > 0) {
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
    redirect(url);
  }
  
  const handleCancelLogin = () => {
    logger.debug("LoginOTP", "handleCancelLogin");
    cancelDialogAndRedirect("/");
  }

  const handleRetryLogin = () => {
    logger.debug("LoginOTP", "handleRetryLogin");
    cancelDialogAndRedirect("/login/main");
  }

  const handleRetryOTP = () => {
    logger.debug("LoginOTP", "handleRetryOTP");
    // setRetry((x: number) => x+1);
    cancelDialogAndRedirect("/login/OTP?otpId="+otpId);
  }

  const onSubmit = (data: any) => {
    logger.debug("LoginOTP", "onSubmit Login Form: ", otpId);
    if (otpId) {
      if (otp.current) {
        logger.debug("LoginOTP", "OTP with id already loaded", otp.current.id);

        otpLoadedCallback({status: 200, payload: otp.current});
      } else if (otpId) {
        logger.debug("LoginOTP", "Load OTP with id", otpId);
        handleLoadOTP(otpId, otpLoadedCallback);
      }
    }
  }

  const getUserName = (): string => {
    if (user.current) {
      return (`${user.current.firstname} ${user.current.name}`);
    }

    return 'Guest';
  }

  return (
      <div className="w-[100%] h-[100%]">
        <div className="h-screen flex items-center justify-center">
            <Card className="mt-[20%] max-w-[350px] bg-[#F8F9FD] rounded-3xl p-[25px] border-[5px] border-solid border-[#FFFFFF] bg-login-pattern shadow-login-shadow m-5">
              <CardHeader>
                  <CardTitle className="flex justify-center text-center font-black text-3xl text-blue-400">Hello {getUserName()}</CardTitle>
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