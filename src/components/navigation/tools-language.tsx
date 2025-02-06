import { LanguageType } from "@/app/api/languages/data/scheme";
import { defaultLanguage } from "@/app/api/languages/route";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { FunctionDefault } from "@/data/types";
import { useToast } from "@/hooks/use-toast";
import { handleLoadLanguages } from "@/lib/db";
import { log } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const debug: boolean = false;

const ToolsLanguage = () => {
    const {open} = useSidebar();
    const {i18n} = useTranslation();

    const { toast, dismiss } = useToast();
    let toastId: string;
  
    const renderToast = (_title: string, _description: string): void => {
        log(debug, "ToolsLanguage", "render toast");
        let {id} = toast({title: `${_title}`, description: `${_description}`});
        toastId = id;
      }
      
    const renderToastLoadLanguages = () => renderToast("Loading...", "languages");
      
    const closeToast = () => {
      log(debug, "ToolsLanguage", "dismiss toast");
      dismiss(toastId);
    }
  
    const [languages, setLanguages] = useState<LanguageType[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

    const languagesLoadedCallback = (data: LanguageType[], _end: FunctionDefault) => {
        _end();
        
        setLanguages(data);
    }

    useEffect(() => {
        handleLoadLanguages(renderToastLoadLanguages, languagesLoadedCallback, closeToast); 
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