import { SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarResourceType } from "../data/scheme";
import ResourceLink from "./resource-link";
import ResourceItems from "./resource-items";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const ResourceItem = ({resource}:{resource:SidebarResourceType}) => {
    const renderComponent = () => {
        return (
            <SidebarMenuItem key={resource.tkey}>
                <ResourceLink resource={resource} />
                <ResourceItems resource={resource} />
            </SidebarMenuItem>
        );
    }

    return (<>{renderComponent()}</>);
}

export default ResourceItem;