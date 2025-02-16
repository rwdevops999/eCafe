import prisma from "@/lib/prisma";
import { createEmptyApiReponse } from "@/lib/utils";
import { ApiResponseType } from "@/types/db";
import { RoleType } from "@/types/ecafe";
import { NextRequest } from "next/server";

const findAllRoles = async () => {
  const roles = await prisma.role.findMany(
    {
      include: {
       policies: {
        include: {
          statements: {
            include: {
              actions: true
            }
          }
        }
       },
       users: true,
       groups: true
      }
    });

  return roles;
}

export async function GET(request: NextRequest) {
    const roles: RoleType[] = await findAllRoles();

    let apiResponse: ApiResponseType = createEmptyApiReponse();

    apiResponse.info = "Payload: RoleType[]";
    apiResponse.payload = roles;

    return Response.json(apiResponse);
}

const createRole = async (data: RoleType) => {
  let role: any;

   await prisma.role.create({
    data: {
      name: data.name,
      description: data.description,
      managed: data.managed,
      policies: {
        connect: data.policies?.map(policy => {return {id: policy.id}})
      }
    }
  }).then((response) => {
    role = response;
  })

  return role;
}

export async function POST(req: NextRequest): Promise<Response> {
    const _data: RoleType = await req.json();

    let apiResponse: ApiResponseType = createEmptyApiReponse();

    const role: RoleType = await createRole(_data);

    apiResponse.status = 201;
    apiResponse.info = "Payload: RoleType";
    apiResponse.payload = role;

    return Response.json(apiResponse);
}

const deleteRoleById = async (roleId: number) => {
  let role: any;

  await prisma.role.delete(
    {
      where: {id: roleId}
    }
  ).then((response) => {
    role = response;
  });

  return role;
}

export async function DELETE(request: NextRequest): Promise<Response> {
  const urlParams = request.nextUrl.searchParams
  const roleId = urlParams.get('roleId');

  let apiResponse: ApiResponseType = createEmptyApiReponse();

  if  (roleId) {
    const role: RoleType = await deleteRoleById(parseInt(roleId));

    apiResponse.info = "Payload: RoleType";
    apiResponse.payload = role;
  
    return Response.json(apiResponse);
  }

  apiResponse.status = 400;
  apiResponse.info = "Not deleted: role id is not defined";

  return Response.json(apiResponse);
}
