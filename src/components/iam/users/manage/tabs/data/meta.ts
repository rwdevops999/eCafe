import { MetaBase } from "@/data/meta";
import { FieldValues } from "react-hook-form";
import { z } from "zod";


export const FormSchema = z.object({
    name: z.string().min(1, "Name must contain at least 1 character").max(50, "Name can't contain more than 50 characters"),
    firstname: z.string().min(1, "Firstname must contain at least 1 character").max(50, "Firstname can't contain more than 50 characters"),
    email: z.string().regex(/^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i, "Email required or invalid"),
    // email: z.string(),
    password: z.string().min(8, "Password must contain at least 8 characters").max(12, "Password may not contain more than 12 characters"),
    code: z.string(),
    phone: z.string(),
    street: z.string().nullable(),
    number: z.string().nullable(),
    box: z.string().nullable(),
    city: z.string().nullable(),
    postalcode: z.string().nullable(),
    county: z.string().nullable(),
  });
export type FormSchemaType = z.infer<typeof FormSchema>;
  
export interface Meta<T extends FieldValues> extends MetaBase<T> {
    data: {
        country?: {
            id: number,
            dialCode: string,
            name: string
        }
    },
}
