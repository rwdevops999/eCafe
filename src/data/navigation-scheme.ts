import { z } from "zod"

const sidebarHeaderSchema = z.object({
    name: z.string(),
    logo: z.any(),
    url: z.string(),
});

const sidebarToolSchema = z.object({
    id: z.number(),
    tkey: z.string(),
    icon: z.any(),
    child: z.any()
});

const sidebarToolsSchema = z.array(sidebarToolSchema);

const sidebarServiceSchema = z.object({
    id: z.number(),
    tkey: z.string(),
    url: z.string().url(),
    icon: z.any(),
    children: z.array(z.object({
        tkey: z.string(),
        url: z.string().url(),
    })).optional(),
})

const sidebarServicesSchema = z.array(sidebarServiceSchema);

const sidebarResourceSchema = z.object({
    tkey: z.string(),
    url: z.string().url(),
    icon: z.any(),
    children: z.array(z.object({
        tkey: z.string(),
        icon: z.any(),
        url: z.string().url(),
    }))
})

const sidebarResourcesSchema = z.array(sidebarResourceSchema);

const sidebarUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    avatar: z.string().url(),
});

const sidebarSchema = z.object({
    Header: sidebarHeaderSchema.optional(),
    User: sidebarUserSchema.optional(),
    Services: sidebarServicesSchema.optional(),
    Resources: sidebarResourcesSchema.optional(),
    Tools: sidebarToolsSchema.optional()
})
  
export type SidebarType = z.infer<typeof sidebarSchema>
export type SidebarHeaderType = z.infer<typeof sidebarHeaderSchema>
export type SidebarToolType = z.infer<typeof sidebarToolSchema>
export type SidebarToolsType = z.infer<typeof sidebarToolsSchema>
export type SidebarServiceType = z.infer<typeof sidebarServiceSchema>
export type SidebarServicesType = z.infer<typeof sidebarServicesSchema>
export type SidebarResourceType = z.infer<typeof sidebarResourceSchema>
export type SidebarResourcesType = z.infer<typeof sidebarResourcesSchema>
export type SidebarUserType = z.infer<typeof sidebarUserSchema>
