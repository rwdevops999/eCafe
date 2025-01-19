import { NextApiRequest, NextApiResponse } from "next";

/**
 * GET all services or a specific service with its actions
 * 
 * @param service (optional) the service where we want the details from
 * 
 * @returns the complete array of services (ServiceType[]) or the service itself (ServiceType)
 */
export async function GET(req: NextApiRequest, resp: NextApiResponse) {
}
