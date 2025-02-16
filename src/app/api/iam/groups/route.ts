import prisma from "@/lib/prisma";
import { createApiResponse } from "@/lib/utils";
import { ExtendedGroupType, GroupType } from "@/types/ecafe";
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

  const createdGroup: GroupType = await prisma.group.create({data: group});

  return Response.json(createApiResponse(201, "Payload: GroupType", createdGroup));
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
    const groups: GroupType[] = await findAllGroups();

    // const _groups: ExtendedGroupType[] = groups.map((_group) => {
    //   let group: any = {
    //     id: _group.id,
    //     name: _group.name,
    //     description: _group.description,
    //     roles: {
    //       original: _group.roles,
    //     },
    //     policies: {
    //       original: _group.policies
    //     },
    //     users: {
    //       original: _group.users,
    //     }
    //   };

    //   return group;
    // });

    return Response.json(createApiResponse(200, "Payload: GroupType", groups));
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
    const group: GroupType = await deleteGroup(parseInt(groupId));

    return Response.json(createApiResponse(200, "Payload: GroupType", group));
  }

  return Response.json(createApiResponse(400, "Group not deleted because id is undefined"));
}

export async function PUT(req: NextRequest) {
  const data: ExtendedGroupType = await req.json();

  const  updatedGroup: GroupType = await prisma.group.update({
    where: {
      id: data.id
    },
    data: setGroupForUpdate(data) as any
  });

  return Response.json(createApiResponse(200, "Payload: GroupType", updatedGroup));
}