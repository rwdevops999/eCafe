import { z } from "zod";

export const FormSchema = z.object({
    name: z.string().min(1).max(50),
    description: z.string(),
  }).required({
    name: true,
  });

export type FormSchemaType = z.infer<typeof FormSchema>;
  
