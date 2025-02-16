import { createApiResponse } from '@/lib/utils';
import { EmailType } from '@/types/ecafe';
import { NextRequest, NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

// import nodemailer from 'nodemailer';

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

        return Response.json(createApiResponse(200, "Payload: EmailType", _data));
      } catch (err) {
        console.log("email error", err);
        return Response.json(createApiResponse(500, "Error sending email"))
      }
    }