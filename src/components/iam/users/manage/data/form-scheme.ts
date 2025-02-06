import { z } from "zod";

export const FormSchema = z.object({
    name: z.string().min(1).max(50),
    firstname: z.string().min(1).max(50),
    email: z.string().min(1).regex(/^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i),
    password: z.string().min(8).max(12),
    dialcode: z.string(),
    phone: z.string(),
    street: z.string(),
    number: z.string(),
    box: z.string(),
    city: z.string(),
    postalcode: z.string(),
    county: z.string(),
    country: z.string(),
  }).required({
    name: true,
    firstname: true,
    email: true,
    password: true,
  });

export type FormSchemaType = z.infer<typeof FormSchema>;
  
