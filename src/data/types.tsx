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

export type FunctionDefault = () => void;

export type CallbackFunctionDefault = (end: FunctionDefault) => void;
export type CallbackFunctionSubjectLoaded = (data: any[], end: FunctionDefault) => void;

export type CallbackFunctionDependencyLoaded = (subject: any, data: any[]) => void;

export type NewButtonConfig = {
  createButton?: boolean,
  updateButton?: boolean,
  validateButton?: boolean,
  cancelButton?: boolean
}

export type CombinedType = NewRoleType|NewPolicyType|NewGroupType;
