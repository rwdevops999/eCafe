import prisma from "@/lib/prisma";
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
    const searchParams = request.nextUrl.searchParams

    const roles = await findAllRoles();

    return Response.json(roles);
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

export async function POST(req: NextRequest) {
    const _data: RoleType = await req.json();

    const role = await createRole(_data);

    return new Response(JSON.stringify(role), {
      headers: { "content-type": "application/json" },
      status: 201,
   });
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

export async function DELETE(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams
  const roleId = urlParams.get('roleId');

  if  (roleId) {
    const role = await deleteRoleById(parseInt(roleId));

    return new Response(JSON.stringify(`deleted ${role}`), {
      headers: { "content-type": "application/json" },
      status: 200,
   });
  }

  return new Response(JSON.stringify(`not deleted: policy id undefined`), {
      headers: { "content-type": "application/json" },
      status: 400,
   });
}
