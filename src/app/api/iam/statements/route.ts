import { allItems } from "@/data/constants";
import prisma from "@/lib/prisma";
import { createApiResponse, createEmptyApiReponse, js } from "@/lib/utils";
import { ApiResponseType } from "@/types/db";
import { StatementType } from "@/types/ecafe";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { disconnect } from "process";

const findAllStatementsByServiceId = async (_serviceId: number) => {
  const statements = await prisma.serviceStatement.findMany(
    {
      where: { serviceId: _serviceId },
      include: {
        actions: true,
        policies: true,   
      }
    },
  );

  return statements;
}

const findStatementByServiceIdAndSidName = async (_serviceId: number, _sid: string) => {
  const statements = await prisma.serviceStatement.findFirst(
    {
      where: { 
        serviceId: _serviceId,
        sid: _sid
       },
      include: {
        actions: true,
        policies: true,   
      }
    },
  );

  return statements;
}

const findAllStatements = async () => {
  const statements = await prisma.serviceStatement.findMany(
    {
      include: {
        actions: true,
        policies: true,   
      }
    }
  );

  return statements;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const _serviceId = searchParams.get('serviceId');  // passed as ...?service=Stock => service = "Stock"

    let apiResponse: ApiResponseType = createEmptyApiReponse();

    if (_serviceId) {
      const statements: StatementType[] = await prisma.serviceStatement.findMany({
        where: {
          serviceId: parseInt(_serviceId!)
        },
        include: {
          actions: true
        }
      });

      apiResponse.info = "Payload: StatementType[]";
      apiResponse.payload = statements;

      return Response.json(apiResponse);
    }
    
    const statements: StatementType[] = await prisma.serviceStatement.findMany({
      include: {
        actions: true,
        service: true,
      }
    });

    apiResponse.info = "Payload: StatementType[]";
    apiResponse.payload = statements;

    return Response.json(apiResponse);
}

const provisionStatementActions = (statement: StatementType): Prisma.StatementActionCreateWithoutStatementInput[] => {
  let actions: Prisma.StatementActionCreateWithoutStatementInput[] = [];

  statement.actions?.map(async (action) => {

    let _action: Prisma.StatementActionCreateWithoutStatementInput = {
      name: action.name,
      actionId: action.id,
    }

    actions.push(_action);
  });

  return actions;
}

const provisionStatementActionsForUpdate = (statement: StatementType): Prisma.StatementActionCreateOrConnectWithoutStatementInput[] => {
  let actions: Prisma.StatementActionCreateOrConnectWithoutStatementInput[] = [];

  // statement.actions?.map(async (action) => {
  //   let _action: Prisma.StatementActionWhereUniqueInput = {
  //     id: action.id
  //   }

  //   actions.push(_action);
  // });

  return actions;
}

export async function POST(req: NextRequest) {
    const data: StatementType = await req.json();

    console.log("[API]", "CREATE DATA", js(data));

    let statement: Prisma.ServiceStatementCreateInput;

    let actions:Prisma.StatementActionCreateWithoutStatementInput[] = provisionStatementActions(data);

    statement = {
      sid: data.sid,
      description: data.description,
      permission: data.permission,
      managed: data.managed,
      service: {
        connect: {
            id: data.serviceId
        }
      },
      actions: {
        create: actions
      }
    }


    console.log("[API]", "CREATE STMT", js(statement));

    let apiResponse: ApiResponseType = createEmptyApiReponse();

    const created: StatementType = await prisma.serviceStatement.create({data: statement});

    apiResponse.status = 201;
    apiResponse.info = "PAYLOAD: ";
    apiResponse.payload = created;
   
    console.log("CREATE API", js(apiResponse));

    return Response.json(apiResponse);
}

export async function DELETE(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams
  const statementId = urlParams.get('statementId');

  let apiResponse: ApiResponseType = createEmptyApiReponse();

  if  (statementId) {
    const statement: StatementType = await prisma.serviceStatement.delete(
      {
        where: {id: parseInt(statementId)}
      }
    );

    apiResponse.info = "Payload: StatementType";
    apiResponse.payload = statement;

    return Response.json(apiResponse);
  }

  apiResponse.status = 400;
  apiResponse.info = "Not deleted because id is not defined";
  
  return Response.json(apiResponse);
}

export async function PUT(req: NextRequest) {
  const data: StatementType = await req.json();

  console.log("[API]", "UPDATE DATA", js(data));

  let statement: any;

  // HARDCODE
  statement = {
    sid:"TEstXXX",
    description:"test",
    managed:true,
    permission:"Deny",
    updateDate:"2025-02-20T15:11:15.650Z",
    actions: {
      disconnect: [{id: 40}]
    }
  }
 
  // let actions:Prisma.StatementActionUpdateManyWithoutStatementNestedInput[] = provisionStatementActions(data);

  // statement = {
  //   sid: data.sid,
  //   description: data.description,
  //   managed: data.managed,
  //   permission: data.permission,
  //   updateDate: data.updateDate,
  //   actions: {
  //     connectOrCreate: provisionStatementActionsForUpdate(data)
  //   }
  // }

  console.log("[API]", "UPDATE STMT", js(statement));

  let apiResponse: ApiResponseType = createEmptyApiReponse();

  const created: StatementType = await prisma.serviceStatement.update({
    where: {
      id: data.id
    },
    data: statement
  });

  apiResponse.status = 201;
  apiResponse.info = "PAYLOAD: ";
  apiResponse.payload = created;
 
  console.log("CREATE API", js(apiResponse));

  return Response.json(apiResponse);
}

