'use client'

import { DataTable } from "@/components/datatable/data-table";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import ServiceSelect from "@/components/ecafe/service-select";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { columns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { ServiceType } from "@/data/iam-scheme";
import { Data, mapServicesToData } from "@/lib/mapping";
import { handleLoadServicesWithService } from "@/lib/db";
import { log } from "@/lib/utils";

const debug = false;

const ServiceDetails = ({selectedService}:{selectedService?: string | undefined;}  ) => {
  const { toast, dismiss } = useToast()
  let toastId: string;

    const renderToast = (_title: string, _description: string): void => {
      log(debug, "UserDetails", "render toast");
      let {id} = toast({title: `${_title}`, description: `${_description}`});
      toastId = id;
    }
  
    const renderToastLoadServices = () => renderToast("Loading...", "services");
  
    const closeToast = () => {
      log(debug, "ServiceDetails", "dismiss toast");
      dismiss(toastId);
    }
  
  const [servicesData, setServicesData] = useState<Data[]>([]);
    
  const servicesLoadedCallback = (data: ServiceType[]) => {
    dismiss(toastId);
    setServicesData(mapServicesToData(data));
  }
    
  useEffect(() => {
    handleLoadServicesWithService(selectedService!, renderToastLoadServices, servicesLoadedCallback, closeToast);
  }, []);

  const handleChangeService = (_service: string) =>  {
    handleLoadServicesWithService(_service!, renderToastLoadServices, servicesLoadedCallback, closeToast);
  }

  const renderComponent = () => {
    return (
        <div>
        <PageBreadCrumbs crumbs={[{name: "iam"}, {name: "services", url: "/iam/services/service=*"}]} />
        <PageTitle className="m-2" title={`Services`} />

        <div className="block space-y-5">
            <div className="ml-5">
                <ServiceSelect defaultService={selectedService!} handleChangeService={handleChangeService}/>
            </div>
            <DataTable data={servicesData} columns={columns} Toolbar={DataTableToolbar}/>
        </div>
    </div>
    )
  };

  return (<>{renderComponent()}</>);
}

export default ServiceDetails;
