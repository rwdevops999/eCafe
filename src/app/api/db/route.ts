import prisma from "@/lib/prisma";
import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { Country } from "@/types/ecafe";
import { loadCountriesFromFile } from "@/lib/utils";
import { serviceMappings, ServiceMappingType } from "./setup/setup";
import { allItems } from "@/data/constants";

const provisionServiceActions = (_service: ServiceMappingType) => {
  let actions: Prisma.ActionCreateInput[] = [];

  _service.actions!.map((_action) => {
    let action: Prisma.ActionCreateInput;
    action = {
      name: _action
    }

    actions.push(action);
  });

  return actions;
}

const provisionServices = (_services: ServiceMappingType[]) => {
  _services.map(async (_service) =>{
    let service: Prisma.ServiceCreateInput;

    let actions = provisionServiceActions(_service);

    service = {
      name: _service.service,
      actions: {
        create: actions
      }
    }

    await prisma.service.create({data: service});
  })
}

const clearServices = async () => {
  await prisma.service.deleteMany({});
}

const clearActions = async () => {
  await prisma.action.deleteMany({});
}

const clearPolicies = async () => {
  await prisma.policy.deleteMany({});
};

const clearStatements = async () => {
  await prisma.statementAction.deleteMany({});
  await prisma.serviceStatement.deleteMany({});
};

const clearCountryTable = async () => {
  await prisma.country.deleteMany({});
};

const clearDB = async() => {
    await clearPolicies();
    await clearStatements();
    await clearServices();
    await clearActions();
};

const provisionCountries = (filename: string) => {
  const countries: Country[] = loadCountriesFromFile(filename);

  countries.map(async (_country: Country) => {
    let country: Prisma.CountryCreateInput;
    country = {
      name: _country.name,
      dialCode: _country.dial_code,
      code: _country.code
    }

    await prisma.country.create({data: country});
  })
}

export async function POST(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const table = searchParams.get('table');  // passed as ...?service=Stock => service = "Stock"
  
    if (table === allItems) {
      await clearDB();
      provisionServices(serviceMappings);
    }

    if (table === 'country') {
      await clearCountryTable();
      provisionCountries('./public/country/country-codes.json');
    }

    return new Response(JSON.stringify("DB Initialised"), {
        headers: { "content-type": "application/json" },
        status: 200,
     });
}

const getAllCountries = async () => {
  const countries: any[] = await prisma.country.findMany({});

  return Response.json(countries.sort((a, b) => a.name.localeCompare(b.name)));
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const table = searchParams.get('table');  // passed as ...?service=Stock => service = "Stock"

    if (table && table !== allItems) {
      if (table === 'country') {
        return getAllCountries();
      }
    }
    
    return new Response("No Data", {
      headers: { "content-type": "application/json" },
      status: 204,
   });
}

const prisma = new PrismaClient()

const protectedTableNames = ['Action', 'Country', 'Service'];
const tableNames = ['Address', 'Group','OTP', 'Policy', 'Role', 'ServiceStatement', 'StatementAction', 'Task', 'User'];
const relationTableNames = ['_GroupToPolicy', '_GroupToRole', '_GroupToUser', '_PolicyToRole','_PolicyToServiceStatement', '_PolicyToUser', '_RoleToUser'];

export const flushAll = async () => {
  // for (const tableName of protectedTableNames) await prisma.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);
  for (const tableName of tableNames) await prisma.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);
  for (const tableName of relationTableNames) await prisma.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);
}

export async function DELETE(request: NextRequest) {
  await flushAll();

  return new Response(JSON.stringify("flushed database"), {
    headers: { "content-type": "application/json" },
    status: 200,
 });
}
