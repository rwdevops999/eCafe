import { CountryDataType } from "@/components/iam/users/manage/tabs/data/data";
import { CountryType, PolicyType, RoleType, ServiceStatementType, ServiceType, UserType } from "./iam-scheme";

export type AlertType = {
  open: boolean;
  error: boolean;
  title: string;
  message: string;
  child?: any;
}

export type ServicebyIdAndNameType = {
  id: number,
  name: string
}

export type CallbackFunctionDefault = () => void;
export type CallbackFunctionServicesLoaded = (data: ServiceType[]) => void;
export type CallbackFunctionStatementsLoaded = (data: ServiceStatementType[]) => void;
export type CallbackFunctionPoliciesLoaded = (data: PolicyType[]) => void;
export type CallbackFunctionRolesLoaded = (data: RoleType[]) => void;
export type CallbackFunctionCountriesLoaded = (data: CountryType[]) => void;
export type CallbackFunctionUsersLoaded = (data: UserType[]) => void;
export type CallbackFunctionSubjectLoaded = (data: any[]) => void;

