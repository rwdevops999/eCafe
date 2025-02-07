import { SidebarMenuButton } from "@/components/ui/sidebar"
import { SidebarServiceType } from "@/data/navigation-scheme"
import Link from "next/link"

const ServiceLink = ({service}:{service:SidebarServiceType}) => {
    const renderComponent = () => {
        <SidebarMenuButton asChild tooltip={service.title}>
            <Link href={service.url}>
                <service.icon />
                <span>{service.title}</span>
            </Link>
        </SidebarMenuButton>
    }

  return(<>{renderComponent()}</>)
}

export default ServiceLink;