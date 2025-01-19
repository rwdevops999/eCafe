import { z } from "zod"

const languageScheme = z.object({
    name: z.string(),
    code: z.string(),
    icon: z.string(),
});

export type LanguageType = z.infer<typeof languageScheme>
