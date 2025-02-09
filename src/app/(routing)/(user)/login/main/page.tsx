'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form";
import { FormSchema, FormSchemaType } from "./data/form-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { handleLoadUserByEmail, updateUserOTPByEmail } from "@/lib/db";
import { EmailType, UserType } from "@/types/ecafe";
import { useRouter } from "next/navigation";
import { generateOTP } from "@/lib/utils";
import { handleSendEmail } from "@/lib/api";

const LoginMain = () => {

const {push} = useRouter();

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

useEffect(() => {
    const element: HTMLInputElement|null = document.getElementById("email") as HTMLInputElement;
    element?.select();
}, []);

const userUpdatedCallback = (data: any) => {
    console.log("USER UPDATED", data);
}

const sendEmailCallback = (data: any) => {
    console.log("EMAIL DATA", JSON.stringify(data));
    if (!data.error) {
        const info: EmailType = {
            userId: data.userId,
            OTPcode: data.otp,
            destination: data.email                
        }

        updateUserOTPByEmail(info, userUpdatedCallback);
    }
}

const userByEmailLoadedCallback = (data: UserType[]) => {
    console.log("Loaded user = ", data);

    if (data) {
        const user: UserType = data[0];
        if (user.passwordless) {
            const OTP: string = generateOTP();

            const email: EmailType = {
                destination: user.email,
                userId: user.id!,
                OTPcode: OTP,
            }

            handleSendEmail(email, sendEmailCallback);

            push("/login/OTP");
        } else {
            push("/login/password");
            // route to password
        }
    } else {
        // NOTIFICATION NO USER FOUND
    }
}

const onSubmit = (data: any) => {
    handleLoadUserByEmail(data.email, userByEmailLoadedCallback)
    console.log("onSubmit Login Form");
}

const {handleSubmit, register, formState: {errors}} = formMethods;

return (
    <div className="w-[100%] h-[100%]">
        <div className="flex items-center justify-center">
            <Card className="mt-[20%] max-w-[350px] bg-[#F8F9FD] rounded-3xl p-[25px] border-[5px] border-solid border-[#FFFFFF] bg-login-pattern shadow-login-shadow m-5">
                <CardHeader>
                    <CardTitle className="flex justify-center text-center font-black text-3xl text-blue-400">Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center">
                        <form className="form" onSubmit={handleSubmit(onSubmit)}>
                            <div className="block space-y-2">
                                <div className="w-[100%] grid grid-cols-12 items-center space-x-2">
                                    <Label className="col-span-2 text-black" htmlFor="email">Email:</Label>
                                    <Input
                                        type="text" 
                                        id="email"
                                        placeholder="email..."
                                        className="h-8 col-span-9 text-black"
                                        {...register("email")}
                                    />
                                </div>
                                {errors.email && errors.email.type === "too_small" && <span className="text-red-500" role="alert">Email is required</span>}
                                {errors.email && errors.email.type === "invalid_string" && <span className="text-red-500" role="alert">Email is invalid</span>}
                                <Button className="w-[100%] font-bold bg-login-button text-white m-20px rounded-2xl border-0 transition-all" type="submit">Continue</Button>
                            </div>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
)
}

export default LoginMain