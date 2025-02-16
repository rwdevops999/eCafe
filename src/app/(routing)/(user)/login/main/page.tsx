'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form";
import { FormSchema, FormSchemaType } from "./data/form-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { startTransition, useEffect, useRef, useState } from "react";
import { addHistory, createOTP, createTask, handleLoadUserByEmail } from "@/lib/db";
import { EmailType, NotificationButtonsType, OtpType, TaskType, UserType } from "@/types/ecafe";
import { useRouter } from "next/navigation";
import { createHistoryType, generateOTP, js } from "@/lib/utils";
import { handleSendEmail } from "@/lib/api";
import NotificationDialog from "@/components/ecafe/notification-dialog";
import { ConsoleLogger } from "@/lib/console.logger";
import { useDebug } from "@/hooks/use-debug";
import { ACTION_REMOVE_OTP, ACTION_TYPE_OTP } from "@/app/(routing)/task/[id]/data/taskInfo";
import { useProgressBar } from "@/hooks/use-progress-bar";
import { ApiResponseType } from "@/types/db";
 
const LoginMain = () => {
    const {push} = useRouter();
    const {debug} = useDebug();

    const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none') });

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const setDialogState = (state: boolean): void => {
        setOpenDialog(state);
    }

    const dialogTitleRef = useRef<string>("");
    const dialogMessageRef = useRef<string>("");
    const dialogButtonsRef = useRef<NotificationButtonsType>({leftButton: "No", rightButton: "Yes"});
    const dialogDataRef = useRef<any>(undefined);

    const formMethods = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
        },
        resetOptions: {
            keepDirtyValues: true,
            keepErrors: true
        }
    });

    const progress = useProgressBar();

    const redirect = (href: string) => {
       progress.start(); // show the indicator
   
       startTransition(() => {
         push(href);
         progress.done(); // only runs when the destination page is fully loaded
         });
    }

    const {handleSubmit, setValue, register, formState: {errors}} = formMethods;

    const focusToEmailInput = () => {
        logger.debug("MainLogin", "Focus On Email Input");
        const element: HTMLInputElement|null = document.getElementById("emailinput") as HTMLInputElement;
        logger.debug("MainLogin", "Focus On Email Input(element)", element);
        if (element) {
            element.focus();
        }
    }

    useEffect(() => {
        focusToEmailInput();
    }, []);

    const [refocus, setRefocus] = useState<boolean>(false);

    useEffect(() => {
        focusToEmailInput();
    }, [refocus]);

    const taskCreatedCallback = () => {
        logger.debug("LoginMain", "Task Created");
        addHistory(createHistoryType("action", "Task created", `Task created to remove the OTP code`, "Login[Email]"));
    }

    const otpCreatedCallback = (_data: ApiResponseType) => {
        if (_data.status === 201) {
            const otp: OtpType = _data.payload;

            logger.debug("LoginMain", "otpCreatedCallback", "OTP Created", js(otp));
            addHistory(createHistoryType("action", "OTP Created", `OTP ${otp.OTP} created for ${otp.email}`, "Login[Email]"));

            const task: TaskType = {
                name: ACTION_REMOVE_OTP,
                description: `Remove code for OTP ${otp.OTP}`,
                subject: ACTION_TYPE_OTP,
                subjectId: otp.id,
                status: "open",
            }

            createTask(task, taskCreatedCallback);

            logger.debug("LoginMain", "otpCreatedCallback", "Close Dialog and Redirect to LoginOTP with OtpId", data.id);
            setDialogState(false);
            redirect("/login/OTP?otpId="+otp.id);
        }
    }

    const sendEmailCallback = (data: any) => {
        logger.debug("LoginMain", "sendEmailCallback", JSON.stringify(data));

        if (data.status === 200) {
            const emailInfo: EmailType = data.payload;

            const info: OtpType = {
                userId: emailInfo.data,
                OTP: emailInfo.OTPcode,
                email: emailInfo.destination,
                attemps: emailInfo.attemps,
                used: false
            }

            createOTP(info, otpCreatedCallback);
        } else {
            logger.debug("LoginMain", "sendEmailCallback", "Send error", JSON.stringify(data.payload));
        }
    }

    const handleRetryLogin = () => {
        logger.debug("LoginMain", "handleRetryLogin", "Close Dialog and Redirect to LoginMain");
        setDialogState(false);
        setValue("email", "");
        setRefocus((old: boolean) => !old);
        redirect("/login/main");
    }

    const sendByEmail = (_emailInfo: EmailType) => {
        logger.debug("LoginMain", "... send email", js(_emailInfo));
    }

    const closeDialogAndRedirect = (url: string) => {
        logger.debug("LoginMain", "Close Dialog and redirect to URL", url);

        setDialogState(false);
        redirect(url);
    }

    const handleOTP = (name: string, data: OtpType) => {
        logger.debug("LoginMain", "handleOTP");

        const emailInfo: EmailType = {
            destination:data.email,
            OTPcode: generateOTP(),
            attemps: 0,
            data: data.userId
        }

        logger.debug("LoginMain", "userByEmailLoadedCallback", "send email", js(emailInfo));
        addHistory(createHistoryType("info", "Email", `Sending OTP code ${emailInfo.OTPcode} to ${emailInfo.destination}.`, "Login[Email]"));
        handleSendEmail(emailInfo, sendEmailCallback);
    }

    const handleCancelLogin = (name: string) => {
        logger.debug("LoginMain", "handleCancelLogin");
    
        closeDialogAndRedirect("/");
    }
    
    const handleUserBlocked = () => {
        logger.debug("LoginMain", "handleUserBlocked", "User is blocked => Show notification");
        dialogTitleRef.current = "Your account is blocked";
        dialogMessageRef.current = "Your account is blocked. Please contact the admin?"
        dialogButtonsRef.current = {leftButton: "Cancel"};

        setDialogState(true);
    }

    const userByEmailLoadedCallback = (_data: ApiResponseType, _email: string) => {
        logger.debug("LoginMain", "userByEmailLoadedCallback(data, email)", "user loaded using the email?", js(_data), _email);

        if (_data.status === 200) {
            const user: UserType = _data.payload;
            logger.debug("LoginMain", "userByEmailLoadedCallback(user)", "user is in DB", js(user));

            if (user.blocked) {
                addHistory(createHistoryType("info", "Invalid login", `Blocked user ${_email} tried to log in.`, "Login[Email]"));
                handleUserBlocked();
            } else if (user.passwordless) {
                logger.debug("LoginMain", "userByEmailLoadedCallback", "PASSWORDLESS");
                const emailInfo: EmailType = {
                    destination:user.email,
                    OTPcode: generateOTP(),
                    attemps: 0,
                    data: user.id
                }

                logger.debug("LoginMain", "userByEmailLoadedCallback", "send email", js(emailInfo));
                addHistory(createHistoryType("info", "Email", `Sending OTP code ${emailInfo.OTPcode} to ${emailInfo.destination}.`, "Login[Email]"));
                handleSendEmail(emailInfo, sendEmailCallback);
            } else {
                logger.debug("LoginMain", "userByEmailLoadedCallback", "User wants to login with password => Redirect to LoginPassword", user.id);
                redirect("/login/password?userId="+user.id);
            }
        } else {
            logger.debug("LoginMain", "userByEmailLoadedCallback", "User not in DB treat as guest => Show notification");
            dialogTitleRef.current = "User not found";
            dialogMessageRef.current = "No user found with this email. Do you want to retry or use OTP?"
            dialogButtonsRef.current = {leftButton: "Cancel", centerButton: "Retry", rightButton: "Use OTP"};
        
            const otpData: OtpType = {
                attemps: 0,
                email: _email,
                OTP: ""                 
            }
        
            dialogDataRef.current = otpData;
        
            setDialogState(true);
        }
    }

    const onSubmit = (data: FormSchemaType) => {
        logger.debug("LoginMain", "SUBMITTING");
        addHistory(createHistoryType("info", "Login try", `${data.email} tries to login`, "Login[Email]"));
        handleLoadUserByEmail(data.email, userByEmailLoadedCallback)
    }

    return (
        <div className="w-[100%] h-[100%]">
            <div className="h-screen flex items-center justify-center">
                <Card className="max-w-[350px] bg-[#F8F9FD] rounded-3xl p-[25px] border-[5px] border-solid border-[#FFFFFF] bg-login-pattern shadow-login-shadow m-5">
                    <CardHeader>
                        <CardTitle className="flex justify-center text-center font-black text-3xl text-blue-400 mb-5">Sign In</CardTitle>
                        <CardTitle className="flex justify-center text-center font-black text-sm text-black/50">Enter your email</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center">
                            <form className="form" onSubmit={handleSubmit(onSubmit)}>
                                <div className="block space-y-2">
                                    <div className="w-[100%] grid grid-cols-12 items-center space-x-2">
                                        {/* <Label className="col-span-2 text-black" htmlFor="email">Email:</Label> */}
                                        <Input
                                            type="text" 
                                            id="emailinput"
                                            placeholder="email..."
                                            className="h-8 col-span-12 text-black"
                                            {...register("email")}
                                        />
                                    </div>
                                    {errors.email && errors.email.type === "too_small" && <span className="text-red-500" role="alert">Email is required</span>}
                                    {errors.email && errors.email.type === "invalid_string" && <span className="text-red-500" role="alert">Email is invalid</span>}
                                    <Button className="w-[100%] font-bold bg-login-button text-stone-700 m-20px rounded-2xl border-0 transition-all" type="submit">Continue</Button>
                                </div>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {openDialog && <NotificationDialog  
                _open={openDialog}
                _title={dialogTitleRef.current}
                _message={dialogMessageRef.current}
                _buttonnames={dialogButtonsRef.current}
                _handleButtonLeft={handleCancelLogin}
                _handleButtonCenter={handleRetryLogin}
                _handleButtonRight={handleOTP}
                _data={dialogDataRef.current}
            />}
        </div>
    )
}

export default LoginMain