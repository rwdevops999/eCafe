import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { Country } from "@/types/ecafe";
import { loadCountriesFromFile } from "@/lib/utils";
import { serviceMappings, ServiceMappingType } from "./setup/setup";
import { allItems, workingItems } from "@/data/constants";

const prisma = new PrismaClient()

const startupTableNames = ['Action', 'Country', 'Service'];
const tableNames = ['Address', 'Group','OTP', 'Policy', 'Role', 'ServiceStatement', 'StatementAction', 'Task', 'User'];
const permanentTables = ['History']
const relationTableNames = ['_GroupToPolicy', '_GroupToRole', '_GroupToUser', '_PolicyToRole','_PolicyToServiceStatement', '_PolicyToUser', '_RoleToUser'];

const flushStartup = async () => {
  for (const tableName of startupTableNames) await prisma.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);
}

const flushData = async () => {
  for (const tableName of tableNames) await prisma.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);
}

const flushRelations = async () => {
  for (const tableName of relationTableNames) await prisma.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);
}

const flushTable = async (tableName : string) => {
  await prisma.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);
}

export const flushAll = async (initStartup: boolean) => {
  if (initStartup) {
    flushStartup();
  }

  flushData();
  flushRelations();
}

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
      flushAll(true);
      provisionServices(serviceMappings);
    }

    if (table === workingItems) {
      flushAll(false);
    }

    if (table === 'country') {
      flushTable('Country');
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

export async function DELETE(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams
  const startup = urlParams.get('startup');

  let initStartup: boolean = false;

  if (startup) {
    initStartup = startup.toLowerCase() === 'true';
  } 

  await flushAll(initStartup);

  return new Response(JSON.stringify("flushed database"), {
    headers: { "content-type": "application/json" },
    status: 200,
 });
}
