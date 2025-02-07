import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { all } from "@/data/constants";

const findAllPolicies = async () => {
  const policies = await prisma.policy.findMany(
    {
      include: {
        statements: {
          include: {
            actions: true
          }
        },
        roles: true,
      }});

  return policies;
}

const findPolicyById = async (_id: number) => {
  const policy = await prisma.policy.findFirst(
    {
      where: {
        id: _id
      },
      include: {
        statements: {
          include: {
            actions: true
          }
        },
      }});

  return [policy];
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const policyId = searchParams.get('policy');  // passed as ...?service=Stock => service = "Stock"

    if (policyId && policyId !== all) {
      const policy = await findPolicyById(parseInt(policyId));      
      return Response.json(policy);
    }
    
    const policies = await findAllPolicies();

    return Response.json(policies);
}

const mapStatements = (statements: NewStatementType[]|undefined) => {
  if (statements) {
    let result: any[] = statements.map(statement => {
      return {
        id: statement?.id,
        sid: statement?.sid,
        description: statement?.description,
        permission: statement?.permission,
        managed: statement?.managed,
        serviceId: statement?.serviceId
      };
    });

    return result;
  }

  return [];
}

const createPolicy = async (data: NewPolicyType) => {
  let policy: any;

   await prisma.policy.create({
    data: {
      name: data.name,
      description: data.description,
      managed: data.managed,
      statements: {
        // create: [{id: 1, sid: "", description: "", serviceId: 5}],
        connect: mapStatements(data.statements)
      }
    }
  }).then((response) => {
    policy = response;
  })

  return policy;
}

export async function POST(req: NextRequest) {
    const _data: NewPolicyType = await req.json();

    const policy = await createPolicy(_data);

    return new Response(JSON.stringify(policy), {
      headers: { "content-type": "application/json" },
      status: 201,
   });

}

const deletePolicy = async (policyId: number) => {
  let policy: any;

  await prisma.policy.delete(
    {
      where: {id: policyId}
    }
  ).then((response) => {
    policy = response;
  });

  return policy;
}

export async function DELETE(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams
  const policyId = urlParams.get('policyId');

  if  (policyId) {
    const policy = await deletePolicy(parseInt(policyId));

    return new Response(JSON.stringify(`deleted ${policy}`), {
      headers: { "content-type": "application/json" },
      status: 200,
   });
  }

  return new Response(JSON.stringify(`not deleted: policy id undefined`), {
      headers: { "content-type": "application/json" },
      status: 400,
   });
}
