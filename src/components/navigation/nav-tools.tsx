import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, useSidebar } from "@/components/ui/sidebar";
import { SidebarToolsType } from "@/data/navigation-scheme";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Tool from "./tool";

const NavTools = ({tkey, tools}:{tkey: string; tools: SidebarToolsType}) => {
    const {open} = useSidebar();
    const {t} = useTranslation();

    const [isClient, setIsClient] = useState<boolean>(false);

    useEffect(() => {
        setIsClient(true);
      });
  
    const renderComponent = () => {
        return (
            <SidebarGroup className="-ml-2">
                <SidebarGroupLabel>{isClient ? t(tkey) : "Services"}</SidebarGroupLabel>
                <SidebarGroupContent>
                {tools.map((tool) => (
                    <div key={tool.id}>
                        <Tool open={open} tool={tool} />
                    </div>
                ))}
                </SidebarGroupContent>
            </SidebarGroup>
        );
    }

  return(<>{renderComponent()}</>)
}

export default NavTools;