import { z } from "zod";

const idDataScheme = z.object({
    id: z.number().optional(),
});

const countryDataScheme = idDataScheme;
export type CountryDataType = z.infer<typeof countryDataScheme>

const detailDataScheme = z.object({
    name: z.string(),
    firstname: z.string(),
    phone: z.string().optional(),
    phonecode: z.string().optional(),
});
export type DetailDataType = z.infer<typeof detailDataScheme>

const addressDataScheme= z.object({
    street: z.string(),
    number: z.string(),
    box: z.string(),
    city: z.string(),
    postalcode: z.string(),
    countryData: countryDataScheme,
    county: z.string(),
});
export type AddressDataType = z.infer<typeof addressDataScheme>

const logonDataScheme = z.object({
    email: z.string(),
    password: z.string()
});
export type LogonDataType = z.infer<typeof logonDataScheme>

const userDataScheme = z.object({
    detailsData: detailDataScheme,
    addressData: addressDataScheme,
    logonData: logonDataScheme,
});
export type UserDataType = z.infer<typeof userDataScheme>

const roleDataScheme = z.array(idDataScheme);
export type RoleDataType = z.infer<typeof roleDataScheme>

const policyDataScheme = z.array(idDataScheme);
export type PolicyDataType = z.infer<typeof policyDataScheme>

const groupDataScheme = z.array(idDataScheme);
export type GroupDataType = z.infer<typeof groupDataScheme>

const dialogDataScheme = z.object({
    userData: userDataScheme.optional(),
    roleData: z.array(roleDataScheme).optional(),
    policyData: z.array(policyDataScheme).optional(),
    groupData: z.array(groupDataScheme).optional(),
})
export type DialogDataType = z.infer<typeof dialogDataScheme>
