import { languages } from "@/data/constants";
import { createEmptyApiReponse } from "@/lib/utils";
import { ApiResponseType } from "@/types/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
    let apiResponse: ApiResponseType = createEmptyApiReponse();

    apiResponse.info = "Payload: LanguageType[]";
    apiResponse.payload = languages;

    return Response.json(apiResponse);
}

