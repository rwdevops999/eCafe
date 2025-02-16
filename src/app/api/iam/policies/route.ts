import { allItems } from "@/data/constants";
import prisma from "@/lib/prisma";
import { createEmptyApiReponse } from "@/lib/utils";
import { ApiResponseType } from "@/types/db";
import { PolicyType, StatementType } from "@/types/ecafe";
import { NextRequest } from "next/server";

const findAllPolicies = async (): => {
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

const findPolicyByName = async (_name: string) => {
  const policy = await prisma.policy.findFirst(
    {
      where: {
        name: _name
      },
      include: {
        statements: {
          include: {
            actions: true
          }
        },
      }});

  return policy;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const policyName = searchParams.get('policy');  // passed as ...?service=Stock => service = "Stock"

    let apiResponse: ApiResponseType = createEmptyApiReponse();

    if (policyName && policyName !== allItems) {
      const policy = await findPolicyByName(policyName);

      apiResponse.info = "Payload: PolicyType";
      apiResponse.payload = policy;
  
      return Response.json(apiResponse);
    }
    
    const policies: PolicyType[] = await findAllPolicies();
    apiResponse.info = "Payload: PolicyType[]";
    apiResponse.payload = policies;

    return Response.json(apiResponse);
}

const createPolicy = async (data: PolicyType): Promise<PolicyType> => {
  let policy: any;

   await prisma.policy.create({
    data: {
      name: data.name,
      description: data.description,
      managed: data.managed,
      statements: {
        connect: data.statements?.map(statement => {return {id: statement.id}})
      }
    }
  }).then((response) => {
    policy = response;
  })

  return policy;
}

export async function POST(req: NextRequest) {
    const _data: PolicyType = await req.json();

    let apiResponse: ApiResponseType = createEmptyApiReponse();

    const policy: PolicyType = await createPolicy(_data);

    apiResponse.info = "Payload: PolicyType"
    apiResponse.payload = policy;
    apiResponse.status = 201;

    return Response.json(apiResponse);
}

const deletePolicyById = async (policyId: number): Promise<PolicyType> => {
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

  let apiResponse: ApiResponseType = createEmptyApiReponse();

  if  (policyId) {
    const policy: PolicyType = await deletePolicyById(parseInt(policyId));

    apiResponse.info = "Payload: PolicyType";
    apiResponse.payload = policy;

    return Response.json(apiResponse);
  }

  apiResponse.status = 400;

  return Response.json(apiResponse);
}
