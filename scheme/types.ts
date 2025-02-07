type NewActionType = {
    id: number,
    name: string,
    createDate?: Date,
    updateDate?: Date,
    service?: NewServiceType
}  

type NewServiceType = {
    id: number,
    name: string,
    createDate?: Date,
    updateDate?: Date,
    actions?: NewActionType[],
    statements?: NewStatementType[],
}  

type NewStatementActionType = {
    id: number,
    name: string,
    createDate?: Date,
    updateDate?: Date,
    statement?: NewStatementType,
    actionId?: number
}

type NewStatementType = {
    id: number,
    serviceId: number,
    sid: string,
    description: string,
    permission: string,
    managed: boolean,
    createDate?: Date,
    updateDate?: Date,
    service?: NewServiceType,
    actions?: NewStatementActionType[],
    policies?: NewPolicyType[]
}   

type NewCountryType = {
    id: number,
    name: string,
    dialCode: string,
    code: string,
    addresses?: NewAddressType[]
}

type NewAddressType = {
    id: number,
    street: string,
    number: string,
    box: string,
    city: string,
    postalcode: string,
    county: string,
    countryId?: number,
    country: NewCountryType,
    userId?: number
    user?: NewUserType    
}
  
type NewPolicyType = {
    id: number,
    name: string,
    description: string,
    managed: boolean,
    createDate?: Date,
    updateDate?: Date,
    statements?: NewStatementType[],
    roles?: NewRoleType[],
    groups?: NewGroupType[],
    users?: NewUserType[],
}

type NewRoleType = {
    id: number,
    name: string,
    description: string,
    managed: boolean
    createDate?: Date,
    updateDate?: Date,
    policies?: NewPolicyType[],
    groups?: NewGroupType[],
    users?: NewUserType[]
}

type NewUserType = {
    id?: number,
    name: string,
    firstname: string,
    phone: string,
    email: string,
    password: string,
    address?: NewAddressType,
    roles?: NewRoleType[],
    policies?: NewPolicyType[],
    groups?: NewGroupType[]
}

type NewExtendedUserType = {
    id?: number,
    name: string,
    firstname: string,
    phone: string,
    email: string,
    password: string,
    address?: NewAddressType,
    roles?: {
        selected?: any[],
        removed?: any[]
    },
    policies?: {
        selected?: any[],
        removed?: any[],
    },
    groups?: {
        selected?: any[],
        removed?: any[],
    }
}

type NewGroupType = {
    id?: number,
    name: string,
    description: string,
    roles?: NewRoleType[],
    policies?: NewPolicyType[],
    users?: NewUserType[],
}

type NewExtendedGroupType = {
    id?: number,
    name: string,
    description: string,
    roles?: {
        selected?: any[],
        removed?: any[]
    },
    policies?: {
        selected?: any[],
        removed?: any[],
    },
    users?: {
        selected?: any[],
        removed?: any[],
    }
}

