
import {z} from "zod";

export const access = ["Allow", "Deny"];
export const defaultAccess: string = "Allow";

const AccessEnum = z.enum(["Allow", "Deny"]);
export type AccessType = z.infer<typeof AccessEnum>

export const actionScheme = z.object({
    id: z.number(),
    name: z.string(),
});
export type ActionType = z.infer<typeof actionScheme>

const serviceScheme = z.object({
    id: z.number(),
    name: z.string(),
    actions: z.array(actionScheme),
    statements: z.array(z.any())
})
export type ServiceType = z.infer<typeof serviceScheme>;

export const defaultService: ServiceType = {id: 0, name: "Stock", actions: [], statements: []};

export const serviceStatementScheme = z.object({
    id: z.number(),
    sid: z.string().min(3).max(25),
    description: z.string().min(3).max(50),
    permission: z.string(),
    managed: z.boolean(),
    service: serviceScheme,
    serviceId: z.number(),
    actions: z.array(actionScheme),
    policies: z.array(z.any()),
});
export type ServiceStatementType = z.infer<typeof serviceStatementScheme>

// POLICY
const policyScheme = z.object({
    id: z.number(),
    name: z.string().optional(),
    description: z.string().optional(),
    managed: z.boolean().optional(),
    statements: z.array(serviceStatementScheme).optional(),
    roles: z.array(z.any()).optional(),
});
export type PolicyType = z.infer<typeof policyScheme>

const roleScheme = z.object({
    id: z.number(),
    name: z.string().optional(),
    description: z.string().optional(),
    managed: z.boolean().optional(),
    policies: z.array(policyScheme).optional(),
});
export  type RoleType = z.infer<typeof roleScheme>

export const countryScheme = z.object({
    id: z.number().optional(),
    name: z.string(),
    dialCode: z.string(),
    code: z.string().optional(),
});
export  type CountryType = z.infer<typeof countryScheme>

export const defaultCountry = {
    name: "Belgium",
    dialCode: "+32"
};

const addressScheme= z.object({
    id: z.number().optional(),
    street: z.string().optional().nullable(),
    number: z.string().optional().nullable(),
    box: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    postalcode: z.string().optional().nullable(),
    country: countryScheme,
    county: z.string().optional().nullable(),
});
export type AddressType = z.infer<typeof addressScheme>

const userScheme = z.object({
    id: z.number(),
    name: z.string(),
    firstname: z.string(),
    phone: z.string().optional(),
    phonecode: z.string().optional(),
    email: z.string(),
    password: z.string(),
    address: addressScheme,
    roles: z.array(roleScheme).optional(),
    policies: z.array(policyScheme).optional(),
});
export type UserType = z.infer<typeof userScheme>

const groupScheme = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
});
export type GroupType = z.infer<typeof groupScheme>
