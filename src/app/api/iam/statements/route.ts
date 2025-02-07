import { all } from "@/data/constants";
import { ServiceStatementType } from "@/data/iam-scheme";
import prisma from "@/lib/prisma";
import { log } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

const findAllStatementsOfService = async (_serviceId: number) => {
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

const findSidOfService = async (_serviceId: number, _sid: string) => {
  const statements = await prisma.serviceStatement.findMany(
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
    const serviceId = searchParams.get('serviceId');  // passed as ...?service=Stock => service = "Stock"
    const sid = searchParams.get('sid');  // passed as ...?service=Stock => service = "Stock"

    if  (serviceId && parseInt(serviceId) !== 0) {
      if (sid === all) {
      const statements = await findAllStatementsOfService(parseInt(serviceId));

      return Response.json(statements);
      } else if (sid) {
        const statements = await findSidOfService(parseInt(serviceId), sid);
        return Response.json(statements);
      }
    }

    const statements = await findAllStatements();

    return Response.json(statements);
  }

const provisionStatementActions = (statement: NewStatementType): Prisma.StatementActionCreateWithoutStatementInput[] => {
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

export async function POST(req: NextRequest) {
    const data: NewStatementType = await req.json();

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

    const created = await prisma.serviceStatement.create({data: statement});

    return new Response(JSON.stringify(created), {
        headers: { "content-type": "application/json" },
        status: 201,
     });
}

export async function DELETE(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams
  const statementId = urlParams.get('statementId');

  if  (statementId) {
    const data = await prisma.serviceStatement.delete(
      {
        where: {id: parseInt(statementId)}
      }
    );

    return new Response(JSON.stringify(`deleted ${data}`), {
      headers: { "content-type": "application/json" },
      status: 200,
   });
  }

    return new Response(JSON.stringify(`not deleted: statement id undefined`), {
      headers: { "content-type": "application/json" },
      status: 400,
   });
}
