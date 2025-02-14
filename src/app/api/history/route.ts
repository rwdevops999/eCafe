import prisma from "@/lib/prisma";
import { createApiReponse } from "@/lib/utils";
import { HistoryType } from "@/types/ecafe";
import { NextRequest } from "next/server";
import { title } from "process";

const createHistory = async (data: HistoryType) => {
    let history: any;
  
    await prisma.history.create({
      data: {
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

    const history = await createHistory(_data);

    return Response.json(createApiReponse(200, history));
}

export async function GET(request: NextRequest) {
    const history = await prisma.history.findMany();

    return Response.json(createApiReponse(200, history.sort((a, b) => a.createDate!.getTime() - b.createDate!.getTime())));
}
