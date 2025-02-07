import { languages } from "@/data/constants";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return Response.json(languages);
}

