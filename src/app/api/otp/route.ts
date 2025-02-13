import prisma from "@/lib/prisma";
import { createApiReponse } from "@/lib/utils";
import { EmailType, OtpType } from "@/types/ecafe";
import { NextRequest } from "next/server";

const createOtp = async (data: OtpType) => {
    let otp: any;
  
     await prisma.oTP.create({
      data: {
        OTP: data.OTP,
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

const findOtpById = async (_id: number) => {
  const otp = await prisma.oTP.findFirst({
      where: { 
        id: _id
      },
  });

  return otp;
}


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const otpId = searchParams.get('otpId');

  if (otpId) {
    const otp = await findOtpById(parseInt(otpId));

    if (otp) {
      return Response.json(createApiReponse(200, otp));
    }
  }

  return new Response(JSON.stringify(createApiReponse(404, "otp not found")), {
    headers: { "content-type": "application/json" },
 });
}

export async function PUT(req: NextRequest) {
  const data: OtpType = await req.json();

  const  updatedOtp = await prisma.oTP.update({
    where: {
      id: data.id
    },
    data: {
      attemps: data.attemps,
      used: data.used
    }
  });

  return Response.json(createApiReponse(200, updatedOtp));
}

export async function DELETE(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams
  const otpId = urlParams.get('otpId');

  if (otpId) {
    const otp = await prisma.oTP.delete({
      where: {
        id: parseInt(otpId)
      }
    });

    return Response.json(createApiReponse(410, otp));
  }

  const _email = urlParams.get('email');
  let _expdate = urlParams.get('expdate');
  console.log("[API] PARAM(expdate)", _expdate);

  if (_email && _expdate) {
    _expdate = _expdate.replace('T', ' ').slice(0,_expdate.length - 1);
    console.log("[API] DELETING OTPs by email and expiration date", _email, _expdate);

    const date: Date = new Date(_expdate);

    const otps = await prisma.oTP.deleteMany({
      where: {
        AND: {
          email: {
            equals: _email
          },
          createDate: {
            lte: date
          }
        }
      }
    })

    return Response.json(createApiReponse(410, otps));
  }

  return Response.json(createApiReponse(400, "Invalid Parameters"));
}
