import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

const findPoliciesByIds = async (idValues: number[]) => {
  const policies = await prisma.policy.findMany({
    where: {
      id: {
        in: idValues
      }
    },
    include: {
      statements: {
        include: {
          actions: true
        }
      }
    }
  });

  return policies;
}

export async function GET(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams
  const _ids = urlParams.get('ids');

  if (_ids) {
    const ids: any[] = JSON.parse(_ids);
    const idValues: number[] = ids.map((id) => id.id); 
    const policies = await findPoliciesByIds(idValues);

    return Response.json(policies);
  }

  return Response.json([]);
}