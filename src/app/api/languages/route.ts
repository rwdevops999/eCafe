import { NextRequest } from "next/server";
import { LanguageType } from "./data/scheme";

export const defaultLanguage: LanguageType = {
    name: "English", 
    code: "en", 
    icon: "/flags/en.svg"
};
  
const languages: LanguageType[] = [
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

export async function GET(request: NextRequest) {
    return Response.json(languages);
}

