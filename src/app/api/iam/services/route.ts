import { allItems } from "@/data/constants";
import prisma from "@/lib/prisma";
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

const findServiceFromServiceName = async (_service: string, depth: number) => {
    let includes = determineIncludes(depth);

    const service = await prisma.service.findMany({
        where: { 
            name: _service 
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
    
    let depth = -1;
    if (paramDepth) {
        depth = parseInt(paramDepth);
    }

    if (paramService) {
        if  (paramService !== allItems) {
            const service = await findServiceFromServiceName(paramService, depth);
            if (service) {
                return Response.json(service);
            }

            return Response.json([]);
        }
    }

    const services = await findAllServices(depth);

    return Response.json(services.sort((a, b) => a.name.localeCompare(b.name)));
}
