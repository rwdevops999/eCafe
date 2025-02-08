'use client'

import { DataTable } from "@/components/datatable/data-table";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import ServiceSelect from "@/components/ecafe/service-select";
import { useEffect, useState } from "react";
import { columns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { Data, ServiceType } from "@/types/ecafe";
import { mapServicesToData } from "@/lib/mapping";
import { handleLoadServicesWithServiceName } from "@/lib/db";
import EcafeLoader from "@/components/ecafe/ecafe-loader";

const ServiceDetails = ({selectedService}:{selectedService?: string | undefined;}  ) => {
  const [servicesData, setServicesData] = useState<Data[]>([]);
  const [loader, setLoader] = useState<boolean>(false);

  const servicesLoadedCallback = (data: ServiceType[]) => {
    setServicesData(mapServicesToData(data));
    setLoader(false);
  }
    
  useEffect(() => {
    setLoader(true);
    handleLoadServicesWithServiceName(selectedService!, servicesLoadedCallback);
  }, []);

  const handleChangeService = (_service: string) =>  {
    setLoader(true);
    handleLoadServicesWithServiceName(_service!, servicesLoadedCallback);
  }

  const renderComponent = () => {
    return (
      <div>
        <PageBreadCrumbs crumbs={[{name: "iam"}, {name: "services", url: "/iam/services/service=*"}]} />
        <div className="flex space-x-2 items-center">
          <PageTitle className="m-2" title={`Services`} />
          <EcafeLoader className={loader ? "" : "hidden"}/>
        </div>

        <div className="block space-y-5">
          <div className="ml-5">
            <ServiceSelect defaultService={selectedService!} handleChangeService={handleChangeService}/>
          </div>
          {!loader && <DataTable data={servicesData} columns={columns} Toolbar={DataTableToolbar}/>}
        </div>
      </div>
    );
  };

  return (<>{renderComponent()}</>);
}

export default ServiceDetails;
