'use client'

import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import ServiceSelect from "@/components/ecafe/service-select";
import { action_delete, action_update, all } from "@/data/constants";
import { useEffect, useRef, useState } from "react";
import StatementCreateDialog from "../create/create-statement-dialog";
import { useToast } from "@/hooks/use-toast";
import { isNumber, log } from "@/lib/utils";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./table/colums";
import { TableMeta } from "@tanstack/react-table";
import { DataTableToolbar } from "./table/data-table-toolbar";
import AlertMessage from "@/app/(routing)/testing/alert-message";
import { Button } from "@/components/ui/button";
import { AlertType, CallbackFunctionDefault, CallbackFunctionSubjectLoaded } from "@/data/types";
import { ServiceStatementType, ServiceType } from "@/data/iam-scheme";
import { Data, mapStatementsToData } from "@/lib/mapping";
import { handleDeleteStatement, handleLoadServices, handleLoadStatements } from "@/lib/db";

const StatementDetails = ({_service, _sid}:{_service: number | string; _sid: string;}) => {
  const { toast, dismiss } = useToast();
  let toastId: string;

  const [reload, setReload] = useState(0);

  const [selectedService, setSelectedService] = useState<number | string>(all);
  const [selectedSid, setSelectedSid] = useState<string>(all);

  const services = useRef<ServiceType[]>([]);

  const [statements, setStatements] = useState<ServiceStatementType[]>([]);
  const [statementData, setStatementData] = useState<Data[]>();

  const statementsLoaded = useRef<boolean>(false);

  const [alert, setAlert] = useState<AlertType>();

  const renderToast = () => {
    let {id} = toast({title: "Loading...", description: "Services and Service Statements"})
    toastId = id;
  }

  const serviceName = useRef<string>(all);

  const prepareStatementsLoad = (_service: number | string, _sid: string): number => {
    let serviceId: number = 0;

    if (typeof _service === 'number') {
      serviceId = _service;
      const service = services.current.find((service) => service.id === _service);
      if (service) {
        serviceName.current = service.name;
      }
  } else {
      if (_service !== all) {
        const service = services.current.find((service) => service.name === _service);
        if (service) {
          serviceId = service.id;
          serviceName.current = service.name;
        }
      } else {
        serviceName.current = 'All';
      }
    }

    return serviceId;
  }

  const statementsLoadedCallback = (data: ServiceStatementType[]) => {
    dismiss(toastId);
    setStatements(data);
    setStatementData(mapStatementsToData(data, 2, services.current));
    statementsLoaded.current = true;
  }

  const servicesLoadedCallback = (data: ServiceType[]) => {
    services.current = data;

    setSelectedService(_service);

    setSelectedSid(_sid);

    const serviceId: number = prepareStatementsLoad(_service, _sid);
    handleLoadStatements(serviceId, _sid, statementsLoadedCallback);
  }

  useEffect(() => {
    if (_service && _sid) {
      renderToast();
      handleLoadServices(servicesLoadedCallback);
    }
  }, []);

  useEffect(() => {
    const serviceId: number = prepareStatementsLoad(selectedService, selectedSid);
    handleLoadStatements(serviceId, selectedSid, statementsLoadedCallback);
  }, [reload, setReload]);

  const handleChangeService = (_service: string) => {
    const serviceId: number = prepareStatementsLoad(_service, '*');
    handleLoadStatements(serviceId, '*', statementsLoadedCallback);
    setSelectedService(_service);
    serviceName.current = _service === all ? 'All' : _service;
  }

  const statementDeletedCallback = () => {
    setReload((x:any) => x+1);
  }

  const statementInPolicy = (_statement: Data): AlertType => {
      let alert = {
        open: false,
        error: false,
        title: "",
        message: "",
        child: <Button className="bg-orange-500" size="sm" onClick={() => setAlert(undefined)}>close</Button>
      };
    let result: boolean = false;

      const statement = statements.find(s => s.id === _statement.id);
      if (statement && statement.policies) {
        if (statement.policies.length > 0) {
          alert.open = true;
          alert.error = true;
          alert.title = "Unable to delete statement";
          alert.message = `Statement is in policy '${statement.policies[0].name}'`;
        }
      }

      return alert;
  }

  const handleAction = (action: string, statement: Data) => {
    if (action === action_delete) {
      if (statement.other?.managed) {
        const alert = {
          open: true,
          error: true,
          title: "Unable to delete statement.",
          message: "Managed statements can not be deleted.",
          child: <Button className="bg-orange-500" size="sm" onClick={() => setAlert(undefined)}>close</Button>
        };

        setAlert(alert);
      } else {
        let alert = statementInPolicy(statement);
        if (alert.error) {
          setAlert(alert);
        } else {
          handleDeleteStatement(statement.id, statementDeletedCallback);
        }
      }
    } else if (action === action_update) {
    }
  }

  const meta: TableMeta<Data[]> = {
    handleAction: handleAction,
  };

  const renderComponent = () => {
    if (alert && alert.open) {
        return (<AlertMessage alert={alert}></AlertMessage>)
      }

      if (selectedService && statementData) {
        return (
          <div>
            <PageBreadCrumbs crumbs={[{name: "iam"}, {name: "statements", url: "/iam/statements/service=*"}]} />
            <PageTitle className="m-2" title={`Overview service statements for ${serviceName.current === 'All' ? 'All Services' : serviceName.current}`} />
            <div className="flex items-center justify-between p-5">
              <ServiceSelect defaultService={serviceName.current} forceAll={true} handleChangeService={handleChangeService}/>
              <StatementCreateDialog _service={serviceName.current} _enabled={statementsLoaded.current} setReload={setReload} /> 
            </div>
            <div className="block space-y-5">
              <DataTable data={statementData} columns={columns} tablemeta={meta} Toolbar={DataTableToolbar} expandAll={isNumber(selectedService)}/>
            </div>
          </div>
        )
      } else {
        return null;
      }
    }

    return (<>{renderComponent()}</>);
}

export default StatementDetails;