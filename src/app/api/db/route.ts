import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { serviceMappings, ServiceMappingType } from "./data/setup";
import { log } from "@/lib/utils";
import { all } from "@/data/constants";
import { Country, loadCountries } from "@/lib/country";

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
      // createDate: new Date(),
      // updateDate: new Date(),
      actions: {
        create: actions
      }
    }

    await prisma.service.create({data: service});
  })
}

const clearServices = async () => {
  log(true, "INITDB", "clear Services");
  await prisma.service.deleteMany({});
}

const clearActions = async () => {
  log(true, "INITDB", "clear Actions");
  await prisma.action.deleteMany({});
}

const clearPolicies = async () => {
  log(true, "INITDB", "clear Policies");
  await prisma.policy.deleteMany({});
};

const clearStatements = async () => {
  log(true, "INITDB", "clear Statements");
  await prisma.statementAction.deleteMany({});
  await prisma.serviceStatement.deleteMany({});
};

const clearCountryTable = async () => {
  log(true, "INITDB", "clear Countries");
  await prisma.country.deleteMany({});
};

const clearDB = async() => {
    await clearPolicies();
    await clearStatements();
    await clearServices();
    await clearActions();
};

const provisionCountries = (filename: string) => {
  const countries: Country[] = loadCountries(filename);

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
  
    if (table === all) {
      await clearDB();
      provisionServices(serviceMappings);
    }

    if (table === 'country') {
      log(true, "INIT DB", "Setup countries");
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

    return Response.json(countries);
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const table = searchParams.get('table');  // passed as ...?service=Stock => service = "Stock"

    if (table && table !== all) {
      if (table === 'country') {
        return getAllCountries();
      }
    }
    
    return new Response("No Data", {
      headers: { "content-type": "application/json" },
      status: 204,
   });
}

