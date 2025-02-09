import { EmailTemplate } from '@/app/(routing)/(user)/login/main/data/email-template';
import { EmailType } from '@/types/ecafe';
import { NextRequest } from 'next/server';
import { ErrorResponse, Resend } from 'resend';

const resend = new Resend("re_SeGteF2V_Kb5S4zixiMJFUrFFeAa2dvXd");

type EmailSendType = {
    body: any,
    otp: string,
    email: string,
    userId: number
}

export async function POST(req: NextRequest) {
    const _data: EmailType = await req.json();

    console.log("SENDING EMAIL");

    try {
        const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: _data.destination,
        subject: 'eCAFé OTP Code',
        react: EmailTemplate({ otpcode: _data.OTPcode }),
        });


        if (error) {
            console.log("SENDING EMAIL => ERROR", error);
            return Response.json({ error }, { status: 500 });
        }

        console.log("SENDING EMAIL => SUCCESS");

        const sendInfo: EmailSendType = {
            body: data,
            otp: _data.OTPcode,
            email: _data.destination,
            userId: _data.userId,
        }

        return Response.json(sendInfo);
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}