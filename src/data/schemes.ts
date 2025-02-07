import { z } from "zod"

export const languageScheme = z.object({
    name: z.string(),
    code: z.string(),
    icon: z.string(),
});

export const breadCrumbsScheme = z.object({
    name: z.string(),
    url: z.string().optional(),
});

