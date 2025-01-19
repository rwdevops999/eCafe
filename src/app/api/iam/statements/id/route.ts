import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

/**
 * GET all services or a specific service with its actions
 * 
 * @param service (optional) the service where we want the details from
 * 
 * @returns the complete array of services (ServiceType[]) or the service itself (ServiceType)
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const paramService = searchParams.get('id');

    let _id: number = -1;

    if  (paramService) {
        _id = parseInt(paramService);
    }

    const statement = await prisma.serviceStatement.findFirst({
        where: {
            id: _id
    }});

    return Response.json(statement);
}
