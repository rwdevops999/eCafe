import { z } from "zod";

export const FormSchema = z.object({
  email: z.string().min(1).regex(/^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i),
}).required({
  email: true,
});

export type FormSchemaType = z.infer<typeof FormSchema>;
  
