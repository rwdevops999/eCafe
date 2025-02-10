'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form";
import { FormSchema, FormSchemaType } from "./data/form-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { createOTP, createTask, handleLoadUserByEmail } from "@/lib/db";
import { EmailType, NotificationButtonsType, OtpType, TaskType, UserType } from "@/types/ecafe";
import { useRouter } from "next/navigation";
import { generateOTP } from "@/lib/utils";
import { handleSendEmail } from "@/lib/api";
import NotificationDialog from "@/components/ecafe/notification-dialog";
import { ConsoleLogger } from "@/lib/console.logger";
 
const logger = new ConsoleLogger({ level: 'debug' });

const LoginMain = () => {
    const {push} = useRouter();

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

    const {handleSubmit, setValue, register, formState: {errors}} = formMethods;

    const focusToEmailInfo = () => {
        const element: HTMLInputElement|null = document.getElementById("email") as HTMLInputElement;
        element?.select();
    }

    useEffect(() => {
        focusToEmailInfo();
    }, []);

    const [refocus, setRefocus] = useState<boolean>(false);

    useEffect(() => {
        focusToEmailInfo();
    }, [refocus]);

    const taskCreatedCallback = () => {
        logger.debug("LoginMain", "Task Created");
    }

    const otpCreatedCallback = (data: any) => {
        logger.debug("LoginMain", "otpCreatedCallback", "OTP Created", JSON.stringify(data));

        const task: TaskType = {
            name: "Remove",
            description: "Remove from OTP",
            subject: "OTP",
            subjectId: data.id,
            status: "open"
        }

        logger.debug("LoginMain", "otpCreatedCallback", "Create Task", JSON.stringify(task));
        createTask(task, taskCreatedCallback);

        logger.debug("LoginMain", "otpCreatedCallback", "Close Dialog and Redirect to LoginOTP with OtpId", data.id);
        setDialogState(false);
        push("/login/OTP?otpId="+data.id);
    }

    const sendEmailCallback = (data: any) => {
        logger.debug("LoginMain", "sendEmailCallback", JSON.stringify(data));
        if (data.status === 200) {
            const info: OtpType = {
                userId: data.userId,
                otp: data.otp,
                email: data.email,
                attemps: 0,
            }

            logger.debug("LoginMain", "sendEmailCallback", "Creating OTP", JSON.stringify(info));
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
        push("/login/main");
    }

    const generateOtpAndSendByEmail = (data: OtpType) => {
        logger.debug("LoginMain", "generate OTP and ...");
        const OTP: string = generateOTP();

        const email: EmailType = {
            destination: data.email,
            OTPcode: OTP,
            attemps: 0
        }

        logger.debug("LoginMain", "... send email", JSON.stringify(email));
        handleSendEmail(email, sendEmailCallback);
    }

    const closeDialogAndRedirect = (url: string) => {
        logger.debug("LoginMain", "Close Dialog and redirect to URL", url);

        setDialogState(false);
        push(url);
    }

    const handleOTP = (name: string, data: OtpType) => {
        logger.debug("LoginMain", "handleOTP");
        generateOtpAndSendByEmail(data);
    }

    const handleCancelLogin = (name: string) => {
        logger.debug("LoginMain", "handleCancelLogin");
    
        closeDialogAndRedirect("/dashboard");
    }
    
    const handleUserBlocked = () => {
        logger.debug("LoginMain", "handleUserBlocked", "User is blocked => Show notification");
        dialogTitleRef.current = "User blocked";
        dialogMessageRef.current = "Your account is blocked. Please contact the admin?"
        dialogButtonsRef.current = {leftButton: "Cancel"};
    }

    const userByEmailLoadedCallback = (_data: any, _email: string) => {
        logger.debug("LoginMain", "userByEmailLoadedCallback", JSON.stringify(_data), _email);

        if (_data.status === 200) {
            const user: UserType = _data.payload;

            if (user.blocked) {
                handleUserBlocked();
            }

            logger.debug("LoginMain", "userByEmailLoadedCallback", JSON.stringify(user));

            if (user.passwordless) {
                logger.debug("LoginMain", "userByEmailLoadedCallback", "PASSWORDLESS");
                const otpData: OtpType = {
                    email: user.email,
                    attemps: 0,
                    userId: user.id,
                    otp: ""
                }

                logger.debug("LoginMain", "userByEmailLoadedCallback", "GenerateOtp and Send email", JSON.stringify(otpData));
                generateOtpAndSendByEmail(otpData);
            } else {
                logger.debug("LoginMain", "userByEmailLoadedCallback", "WITH PASSWORD => Redirect to LoginPassword", user.id);
                push("/login/password?userId="+user.id);
            }
        }
          
        logger.debug("LoginMain", "userByEmailLoadedCallback", "Some Problem => Show notification");
        dialogTitleRef.current = "User not found";
        dialogMessageRef.current = "No user found with this email. Do you want to retry or use OTP?"
        dialogButtonsRef.current = {leftButton: "No", centerButton: "Yes", rightButton: "use OTP"};
    
        const otpData: OtpType = {
            attemps: 0,
            email: _email,
            otp: ""                 
        }
    
        dialogDataRef.current = otpData;
    
        setDialogState(true);
    }

    const onSubmit = (data: FormSchemaType) => {
        logger.debug("LoginMain", "SUBMITTING");
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
                                            id="email"
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
            <NotificationDialog  
                _open={openDialog}
                _title={dialogTitleRef.current}
                _message={dialogMessageRef.current}
                _buttonnames={dialogButtonsRef.current}
                _handleButtonLeft={handleCancelLogin}
                _handleButtonCenter={handleRetryLogin}
                _handleButtonRight={handleOTP}
                _data={dialogDataRef.current}
            />
        </div>
    )
}

export default LoginMain