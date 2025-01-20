import { GroupType } from "@/data/iam-scheme";
import prisma from "@/lib/prisma";
import { log } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const groups = await prisma.group.findMany({});

  const _groups: GroupType[] = groups.map((_group) => {
    let group: GroupType = {
      id: _group.id,
      name: _group.name,
      description: _group.description,
    };

    return group;
  });

  return Response.json(_groups);
}

const deleteGroup = async (groupId: number) => {
  let group: any;
  
  await prisma.group.delete(
    {
      where: {id: groupId},
    }
  ).then((response) => {
    group = response;
  });
  
  return group;
}
  

export async function DELETE(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams
  const groupId = urlParams.get('groupId');
  
    if  (groupId) {
      const group = await deleteGroup(parseInt(groupId));
  
      return new Response(JSON.stringify(`deleted ${group}`), {
        headers: { "content-type": "application/json" },
        status: 200,
     });
    }
  
  return new Response(JSON.stringify(`not deleted: group id undefined`), {
    headers: { "content-type": "application/json" },
    status: 400,
  });
}
  
export async function PUT(req: NextRequest) {
  const data: GroupType = await req.json();

  const  updatedGroup = await prisma.group.update({
    where: {
      id: data.id
    },
    data: {
      id: data.id,
      name: data.name,
      description: data.description,
    }
  });

  return NextResponse.json(updatedGroup);
}