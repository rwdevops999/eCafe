import { SidebarGroupLabel, SidebarMenu } from "@/components/ui/sidebar";
import { Collapsible } from "@/components/ui/collapsible";
import { useEffect, useState } from "react";
import { log } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { SidebarServicesType } from "@/data/navigation-scheme";
import ServiceItem from "./service-item";

const NavServices = ({tkey, services}:{tkey: string; services:SidebarServicesType}) => {
  const {t} = useTranslation();

  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
      setIsClient(true);
    });

  const [reload, setReload] = useState<number>(-1);

  const renderComponent = () => {
    return (
      <>
        <SidebarGroupLabel className="capitalize">{isClient ? t(tkey) : tkey}</SidebarGroupLabel>
        <SidebarMenu>
          {services.map(service =>
            <ServiceItem key={service.id} service={service} reload={reload} setReload={setReload}/>
          )}
        </SidebarMenu>
        </>
    );
  };

  return(<>{renderComponent()}</>)
}

export default NavServices;