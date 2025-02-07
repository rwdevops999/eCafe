import { LanguageType } from "./types";

export const separator_equals = '%3D';
export const separator_ampersand = '%26';

export const all = '*';

export const action_delete = "DELETE";
export const action_update = "UPDATE";

export const defaultCountry: NewCountryType = {
    id: 0,
    code: "BE",
    dialCode: "+32",
    name: "Belgium",
  }
  
export const dependency_roles = "roles";
export const dependency_policies = "policies";
export const dependency_groups = "groups";

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
