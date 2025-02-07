import { SidebarMenuItem } from "@/components/ui/sidebar";
import ResourceLink from "./resource-link";
import ResourceItems from "./resource-items";
import { SidebarResourceType } from "@/data/navigation-scheme";

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