import { z } from "zod"

const breadCrumbsScheme = z.object({
    name: z.string(),
    url: z.string().optional(),
});

export type BreadCrumbsType = z.infer<typeof breadCrumbsScheme>

