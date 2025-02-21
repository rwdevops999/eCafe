'use client'

import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import ServiceSelect from "@/components/ecafe/service-select";
import { useEffect, useRef, useState } from "react";
import StatementCreateDialog from "../create/create-statement-dialog";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./table/colums";
import { TableMeta } from "@tanstack/react-table";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import AlertMessage from "@/components/ecafe/alert-message";
import { action_delete, allItems } from "@/data/constants";
import { AlertType, Data, ServiceType, StatementType } from "@/types/ecafe";
import { mapStatementsToData } from "@/lib/mapping";
import { createHistoryType, isNumber } from "@/lib/utils";
import { addHistory, handleDeleteStatement, handleLoadServices, handleLoadStatements } from "@/lib/db";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import { useDebug } from "@/hooks/use-debug";
import { ConsoleLogger } from "@/lib/console.logger";

const StatementDetails = ({_service, _sid}:{_service: number | string; _sid: string;}) => {
  const {debug} = useDebug();
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const [loader, setLoader] = useState<boolean>(false);
  const [reload, setReload] = useState(0);

  const [selectedService, setSelectedService] = useState<number | string>(allItems);
  const [selectedSid, setSelectedSid] = useState<string>(allItems);

  const services = useRef<ServiceType[]>([]);

  const [statements, setStatements] = useState<StatementType[]>([]);
  const [statementData, setStatementData] = useState<Data[]>();

  const statementsLoaded = useRef<boolean>(false);

  const [alert, setAlert] = useState<AlertType>();

  const serviceName = useRef<string>('All');

  const prepareStatementsLoad = (_service: number | string, _sid: string): number => {
    let serviceId: number = 0;

    if (typeof _service === 'number') {
      serviceId = _service;
      const service = services.current.find((service) => service.id === _service);
      if (service) {
        serviceName.current = service.name;
      }
  } else {
      if (_service !== allItems) {
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

  const statementsLoadedCallback = (data: StatementType[]) => {
    logger.debug("StatementDetails", "Statements loaded", JSON.stringify(data));
    setStatements(data);
    setStatementData(mapStatementsToData(data, services.current));
    statementsLoaded.current = true;
    setLoader(false);
  }

  const servicesLoadedCallback = (data: ServiceType[]) => {
    logger.debug("StatementDetails", "Services loaded", JSON.stringify(data));
    services.current = data;

    setSelectedService(_service);

    setSelectedSid(_sid);

    const serviceId: number = prepareStatementsLoad(_service, _sid);
    handleLoadStatements(serviceId, _sid, statementsLoadedCallback);
  }

  useEffect(() => {
    if (_service && _sid) {
      setLoader(true);
      handleLoadServices(servicesLoadedCallback);
    }
  }, []);

  useEffect(() => {
    setLoader(true);
    const serviceId: number = prepareStatementsLoad(selectedService, selectedSid);
    handleLoadStatements(serviceId, selectedSid, statementsLoadedCallback);
  }, [reload, setReload]);

  const handleChangeService = (_service: string) => {
    logger.debug("StatementDetails", "Service changed", _service);
    setLoader(true);
    const serviceId: number = prepareStatementsLoad(_service, '*');
    handleLoadStatements(serviceId, '*', statementsLoadedCallback);
    setSelectedService(_service);
    serviceName.current = _service === allItems ? 'All' : _service;
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
        logger.debug("StatementDetails", "Statement is in a policy", _statement.name);
        if (statement.policies.length > 0) {
          alert.open = true;
          alert.error = true;
          alert.title = "Unable to delete statement";
          alert.message = `Statement is in policy '${statement.policies[0].name}'`;
        }
      }

      return alert;
  }

  /** for admin only later on */
  const handleDeleteManagedStatement = (statement: Data) => {
    logger.debug("StatementDetails", `Forcing deleting managed statement ${statement.name}`);
    addHistory(createHistoryType("info", "Statement delete", "Managed statement ${statement.name} is forced deleted", "Statement"));
    handleDeleteStatement(statement.id, statementDeletedCallback);
    setAlert(undefined);
  }

  const handleAction = (action: string, statement: Data) => {
    if (action === action_delete) {
      if (statement.other?.managed) {
        const alert = {
          open: true,
          error: true,
          title: "Unable to delete statement.",
          message: "Managed statements can not be deleted.",
          // child: <Button className="bg-orange-500" size="sm" onClick={() => setAlert(undefined)}>close</Button>
          child: <Button className="bg-orange-500" size="sm" onClick={() => handleDeleteManagedStatement(statement)}>delete anyway</Button>
        };

        setAlert(alert);
      } else {
        let alert = statementInPolicy(statement);
        if (alert.error) {
          setAlert(alert);
        } else {
          addHistory(createHistoryType("info", "Statement delete", "Deleting statement ${statement.name}", "Statement"));
          handleDeleteStatement(statement.id, statementDeletedCallback);
        }
      }
    }
  }

  const meta: TableMeta<Data[]> = {
    handleAction: handleAction,
  };

  const renderComponent = () => {
    if (alert && alert.open) {
        return (<AlertMessage alert={alert}></AlertMessage>)
    }

    return (
      <div>
        <PageBreadCrumbs crumbs={[{name: "ecafé", url: "/"}, {name: "iam"}, {name: "statements", url: "/iam/statements/service=*"}]} />
        <div className="flex space-x-2 items-center">
          <PageTitle className="m-2" title={`Overview service statements for ${serviceName.current === 'All' ? 'All Services' : serviceName.current}`} />
          <EcafeLoader className={loader ? "" : "hidden"}/>
        </div>
          {!loader && 
            <div className="flex items-center justify-between p-5">
              <ServiceSelect defaultService={serviceName.current} forceAll={true} handleChangeService={handleChangeService}/>
              <StatementCreateDialog _service={serviceName.current} _enabled={statementsLoaded.current} setReload={setReload} /> 
            </div>
          }
        <div className="block space-y-5">
          {statementData && 
            <DataTable data={statementData} columns={columns} tablemeta={meta} Toolbar={DataTableToolbar} expandAll={isNumber(selectedService)}/>
          }
        </div>
      </div>
    )
    }

    return (<>{renderComponent()}</>);
}

export default StatementDetails;