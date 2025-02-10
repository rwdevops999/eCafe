'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form";
import { FormSchema, FormSchemaType } from "./data/form-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { createOTP, createTask, handleLoadUserByEmail, updateUserOTPByEmail } from "@/lib/db";
import { EmailSendType, EmailType, NotificationButtonsType, OtpType, TaskType, UserType } from "@/types/ecafe";
import { useRouter } from "next/navigation";
import { generateOTP } from "@/lib/utils";
import { handleSendEmail } from "@/lib/api";
import NotificationDialog from "@/components/ecafe/notification-dialog";
 
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

    const otpCreatedCallback = (data: any) => {
        const task: TaskType = {
            name: "Remove",
            description: "Remove from OTP",
            subject: "OTP",
            subjectId: data.id
        }

        createTask(task, ()=>{});

        setDialogState(false);
        push("/login/OTP?otpId="+data.id);
    }

    const sendEmailCallback = (data: any) => {
        console.log("EMAIL DATA", JSON.stringify(data));
        if (data.status === 200) {
            const info: OtpType = {
                userId: data.userId,
                otp: data.otp,
                email: data.email,
                attemps: 0,
            }

            createOTP(info, otpCreatedCallback);
        }
    }

    const handleRetryLogin = () => {
        setDialogState(false);
        setValue("email", "");
        setRefocus((old: boolean) => !old);
        push("/login/main");
    }

    const generateOtpAndSendByEmail = (data: OtpType) => {
        const OTP: string = generateOTP();

        const email: EmailType = {
            destination: data.email,
            OTPcode: OTP,
            attemps: 0
        }

        console.log("SEND EMAIL");
        handleSendEmail(email, sendEmailCallback);
    }

    const handleOTP = (name: string, data: OtpType) => {
        generateOtpAndSendByEmail(data);

        // setDialogState(false);
        // push("/login/OTP?email="+data.email);
    }

    const handleCancelLogin = (name: string) => {
        console.log("HandleButton", name);
    
        setDialogState(false);
        push("/dashboard");
    }
    
    const userByEmailLoadedCallback = (data: UserType[]) => {
        console.log("Loaded data = ", JSON.stringify(data));
        const user: UserType = data[0];
        console.log("Loaded user = ", JSON.stringify(user));

        if (user.id) {
            if (user.passwordless) {
                const otpData: OtpType = {
                    email: user.email,
                    attemps: 0,
                    userId: user.id,
                    otp: ""
                }

                generateOtpAndSendByEmail(otpData);

                push("/login/OTP?userId="+user.id);
            } else {
                push("/login/password?userId="+user.id);
            }
        } else {
            dialogTitleRef.current = "User not found";
            dialogMessageRef.current = "No user found with this email. Do you want to retry or use OTP?"
            dialogButtonsRef.current = {leftButton: "No", centerButton: "Yes", rightButton: "use OTP"};

            const data: OtpType = {
                attemps: 0,
                email: user.email,
                otp: ""                 
            }

            dialogDataRef.current = data;

            setDialogState(true);
        }
    }

    const onSubmit = (data: any) => {
        handleLoadUserByEmail(data.email, userByEmailLoadedCallback)
        console.log("onSubmit Login Form");
    }

    return (
        <div className="w-[100%] h-[100%]">
            <div className="flex items-center justify-center">
                <Card className="mt-[20%] max-w-[350px] bg-[#F8F9FD] rounded-3xl p-[25px] border-[5px] border-solid border-[#FFFFFF] bg-login-pattern shadow-login-shadow m-5">
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