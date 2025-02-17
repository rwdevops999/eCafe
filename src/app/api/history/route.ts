import prisma from "@/lib/prisma";
import { createApiResponse } from "@/lib/utils";
import { HistoryType } from "@/types/ecafe";
import { NextRequest } from "next/server";
import { title } from "process";

const createHistory = async (data: HistoryType) => {
    let history: any;
  
    await prisma.history.create({
      data: {
        type: data.type,
        title: data.title,
        description: data.description,
        originator: data.originator,
      }
    }).then((response) => {
      history = response;
    })
  
    return history;
}

export async function POST(request: NextRequest) {
    const _data: HistoryType = await request.json();

    const history: HistoryType = await createHistory(_data);

    return Response.json(createApiResponse(200, "Payload: HistoryType", history));
}

export async function GET(request: NextRequest) {
    const history: HistoryType[] = await prisma.history.findMany();

    return Response.json(createApiResponse(200, "Payload: HistoryType[]", history.sort((a, b) => b.createDate!.getTime() - a.createDate!.getTime())));
}
