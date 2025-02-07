import prisma from "@/lib/prisma";
import { ExtendedGroupType } from "@/types/ecafe";
import { NextRequest, NextResponse } from "next/server";

const  setGroupForCreate = (data: ExtendedGroupType) => {
  return ({
    name: data.name,
    description: data.description,
    roles: {
      // disconnect: data.roles.removed,
      connect: data.roles?.selected
    },
    policies: {
      // disconnect: data.policies.removed,
      connect: data.policies?.selected
    },
    users: {
      // disconnect: data.policies.removed,
      connect: data.users?.selected
    }
  });
}

const  setGroupForUpdate = (data: ExtendedGroupType) => {
  return ({
    id: data.id,
    name: data.name,
    description: data.description,
    roles: {
      disconnect: data.roles?.removed,
      connect: data.roles?.selected
    },
    policies: {
      disconnect: data.policies?.removed,
      connect: data.policies?.selected
    },
    users: {
      disconnect: data.users?.removed,
      connect: data.users?.selected
    }
  });
}

export async function POST(req: NextRequest) {
  const data: ExtendedGroupType = await req.json();

  const group: any = setGroupForCreate(data);

  const createdGroup = await prisma.group.create({data: group});

  return new Response(JSON.stringify(createdGroup), {
      headers: { "content-type": "application/json" },
      status: 201,
   });
}

const findAllGroups = async () => {
  const groups = await prisma.group.findMany(
    {
      include: {
        roles: true,
        policies: true,
        users: true
      }
    }
  );

  return groups;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams

    const groups = await findAllGroups();

    const _groups: ExtendedGroupType[] = groups.map((_group) => {
      let group: any = {
        id: _group.id,
        name: _group.name,
        description: _group.description,
        roles: {
          original: _group.roles,
        },
        policies: {
          original: _group.policies
        },
        users: {
          original: _group.users,
        }
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

  return new Response(JSON.stringify(`not deleted: policy id undefined`), {
      headers: { "content-type": "application/json" },
      status: 400,
   });
}

export async function PUT(req: NextRequest) {
  const data: ExtendedGroupType = await req.json();

  const  updatedGroup = await prisma.group.update({
    where: {
      id: data.id
    },
    data: setGroupForUpdate(data) as any
  });

  return NextResponse.json(updatedGroup);
}