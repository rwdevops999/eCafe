import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarResourcesType } from "@/data/navigation-scheme";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ResourceItem from "./resource-item";

const NavResources = ({tkey, resources}:{tkey: string; resources: SidebarResourcesType}) => {
  const renderComponent = () => {
    const {t} = useTranslation();

    const [isClient, setIsClient] = useState<boolean>(false);

    useEffect(() => {
        setIsClient(true);
      });

      return (
      <SidebarGroup className="-ml-2 group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="capitalize">{isClient ? t(tkey) : tkey}</SidebarGroupLabel>
        <SidebarMenu className="ml-1">
          {resources.map((resource) => (
            <ResourceItem key={resource.tkey} resource={resource} />
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <>{renderComponent()}</>
  )
}

export default NavResources;