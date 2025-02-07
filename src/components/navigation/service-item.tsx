import { useEffect, useState } from "react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import ServiceItems from "./service-items";
import { Collapsible } from "@/components/ui/collapsible";
import { useTranslation } from "react-i18next";
import { SidebarServiceType } from "@/data/navigation-scheme";

const ServiceItem = ({service, reload, setReload}:{service:SidebarServiceType; reload: number; setReload(x: any)}) => {
    const {t} = useTranslation();

    const [isClient, setIsClient] = useState<boolean>(false);

    useEffect(() => {
        setIsClient(true);
      });

    const handleChange = (id: number) => {
      if (id === reload) {
          id = -1;
      }
      
      localStorage.setItem('activeServiceId', id.toString());
      setReload((x: any) => id);
    }
  
    const renderComponent = () => {
        return (
            <Collapsible key={service.tkey} open={service.id === reload} asChild onClick={() => handleChange(service.id)}>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href={service.url}>
                            <service.icon />
                            <span className="capitalize">{isClient ? t(service.tkey) : service.tkey}</span>
                        </Link>
                    </SidebarMenuButton>
                    <ServiceItems service={service}/>
                </SidebarMenuItem>
            </Collapsible>
        );
    }

  return(<>{renderComponent()}</>)
}

export default ServiceItem;