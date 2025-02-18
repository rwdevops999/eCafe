'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { FormSchema, FormSchemaType } from "./data/form-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { startTransition, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { createHistory, createTask, handleLoadUserById, handleUpdateUser } from "@/lib/db";
import { ConsoleLogger } from "@/lib/console.logger";
import { ExtendedUserType, NotificationButtonsType, TaskType, UserType } from "@/types/ecafe";
import { useUser } from "@/hooks/use-user";
import { MaxLoginAttemps } from "@/data/constants";
import NotificationDialog from "@/components/ecafe/notification-dialog";
import { useDebug } from "@/hooks/use-debug";
import { ACTION_TYPE_USER, ACTION_UNBLOCK_USER } from "@/app/(routing)/task/[id]/data/taskInfo";
import { createHistoryType, js } from "@/lib/utils";
import { useProgressBar } from "@/hooks/use-progress-bar";
import { ApiResponseType } from "@/types/db";

const LoginPassword = () => {
  const searchParams = useSearchParams();
  const {login} = useUser();
  const {push} = useRouter();
  const {debug} = useDebug();
  const progress = useProgressBar();

  const redirect = (href: string) => {
      progress.start(); // show the indicator
  
      startTransition(() => {
        push(href);
        progress.done(); // only runs when the destination page is fully loaded
        });
  }


  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const userId = searchParams.get("userId");

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const setDialogState = (state: boolean): void => {
      setOpenDialog(state);
  }

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

  const {handleSubmit, getValues, setValue, register, formState: {errors}} = formMethods;
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const handleSwitchPassword = () => {
    setViewPassword(!viewPassword);
  }

  const dialogTitleRef = useRef<string>("");
  const dialogMessageRef = useRef<string>("");
  const dialogButtonsRef = useRef<NotificationButtonsType>({leftButton: "No", rightButton: "Yes"});
  const dialogDataRef = useRef<any>(undefined);
  
  const handleAttempsExceeded = () => {
    dialogTitleRef.current = `Attemps exceeded ${MaxLoginAttemps}`;
    dialogMessageRef.current = "Too many retries. User blocked. Contact your administrator.";
    dialogButtonsRef.current = {leftButton: "Cancel"};

    setDialogState(true);
  }

  const handleInvalidPassword = (attemps: number) => {
    dialogTitleRef.current = `Invalid password (attemp ${attemps+1}/${MaxLoginAttemps})`;
    dialogMessageRef.current = "Password incorrect. Retry Login again?";
    dialogButtonsRef.current = {leftButton: "Cancel", rightButton: "Retry"};
  
    setDialogState(true);
  }
  
  const focusToPasswordInput = () => {
    const element: HTMLInputElement|null = document.getElementById("password") as HTMLInputElement;
    if (element) {
      element.focus();
    }
}

  useEffect(() => {
      focusToPasswordInput();
  }, []);

  const user = useRef<UserType|undefined>(undefined);

  const userLoadedOnEntryCallback = (data: ApiResponseType) => {
    if (data.status === 200) {
      user.current = data.payload; 
    }
  }

  useEffect(() => {
    if (userId) {
      handleLoadUserById(parseInt(userId), userLoadedOnEntryCallback);
    }      

    focusToPasswordInput();
  }, [userId]);

  const [retry, setRetry] = useState<number>(0);

  useEffect(() => {
    setValue("password", "");
    focusToPasswordInput();
  }, [retry]);

  const userLoadedCallback = (data: any) => {
    if (data.status === 200) {
      const user: UserType = data.payload;

      if (user.password === getValues("password")) {
        createHistory(createHistoryType("info", "Valid login", `${user.email} logged in as authorized`, "Login[Password]"));
        login(user);
        redirect("/dashboard")
      } else {
        const attemps: number = user.attemps + 1;

        const _user: ExtendedUserType = {
          id: user.id,
          name: user.name,
          firstname: user.firstname,
          email: user.email,
          password: user.password,
          passwordless: user.passwordless,
          phone: user.phone,
          attemps: attemps,
          blocked: user.blocked,
          address: user.address,
          roles: {},
          policies: {},
          groups: {}
        }

        if (attemps >= MaxLoginAttemps) {
          _user.blocked = true;
          createHistory(createHistoryType("action", "Invalid login", `${user.email} will be blocked (too many attemps)`, "Login[Password]"));
          handleUpdateUser(_user, ()=>{});

          const task: TaskType = {
              name: ACTION_UNBLOCK_USER,
              description: `Unblock the user from email ${user.email}`,
              subject: ACTION_TYPE_USER,
              subjectId: user.id,
              status: "open"
          }
          
          createHistory(createHistoryType("action", "Task created", `Unblock ${user.email}`, "Login[Password]"));
          createTask(task, () => {});
          
          handleAttempsExceeded();          
        } else {
          handleUpdateUser(_user, ()=>{});
          createHistory(createHistoryType("action", "User updated", `Attemps adjusted`, "Login[Password]"));
          handleInvalidPassword(user.attemps);
        }
      }
    }
  }

  const cancelDialogAndRedirect = (url: string) => {
    setDialogState(false);
    redirect(url);
  }
  
  const handleCancelLogin = () => {
    cancelDialogAndRedirect("/");
  }

  const handleRetryLogin = () => {
    setRetry((x: number) => x+1);
    cancelDialogAndRedirect("/login/password?userId="+userId);
  }

  const onSubmit = (data: any) => {
    if (user.current) {
      userLoadedCallback({status: 200, payload: user.current});
    } else if (userId) {
      handleLoadUserById(parseInt(userId), userLoadedCallback);
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
                    <CardTitle className="flex justify-center text-center font-black text-3xl text-blue-400 mb-5">Hello {getUserName()}. Enter your password</CardTitle>
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
                                  autoComplete="on"
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
        <NotificationDialog  
            _open={openDialog}
            _title={dialogTitleRef.current}
            _message={dialogMessageRef.current}
            _buttonnames={dialogButtonsRef.current}
            _handleButtonLeft={handleCancelLogin}
            _handleButtonRight={handleRetryLogin}
        />
    </div>
)
}

export default LoginPassword;