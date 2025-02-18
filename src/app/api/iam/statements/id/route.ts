import prisma from "@/lib/prisma";
import { createEmptyApiReponse } from "@/lib/utils";
import { ApiResponseType } from "@/types/db";
import { StatementType } from "@/types/ecafe";
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

    console.log("[API] load statement by id", paramService);

    let _id: number = -1;

    let apiResponse: ApiResponseType = createEmptyApiReponse();

    if  (paramService) {
        _id = parseInt(paramService);
    }

    if (_id > 0) {
        const statement: StatementType|null = await prisma.serviceStatement.findFirst({
            where: {
                id: _id
            },
            include: {
                service: true
            }
        });

        if (statement) {
            apiResponse.info = "Payload: StatementType";
            apiResponse.payload = statement;

            return Response.json(apiResponse);
        }


    } else {
        const statements: StatementType[] = await prisma.serviceStatement.findMany({
            include: {
                service: true
            }
        });

        if (statements.length > 0) {
            apiResponse.info = "Payload: StatementType[]";
            apiResponse.payload = statements;

            return Response.json(apiResponse);
        }
    }

    apiResponse.info = "Statement not found";
    apiResponse.status = 404;

    return Response.json(apiResponse);
}
