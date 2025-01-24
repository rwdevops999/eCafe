import { z } from "zod";

export const FormSchema = z.object({
    name: z.string().min(1, "Name must contain at least 1 character").max(50, "Name can't contain more than 50 characters"),
    description: z.string().nullable(),
  });
export type FormSchemaType = z.infer<typeof FormSchema>;
