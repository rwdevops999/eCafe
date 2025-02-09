import { z } from "zod";

export const FormSchema = z.object({
  password: z.string().min(8).max(12),
}).required({
  password: true,
});

export type FormSchemaType = z.infer<typeof FormSchema>;
  
