import { z } from "zod"

const languageScheme = z.object({
    name: z.string(),
    code: z.string(),
    icon: z.string(),
});

const breadCrumbsScheme = z.object({
    name: z.string(),
    url: z.string().optional(),
});

const additionalScheme = z.object({
    managed: z.boolean().optional(),
    access: z.string().optional(),
    serviceId: z.number().optional(),
    serviceName: z.string().optional(),
});

export const dataScheme = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    children: z.array(z.any()).optional(),
    other: additionalScheme.optional()
});

export const taskDataScheme = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    type: z.string(),
    status: z.string(),
    children: z.array(z.any()).optional(),
});
