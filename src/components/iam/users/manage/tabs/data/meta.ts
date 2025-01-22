import { countryScheme } from "@/data/iam-scheme";
import { Data } from "@/lib/mapping";
import { Row } from "@tanstack/react-table";
import { FieldErrors, UseFormGetValues, UseFormRegister } from "react-hook-form";
import { z } from "zod";

export const okButton = "ok";
export const updateButton = "update";
export const cancelButton = "cancel";
export const validateButton = "validate";
export const assignButton = "assign";

export type ButtonConfig = "ok" | "cancel" | "validate" | "update" | "assign";

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
  
export const issuer_roles = "Roles";
export const issuer_policies = "Policies";
export const issuer_groups = "Groups";
export const issuer_users = "Users";

export interface Meta {
    updateItems?: (type: string, itels: any[]) => void
    buttons?: ButtonConfig[]
    closeDialog?: () => void
    form?: {
        register: UseFormRegister<FormSchemaType>
        errors?: FieldErrors<FormSchemaType>,
        getValues?: UseFormGetValues<FormSchemaType>
    }
    userData?: {
        updateData: (data: any) => void
    }
    manageSubject?: (data: any) => void,
    items?: {
        issuer?: string
        title?: string
        columnname?: string
        data?: any[]
        setSelection?: (type: string, data: Data[]) => void
        validateItems?: () => boolean
        showPrimeTab?: () => void
    }
}

