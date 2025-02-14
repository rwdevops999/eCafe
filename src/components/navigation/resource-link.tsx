import { SidebarMenuButton } from "@/components/ui/sidebar";
import { SidebarResourceType } from "@/data/navigation-scheme";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProgressLink from "../ecafe/progress-link";

const ResourceLink = ({resource}:{resource:SidebarResourceType}) => {
    const {t} = useTranslation();

    const [isClient, setIsClient] = useState<boolean>(false);

    useEffect(() => {
        setIsClient(true);
      });

    const renderComponent = () => {
        return (
            <SidebarMenuButton asChild className="-ml-1">
                <ProgressLink href={resource.url} className="flex items-center">
        {/* <Link href={resource.url}> */}
                    <resource.icon />
                    <span className="capitalize">{isClient ? t(resource.tkey) : resource.tkey}</span>
                {/* </Link> */}
                </ProgressLink>
            </SidebarMenuButton>
        );
    }

    return (
        <>{renderComponent()}</>
    )
}

export default ResourceLink;