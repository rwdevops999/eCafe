import { GroupType } from "@/data/iam-scheme";
import prisma from "@/lib/prisma";
import { log } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const data: GroupType = await req.json();

  log(true, "API", "POST", data, true);
    
  const group: Prisma.GroupCreateInput = {
    name: data.name,
    description: data.description,
  }

  const createdGroup = await prisma.group.create({data: group});

  return new Response(JSON.stringify(createdGroup), {
      headers: { "content-type": "application/json" },
      status: 201,
  });
}


