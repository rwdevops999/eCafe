import { z } from "zod";
import { CountryType, PolicyType, RoleType, ServiceStatementType, ServiceType, UserType } from "./iam-scheme";
import { breadCrumbsScheme, languageScheme } from "./schemes";

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

export type CallbackFunctionDefault = () => void;
export type CallbackFunctionSubjectLoaded = (data: any[]) => void;

export type CallbackFunctionDependencyLoaded = (subject: any, data: any[]) => void;

export type NewButtonConfig = {
  createButton?: boolean,
  updateButton?: boolean,
  validateButton?: boolean,
  cancelButton?: boolean
}

export type CombinedType = NewRoleType|NewPolicyType|NewGroupType;


export type LanguageType = z.infer<typeof languageScheme>
export type BreadCrumbsType = z.infer<typeof breadCrumbsScheme>
