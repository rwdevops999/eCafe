import prisma from "@/lib/prisma";
import { EmailType, OtpType } from "@/types/ecafe";
import { NextRequest } from "next/server";

const createOtp = async (data: OtpType) => {
    let otp: any;
  
     await prisma.oTP.create({
      data: {
        OTP: data.otp,
        email: data.email,
        attemps: data.attemps,
        userId: data.userId
      }
    }).then((response) => {
      otp = response;
    })
  
    return otp;
}

export async function POST(request: NextRequest) {
    const _data: OtpType = await request.json();

    console.log("[API] OTP Creation", JSON.stringify(_data));
    
    const otp = await createOtp(_data);
  
    return new Response(JSON.stringify(otp), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
}