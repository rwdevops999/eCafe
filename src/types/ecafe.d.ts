import { z } from "zod";
import { dataScheme } from "@/data/schemes";

type CallbackFunctionDefault = () => void;
type CallbackFunctionSubjectLoaded = (data: any[]) => void;
type CallbackFunctionDependencyLoaded = (subject: any, data: any[]) => void;

type CallbackFunctionLoggedIn = () => void;

type BreadCrumbsType = z.infer<typeof breadCrumbsScheme>

type ActionType = {
  id: number,
  name: string,
  createDate?: Date,
  updateDate?: Date,
  service?: ServiceType
}  

type StatementActionType = {
  id: number,
  name: string,
  createDate?: Date,
  updateDate?: Date,
  statement?: StatementType,
  actionId?: number
}

type AddressType = {
  id: number,
  street: string,
  number: string,
  box: string,
  city: string,
  postalcode: string,
  county: string,
  countryId?: number,
  country: CountryType,
  userId?: number
  user?: UserType    
}

type Country = {
    name: string;
    dial_code: string;
    code: string;
}

/******* NEW */
type GroupType = {
  id?: number,
  name: string,
  description: string,
  roles?: RoleType[],
  policies?: PolicyType[],
  users?: UserType[],
}

type ExtendedGroupType = {
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

type AlertType = {
  open: boolean;
  error: boolean;
  title: string;
  message: string;
  child?: any;
}

type AlertTableType = {
  open: boolean;
  error: boolean;
  title: string;
  message: string;
  child?: any;
  table?: any;
}

type ButtonConfig = {
  createButton?: boolean,
  updateButton?: boolean,
  validateButton?: boolean,
  cancelButton?: boolean
}

type UserType = {
  id?: number,
  name: string,
  firstname: string,
  phone: string,
  email: string,
  password: string,
  passwordless?: boolean
  OTP?: string
  createDate?: Date,
  address?: AddressType,
  roles?: RoleType[],
  policies?: PolicyType[],
  groups?: GroupType[]
}

type CombinedType = NewRoleType|NewPolicyType|NewGroupType;

type Data = z.infer<typeof dataScheme>

type PolicyType = {
  id: number,
  name: string,
  description: string,
  managed: boolean,
  createDate?: Date,
  updateDate?: Date,
  statements?: StatementType[],
  roles?: RoleType[],
  groups?: GroupType[],
  users?: UserType[],
}

type RoleType = {
  id: number,
  name: string,
  description: string,
  managed: boolean
  createDate?: Date,
  updateDate?: Date,
  policies?: PolicyType[],
  groups?: GroupType[],
  users?: UserType[]
}

type StatementType = {
  id: number,
  serviceId: number,
  sid: string,
  description: string,
  permission: string,
  managed: boolean,
  createDate?: Date,
  updateDate?: Date,
  service?: ServiceType,
  actions?: StatementActionType[],
  policies?: PolicyType[]
}   

type ServiceType = {
  id: number,
  name: string,
  createDate?: Date,
  updateDate?: Date,
  actions?: ActionType[],
  statements?: StatementType[],
}  

type CountryType = {
  id: number,
  name: string,
  dialCode: string,
  code: string,
  addresses?: AddressType[]
}

type ExtendedUserType = {
  id?: number,
  name: string,
  firstname: string,
  phone: string,
  email: string,
  password: string,
  passwordless?: boolean
  OTP?: string
  address?: AddressType,
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

type LanguageType = z.infer<typeof languageScheme>

type EmailType = {
  destination: string,
  userId: number,
  OTPcode: string
}

type NotificationButtonsType = {
  leftButton?: string,
  centerButton?: string,
  rightButton?: string
}
