'use client'

import { DataTable } from "@/components/datatable/data-table";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import ServiceSelect from "@/components/ecafe/service-select";
import { useToast } from "@/hooks/use-toast";
import { memo, useEffect, useState } from "react";
import { columns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { ServiceType } from "@/data/iam-scheme";
import { Data, mapServicesToData } from "@/lib/mapping";
import { log } from "@/lib/utils";
import { CallbackFunctionSubjectLoaded } from "@/data/types";
import { handleLoadServicesWithService } from "@/lib/db";

const ServiceDetails = ({selectedService}:{selectedService?: string | undefined;}  ) => {
  const { toast, dismiss } = useToast()
  let toastId: string;

  const [servicesData, setServicesData] = useState<Data[]>([]);
    
  const renderToast = () => {
    let {id} = toast({title: "Services", description: "loading ..."})
    toastId = id;
  }

  const servicesLoadedCallback = (data: ServiceType[]) => {
    dismiss(toastId);
    setServicesData(mapServicesToData(data));
  }
    
  useEffect(() => {
    renderToast();
    handleLoadServicesWithService(selectedService!, servicesLoadedCallback);
  }, []);

  const handleChangeService = (_service: string) =>  {
    renderToast();
    handleLoadServicesWithService(_service, servicesLoadedCallback);
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
