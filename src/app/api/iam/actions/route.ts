import prisma from "@/lib/prisma";
import { createEmptyApiReponse } from "@/lib/utils";
import { ActionType } from "@/types/ecafe";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const paramServiceId = searchParams.get('serviceId');
    
    const apiResponse = createEmptyApiReponse();
    
    if (paramServiceId) {
        const _serviceId: number = parseInt(paramServiceId);

        console.log("[API] Load actions by ID = ", _serviceId);

        const actions: ActionType[] = await prisma.action.findMany({
            where: {
                serviceId: _serviceId
            }
        });

        apiResponse.info = "Payload: ActionType[]";
        apiResponse.payload = actions;
    
        return Response.json(apiResponse);
    }

    const actions: ActionType[] = await prisma.action.findMany();
    apiResponse.info = "Payload: ActionType[]";
    apiResponse.payload = actions;

    return Response.json(apiResponse);
}
