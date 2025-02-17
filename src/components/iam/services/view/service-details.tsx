'use client'

import { DataTable } from "@/components/datatable/data-table";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import { useEffect, useState } from "react";
import { columns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { Data, ServiceType } from "@/types/ecafe";
import { mapServicesToData, mapServiceToDataArray } from "@/lib/mapping";
import { handleLoadServiceByIdentifier, handleLoadServices } from "@/lib/db";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import { useDebug } from "@/hooks/use-debug";
import { ConsoleLogger } from "@/lib/console.logger";
import { ApiResponseType } from "@/types/db";
import { isNumber, js, showToast } from "@/lib/utils";
import { allItems, defaultService } from "@/data/constants";
import ServiceSelect from "@/components/ecafe/service-select";

const ServiceDetails = ({selectedService}:{selectedService: string | number;}  ) => {
  const [servicesData, setServicesData] = useState<Data[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const {debug} = useDebug();
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const serviceLoadedCallback = (data: ApiResponseType): void => {
    if (data.status === 200) {
        let service: ServiceType = data.payload;

        logger.debug("ServiceDetails", "Service loaded", js(service));
        logger.debug("ServiceDetails", "Mapped Service", js(mapServiceToDataArray(service)));

        setServicesData(mapServiceToDataArray(service));
        showToast("info", "Service loaded")
      }

      setLoader(false);
  }

  const servicesLoadedCallback = (data: ApiResponseType): void => {
    if (data.status === 200) {
      let services: ServiceType[] = data.payload;

      logger.debug("ServiceDetails", "Services loaded", js(services));
      logger.debug("ServiceDetails", "Mapped Services", js(mapServicesToData(services)));
      setServicesData(mapServicesToData(services));
      showToast("info", "Services loaded")
    }

    setLoader(false);
  }

  useEffect(() => {
    setLoader(true);
    if (selectedService !== allItems) {
      handleLoadServiceByIdentifier(selectedService, serviceLoadedCallback);
    } else {
      handleLoadServices(servicesLoadedCallback)
    }
  }, []);

  const handleChangeService = (_service: string) =>  {
    logger.debug("ServiceDetails", "handleChangeService", _service);
    setLoader(true);
    if (_service !== allItems) {
      handleLoadServiceByIdentifier(_service, serviceLoadedCallback);
    } else {
      handleLoadServices(servicesLoadedCallback)
    }
    selectedService
  }

  const renderComponent = () => {
    return (
      <div>
        <PageBreadCrumbs crumbs={[{name: "ecafé", url: "/"}, {name: "iam"}, {name: "services", url: "/iam/services/service=*"}]} />
        <div className="flex space-x-2 items-center">
          <PageTitle className="m-2" title={`Services`} />
          <EcafeLoader className={loader ? "" : "hidden"}/>
        </div>

        <div className="block space-y-5">
          {! isNumber(selectedService) &&
          <div className="ml-5">
            <ServiceSelect defaultService={selectedService!} handleChangeService={handleChangeService}/>
          </div>
          }
          {!loader && <DataTable data={servicesData} columns={columns} Toolbar={DataTableToolbar} expandAll={isNumber(selectedService)}/>}
        </div>
      </div>
    );
  };

  return (<>{renderComponent()}</>);
}

export default ServiceDetails;
