import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarHeaderType } from "@/data/navigation-scheme";
import { log } from "@/lib/utils";
import HeaderLink from "./header-link";

const NavHeader = ({header}:{header: SidebarHeaderType}) => {
  const renderComponent = () => {
    return (
      <SidebarMenu className="-ml-2">
        <SidebarMenuItem>
          <SidebarMenuButton size="sm" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground text-md">
            <HeaderLink header={header} />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (<>{renderComponent()}</>);
}

export default NavHeader;