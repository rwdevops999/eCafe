import prisma from "@/lib/prisma";
import { createApiResponse } from "@/lib/utils";
import { EmailType, OtpType } from "@/types/ecafe";
import { NextRequest } from "next/server";

const createOtp = async (data: OtpType) => {
    let otp: any;
  
     await prisma.oTP.create({
      data: {
        OTP: data.OTP,
        email: data.email,
        attemps: data.attemps,
        userId: data.userId,
      }
    }).then((response) => {
      otp = response;
    })
  
    return otp;
}

export async function POST(request: NextRequest) {
    const _data: OtpType = await request.json();

    const otp: OtpType = await createOtp(_data);

    return Response.json(createApiResponse(201, "Payload: OtpType", otp));
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
    const otp: OtpType | null = await findOtpById(parseInt(otpId));

    if (otp) {
      return Response.json(createApiResponse(200, "Payload: OtpType", otp));
    }
  }

  return new Response(JSON.stringify(createApiResponse(404, "otp not found")), {
    headers: { "content-type": "application/json" },
 });
}

export async function PUT(req: NextRequest) {
  const data: OtpType = await req.json();

  const  updatedOtp: OtpType = await prisma.oTP.update({
    where: {
      id: data.id
    },
    data: {
      attemps: data.attemps,
      used: data.used
    }
  });

  return Response.json(createApiResponse(200, "Payload: OtpType", updatedOtp));
}

export async function DELETE(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams
  const otpId = urlParams.get('otpId');

  if (otpId) {
    const otp: OtpType = await prisma.oTP.delete({
      where: {
        id: parseInt(otpId)
      }
    });

    return Response.json(createApiResponse(410, "Payload: OtpType", otp));
  }

  const _email = urlParams.get('email');
 
  if (_email) {

    const otps = await prisma.oTP.deleteMany({
      where: {
        AND: {
          email: {
            equals: _email
          },
          createDate: {
            lt: new Date(Date.now() - 30 * 60 * 1000)
          }
        }
      }
    })

    return Response.json(createApiResponse(410, "Payload: {count: number)", otps));
  }

  return Response.json(createApiResponse(400, "Invalid Parameters"));
}
