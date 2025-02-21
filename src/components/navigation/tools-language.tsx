import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { defaultLanguage } from "@/data/constants";
import { handleLoadLanguages } from "@/lib/db";
import { LanguageType } from "@/types/ecafe";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ToolsLanguage = () => {
    const {open} = useSidebar();
    const {i18n} = useTranslation();

    const [languages, setLanguages] = useState<LanguageType[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

    const languagesLoadedCallback = (data: LanguageType[]) => {
        setLanguages(data);
    }

    useEffect(() => {
        handleLoadLanguages(languagesLoadedCallback); 
    }, []);

    useEffect(() => {
        i18n.changeLanguage(selectedLanguage.code);
    }, [selectedLanguage, setSelectedLanguage]);
    
    const renderComponent = () => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="h-[25px] flex items-center gap-2 text-xs text-foreground border-[1px] border-foreground bg-background hover:bg-foreground/30 hover:text-white">
                        <img
                        src={selectedLanguage.icon}
                        alt={`${selectedLanguage.code.toUpperCase()} Flag`}
                        width={16}
                        height={16}
                        className="rounded-full"
                        style={{ aspectRatio: "16/16", objectFit: "cover" }}
                        />
                        {open &&  <span className="font-medium">{selectedLanguage.name}</span>}
                        <ChevronDownIcon className="h-4 w-4 cursor-pointer" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {languages.map((language) => 
                        <DropdownMenuItem key={language.code} onClick={() => setSelectedLanguage(language)}>
                        <div className="flex items-center gap-2">
                            <img
                            src={language.icon}
                            width={18}
                            height={18}
                            className='rounded-full'
                            style={{aspectRatio: "18/18", objectFit: "cover"}}
                            />
                        <span>{language.name}</span>
                        </div>
                        </DropdownMenuItem>
                        )}
                    </DropdownMenuGroup>
        
                </DropdownMenuContent>
            </DropdownMenu>    
        );
    };

  return (<>{renderComponent()}</>);
}

export default ToolsLanguage;