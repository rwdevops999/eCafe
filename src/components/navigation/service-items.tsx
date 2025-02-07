import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenuAction, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { SidebarServiceType } from "@/data/navigation-scheme";

const ServiceItems = ({service}:{service: SidebarServiceType}) => {
  const {t} = useTranslation();

  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
      setIsClient(true);
    });

    const renderComponent = () => {
      return (
        service.children?.length ? (
          <>
              <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                  <ChevronRight />
                  <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
              </CollapsibleTrigger>
              <CollapsibleContent>
                  <SidebarMenuSub>
                  {service.children?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.tkey}>
                      <SidebarMenuSubButton asChild>
                      <Link href={subItem.url} className="capitalize">
                          {isClient ? t(subItem.tkey) : subItem.tkey}
                      </Link>
                      </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                  ))}
                  </SidebarMenuSub>
              </CollapsibleContent>
          </>
      ) : null
      );
    }

  return (
    <>{renderComponent()}</>
  )
}

export default ServiceItems;