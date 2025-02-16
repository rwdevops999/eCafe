import { z } from "zod";
import { dataScheme, historyDataScheme, taskDataScheme } from "@/data/schemes";
import { apiResponseType } from "./db";

type CallbackFunctionNoParam = () => void;
type CallbackFunctionWithParam = (data: apiResponseType, additional?: any) => void;




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

type Country = {
    name: string;
    dial_code: string;
    code: string;
}

/******* NEW */
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

type CombinedType = NewRoleType|NewPolicyType|NewGroupType;

type Data = z.infer<typeof dataScheme>
type TaskData = z.infer<typeof taskDataScheme>

type LanguageType = z.infer<typeof languageScheme>

/* User for sending an email */
type EmailType = {
  destination: string,
  OTPcode: string,
  attemps: number,
  data: any
}

/* Returned from email sender */
type NotificationButtonsType = {
  leftButton?: string,
  centerButton?: string,
  rightButton?: string
}


export type typeType = "info" | "action";

type HistoryData = z.infer<typeof historyDataScheme>




// FROM PRISMA
export type CountryType = {
  id: number | undefined,
  name: string | null,
  dialCode: string | null,
  code: string | null,
  addresses?: AddressType[]
}

type ServiceType = {
  id: number,
  name: string,
  createDate: Date,
  updateDate: Date,
  actions?: ActionType[],
  statements?: StatementType[],
}  

type StatementType = {
  id: number,
  serviceId: number,
  sid: string,
  description: string,
  permission: string,
  managed: boolean,
  createDate: Date,
  updateDate: Date,
  service?: ServiceType,
  actions?: StatementActionType[],
  policies?: PolicyType[]
}   

type PolicyType = {
  id: number,
  name: string,
  description: string,
  managed: boolean,
  createDate: Date,
  updateDate: Date,
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
  createDate: Date,
  updateDate: Date,
  policies?: PolicyType[],
  groups?: GroupType[],
  users?: UserType[]
}

type UserType = {
  id: number,
  name: string,
  firstname: string,
  phone: string,
  email: string,
  password: string,
  passwordless?: boolean
  attemps: number,
  blocked: boolean,
  createDate: Date,
  updateDate: Date,
  address?: AddressType | null,
  roles?: RoleType[],
  policies?: PolicyType[],
  groups?: GroupType[]
}

type ExtendedUserType = {
  id?: number,
  name: string,
  firstname: string,
  phone: string,
  email: string,
  password: string,
  passwordless?: boolean
  attemps?: number,
  blocked?: boolean,
  address?: AddressType | null,
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

type AddressType = {
  id: number,
  street: string,
  number: string,
  box: string,
  city: string,
  postalcode: string,
  county: string,
  createDate: Date,
  updateDate: Date,
  countryId?: number | null,
  country?: CountryType | null,
  userId?: number | null,
  user?: UserType | null    
}

type GroupType = {
  id: number,
  name: string,
  description: string,
  createDate: Date,
  updateDate: Date,
  roles?: RoleType[],
  policies?: PolicyType[],
  users?: UserType[],
}

type OtpType = {
  id: number,
  email: string,
  OTP: string,
  attemps: number,
  userId: number | null,
  used: boolean,
  createDate: Date
  updateDate: Date
}

type TaskType = {
  id: number
  name: string
  description: string
  subject: string
  subjectId: number | null
  status: string
  createDate: Date
  updateDate: Date
}

type HistoryType = {
  id: number,
  type: string,
  title: string,
  description: string,
  originator: string,
  createDate: Date
  updateDate: Date
}

