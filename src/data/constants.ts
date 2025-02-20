import { CountryType, LanguageType, ServiceType } from "@/types/ecafe";

export const allItems = '*';
export const workingItems = '#';

export const paginationSizes = [10, 15, 20, 25, 30, 35, 40, 45, 50];

export const accessAllow: string = "Allow";
export const accessDeny: string = "Deny";
export const access = ["Allow", "Deny"];

export const defaultAccess: string = "Allow";
export const defaultService: ServiceType = {id: 0, name: "Stock", actions: [], statements: [], createDate: new Date(), updateDate: new Date()};

export const action_delete = "DELETE";
export const action_update = "UPDATE";

export const defaultCountry: CountryType = {
  id: 0,
  code: "BE",
  dialCode: "+32",
  name: "Belgium",
}

export const separator_equals = '%3D';
export const separator_ampersand = '%26';

export const dependency_roles = "roles";
export const dependency_policies = "policies";
export const dependency_groups = "groups";
export const dependency_users = "users";

export const defaultLanguage: LanguageType = {
  name: "English", 
  code: "en", 
  icon: "/flags/en.svg"
};

export const languages: LanguageType[] = [
  defaultLanguage,
  {
      name: "Belgie (NL)", 
      code: "be-NL", 
      icon: "/flags/be.svg"
  },
  {
      name: "Nederlands", 
      code: "nl", 
      icon: "/flags/nl.svg"
  },
  {
      name: "Français", 
      code: "fr", 
      icon: "/flags/fr.svg"
  }
]

export const MaxLoginAttemps: number = 3;

export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
