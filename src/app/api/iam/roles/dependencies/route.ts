import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

const findRolesByIds = async (idValues: number[]) => {
  const roles = await prisma.role.findMany({
    where: {
      id: {
        in: idValues
      }
    },
    include: {
      policies: {
      include: {
        statements: {
          include: {
            actions: true
          }
        }
      }
      }
    }
  });

  return roles;
}

export async function GET(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams
  const _ids = urlParams.get('ids');

  if (_ids) {
    const ids: any[] = JSON.parse(_ids);
    const idValues: number[] = ids.map((id) => id.id); 
    const roles = await findRolesByIds(idValues);

    return Response.json(roles);
  }

  return Response.json([]);
}