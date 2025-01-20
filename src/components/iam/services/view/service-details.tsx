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

const ServiceDetails = ({selectedService}:{selectedService?: string | undefined;}  ) => {
    const { toast, dismiss } = useToast()
    let toastId: string;

    const [servicesData, setServicesData] = useState<Data[]>([]);
    
    const loadServices = async (_service: string, callback: CallbackFunctionSubjectLoaded) => {
          await fetch(`http://localhost:3000/api/iam/services?service=${_service}&depth=1`)
            .then((response) => response.json())
            .then((response) => {
              callback(response);
            });
      }
    
      const handleLoadServices = async (_service: string, callback: CallbackFunctionSubjectLoaded) => {
          await loadServices(_service, callback);
      }
      
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
      handleLoadServices(selectedService!, servicesLoadedCallback);
    }, []);

    const handleChangeService = (_service: string) =>  {
      renderToast();
      handleLoadServices(_service, servicesLoadedCallback);
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

    return (
        <>{renderComponent()}</>
    )
}

export default ServiceDetails;
