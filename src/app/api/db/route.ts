import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { Country, CountryType } from "@/types/ecafe";
import { createApiResponse, createEmptyApiReponse, js, loadCountriesFromFile } from "@/lib/utils";
import { serviceMappings, ServiceMappingType } from "./setup/setup";
import { allItems, workingItems } from "@/data/constants";
import { ApiResponseType } from "@/types/db";

const prisma = new PrismaClient()

const startupTableNames = ['Action', 'Country', 'Service'];
const tableNames = ['Address', 'Group','OTP', 'Policy', 'Role', 'ServiceStatement', 'StatementAction', 'Task', 'User'];
const permanentTables = ['History']
const relationTableNames = ['_GroupToPolicy', '_GroupToRole', '_GroupToUser', '_PolicyToRole','_PolicyToServiceStatement', '_PolicyToUser', '_RoleToUser'];

const flushStartup = async () => {
  for (const tableName of startupTableNames) {
    await prisma.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);
  }
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
    await flushStartup();
  }

  await flushData();
  await flushRelations();
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

const provisionCountries = async (filename: string) => {
  const countries: Country[] = loadCountriesFromFile(filename);

  const dbCountries: CountryType[] = countries.map((_country: Country) => {
    let country: CountryType;
    country = {
      id: undefined,
      name: _country.name,
      dialCode: _country.dial_code,
      code: _country.code
    }

    return country;
  })

  await prisma.country.createMany({data: dbCountries});
}

export async function POST(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const table = searchParams.get('table');  // passed as ...?service=Stock => service = "Stock"

    let apiResponse: ApiResponseType = createEmptyApiReponse();

    if (table === 'Services') {
      await flushStartup();
      provisionServices(serviceMappings);
      const includeCountries = searchParams.get('countries');  // passed as ...?service=Stock => service = "Stock"
      if (includeCountries?.toLowerCase() === 'true') {
        await provisionCountries('./public/country/country-codes.json');
      }

      apiResponse.info = "flushed startup tables and provisioned services. No payload";
    }

    if (table === 'History') {

      flushTable('History');

      apiResponse.info = "flushed startup tables and provisioned services. No payload";
    }

    if (table === allItems) {
      await flushAll(true);
      // provisionServices(serviceMappings);
      apiResponse.info = "flushed all tables and provisioned services. No payload";
    }

    if (table === workingItems) {
      flushAll(false);
      apiResponse.info = "flushed all working tables (like User, Role, ...). No payload";
    }

    if (table === 'country') {
      flushTable('Country');
      provisionCountries('./public/country/country-codes.json');
      apiResponse.info = "flushed COUNTRY table and provisioned it. No payload";
    }

    return Response.json(apiResponse);
}

const getAllCountries = async () => {
  const countries: any[] = await prisma.country.findMany({});

  return Response.json(countries.sort((a, b) => a.name.localeCompare(b.name)));
}

export async function GET(request: NextRequest): Promise<Response> {
    const searchParams = request.nextUrl.searchParams
    const table = searchParams.get('table');  // passed as ...?service=Stock => service = "Stock"

    let apiResponse: ApiResponseType = createEmptyApiReponse();

    if (table && table === 'country') {
      const countries: CountryType[] = await prisma.country.findMany();

      apiResponse.info = "Payload: CountryType[]";
      apiResponse.payload = countries;

      return Response.json(apiResponse);
    }

    return Response.json(createApiResponse(204, "NoData", undefined));
}

export async function DELETE(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams
  const startup = urlParams.get('startup');

  let apiResponse: ApiResponseType = createEmptyApiReponse();

  let initStartup: boolean = false;

  if (startup) {
    initStartup = startup.toLowerCase() === 'true';
  } 

  await flushAll(initStartup);
  apiResponse.info = `Deleted all tables. Startup data included = ${initStartup}`;

  return Response.json(apiResponse);
}
