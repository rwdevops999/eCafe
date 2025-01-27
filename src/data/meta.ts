import { Data } from "@/lib/mapping";
import { FieldErrors, FieldValues, UseFormGetValues, UseFormRegister, UseFormReset } from "react-hook-form";

export const createButton = "create";
export const updateButton = "update";
export const cancelButton = "cancel";
export const validateButton = "validate";

export type ButtonConfig = "create" | "cancel" | "validate" | "update";

export const issuer_roles = "Roles";
export const issuer_policies = "Policies";
export const issuer_groups = "Groups";
export const issuer_users = "Users";

export type MetaBase<T extends FieldValues> = {
    sender: string
    subject: any
    buttons?: ButtonConfig[]
    control?:{
        closeDialog?: () => void
        handleSubject?: (data: any) => void
    },
    form?: {
        submitForm?: () => void,
        register?: UseFormRegister<T>,
        errors?: FieldErrors<T>,
        getValues?: UseFormGetValues<T>,
        reset?: UseFormReset<T>
    },
    items?: {
        issuer?: string,
        title?: string,
        columnname?: string,
        data?: Data[],

        setSelection?: (type: string, data: Data[]) => void,
        getSelection?: (type:string) => Data[],
        validateItems?: () => boolean
    },
}

// export interface MetaBase<T extends FieldValues> {
//     sender: string
//     subject?: any
//     buttons?: ButtonConfig[]
//     control?:{
//         closeDialog?: () => void
//         handleSubject?: (data: any) => void,
//     },
//     form?: {
//         submitForm?: () => void
//         register?: UseFormRegister<T>,
//         errors?: FieldErrors<T>,
//         getValues?: UseFormGetValues<T>
//         reset?: UseFormReset<T>
//     },
//     items?: {
//         issuer?: string
//         title?: string
//         columnname?: string
//         data?: Data[]

//         setSelection?: (type: string, data: Data[]) => void
//         getSelection?: (type:string) => Data[]
//         validateItems?: () => boolean
//     },
//     data?: undefined
// }
