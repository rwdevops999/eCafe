import { EmailTemplate } from '@/app/(routing)/(user)/login/main/data/email-template';
import { EmailSendType, EmailType } from '@/types/ecafe';
import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponse, Resend } from 'resend';
import * as nodemailer from 'nodemailer';

// import nodemailer from 'nodemailer';

const resend = new Resend("re_SeGteF2V_Kb5S4zixiMJFUrFFeAa2dvXd");

export async function POST(req: NextRequest) {
    const _data: EmailType = await req.json();

    console.log("SENDING EMAIL");

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.GMAIL_FROM,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      })
      console.log("sending email to", _data.destination);
      try {
        await transporter.sendMail({
          from: process.env.GMAIL_FROM, // sender address
          to: _data.destination, // list of receivers
          subject: 'eCAFé OTP Code', // Subject line
          text: `Welcome, the login code for eCafé is ${_data.OTPcode}`, // plain text body
          html: `<b>Welcome, the login code for eCafé is ${_data.OTPcode}</b>` // html body
        })
        console.log("email sent");

        const sendInfo: EmailSendType = {
            status: 200,
            otp: _data.OTPcode,
            email: _data.destination,
            userId: _data.userId??0,
        }

    return NextResponse.json(sendInfo)
      } catch (err) {
        console.log("email error", err);
        return NextResponse.json({ status: 500 })
      }
    }