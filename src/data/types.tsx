import { CountryDataType } from "@/components/iam/users/manage/dist/data/data";
import { CountryType, PolicyType, RoleType, ServiceStatementType, ServiceType, UserType } from "./iam-scheme";

export type AlertType = {
  open: boolean;
  error: boolean;
  title: string;
  message: string;
  child?: any;
}

export type AlertTableType = {
  open: boolean;
  error: boolean;
  title: string;
  message: string;
  child?: any;
  table?: any;
}

export type ServicebyIdAndNameType = {
  id: number,
  name: string
}

export type CallbackFunctionDefault = () => void;
export type CallbackFunctionSubjectLoaded = (data: any[]) => void;

export type CallbackFunctionDependencyLoaded = (subject: any, data: any[]) => void;
