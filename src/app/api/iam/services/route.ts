import { allItems } from "@/data/constants";
import prisma from "@/lib/prisma";
import { createApiResponse, createEmptyApiReponse, isNumber, js } from "@/lib/utils";
import { ServiceType } from "@/types/ecafe";
import { NextRequest } from "next/server";

const determineIncludes = (depth: number): any => {
    let includes = {};

    if (depth === 1) {
        includes = {
            actions: true
        }
    }

    return includes;
}

const findServiceByName = async (_service: string, depth: number) => {
    let includes = determineIncludes(depth);

    const service = await prisma.service.findFirst({
        where: { 
            name: _service 
        },
        include: includes
    });

    return service;
}

const findServiceById = async (_serviceId: number, depth: number) => {
    let includes = determineIncludes(depth);

    const service = await prisma.service.findFirst({
        where: { 
            id: _serviceId
        },
        include: includes
    });

    return service;
}

const findAllServices = async (depth: number) => {
    let includes = determineIncludes(depth);

    const services = await prisma.service.findMany({include: includes});

    return services;
}

/**
 * GET all services or a specific service with its actions
 * 
 * @param service (optional) the service where we want the details from
 * 
 * @returns the complete array of services (ServiceType[]) or the service itself (ServiceType)
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const paramService = searchParams.get('service');
    const paramDepth = searchParams.get('depth');

    const apiResponse = createEmptyApiReponse();

    let depth = -1;
    if (paramDepth) {
        depth = parseInt(paramDepth);
    }

    if (paramService) {
        if  (paramService !== allItems) {
            let service: ServiceType|null = null;

            if (isNumber(paramService)) {
                console.log("[API] SERVICE", "Load service by Id", parseInt(paramService));
                service = await findServiceById(parseInt(paramService), depth);

            } else {
                console.log("[API] SERVICE", "Load service", paramService);
                service = await findServiceByName(paramService, depth);
            }

            console.log("[API] SERVICE", "Loaded service", js(service));

            if (service) {
                console.log("[API] SERVICE", "SEND service To APP", js(service));
                apiResponse.info = "Payload: ServiceType";
                apiResponse.payload = service;

                return Response.json(apiResponse);
            }

            apiResponse.info = "Service not found";

            return Response.json(apiResponse);
        }
    }

    const services: ServiceType[] = await findAllServices(depth);
    apiResponse.info = "Payload: ServiceType[]";
    apiResponse.payload = services.sort((a, b) => a.name.localeCompare(b.name));

    return Response.json(apiResponse);
}
