import { BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb"
import { BreadCrumbsType } from "@/types/ecafe"

const PageBreadCrumbs = ({crumbs}:{crumbs:BreadCrumbsType[]}) => {
  return (
    <BreadcrumbList className="flex items-start cursor-pointer">
      {crumbs.map((crumb, index) => 
          <BreadcrumbItem key={crumb.name}>
            <BreadcrumbLink href={crumb.url ?? crumb.url}>{crumb.name}{index < (crumbs.length - 1) ? " >" : ""}</BreadcrumbLink>
          </BreadcrumbItem>
      )}
    </BreadcrumbList>
  )
}

export default PageBreadCrumbs