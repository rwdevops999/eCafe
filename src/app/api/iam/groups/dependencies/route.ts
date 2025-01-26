import prisma from "@/lib/prisma";
import { log } from "@/lib/utils";
import { NextRequest } from "next/server";

const findGroupsByIds = async (idValues: number[]) => {
  const groups = await prisma.group.findMany({
    where: {
      id: {
        in: idValues
      }
    },
    include: {
      roles: true,
      policies: true,
    }
  });

  return groups;
}

export async function GET(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams
  const _ids = urlParams.get('ids');

  if (_ids) {
    const ids: any[] = JSON.parse(_ids);
    const idValues: number[] = ids.map((id) => id.id); 
    const groups = await findGroupsByIds(idValues);

    return Response.json(groups);
  }

  return Response.json([]);
}
