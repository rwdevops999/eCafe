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
import { mapStatementsToData, mapStatementToDataArray } from "@/lib/mapping";
import { createHistoryType, isNumber, js, showToast } from "@/lib/utils";
import { createHistory, handleDeleteStatement, handleLoadServices, handleLoadStatements } from "@/lib/db";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import { useDebug } from "@/hooks/use-debug";
import { ConsoleLogger } from "@/lib/console.logger";
import { ApiResponseType } from "@/types/db";

const StatementDetails = ({_service, _sid}:{_service: number | string; _sid: string;}) => {
  const {debug} = useDebug();
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const [loader, setLoader] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

  const reloadAllowed = useRef<boolean>(false);
  const isReloadAllowed = (): boolean => {
    return reloadAllowed.current;
  }

  const setReloadAllowed = (b: boolean): void => {
    reloadAllowed.current = b;
  }

  const changeReload = () => {
    reloadAllowed.current = ! reloadAllowed.current;
    setReload((b: boolean) => !b);
  }

  const selectedServiceIdentifier = useRef<number | string>(allItems);
  const setSelectedServiceIdentifier = (ident: number | string): void => {
    selectedServiceIdentifier.current = ident;
  }

  const getSelectedServiceIdentifier = (): number|string => {
    return selectedServiceIdentifier.current;
  }

  const selectedSidIdentifier = useRef<string>(allItems);
  const setSelectedSidIdentifier = (ident: string): void => {
    selectedSidIdentifier.current = ident;
  }

  const getSelectedSidIdentifier = (): string => {
    return selectedSidIdentifier.current;
  }

  const services = useRef<ServiceType[]>([]);
  const setLoadedServices = (_services: ServiceType[]): void => {
    services.current = _services;
  }

  const getLoadedServices = (): ServiceType[] => {
    return services.current;
  }

  const serviceName = useRef<string>('All');
  const setSelectedServiceName = (service: string): void => {
    serviceName.current = service;
  }

  const getSelectedServiceName = (): string => {
    return serviceName.current;
  }
  const loadedStatements = useRef<StatementType[]>([]);
  const setLoadedStatements = (_statements: StatementType[]): void => {
    loadedStatements.current = _statements;
  }

  const getLoadedStatements = (_statements: StatementType[]): void => {
    loadedStatements.current = _statements;
  }

  const [statementData, setStatementData] = useState<Data[]>();

  const statementsLoaded = useRef<boolean>(false);
  const setStatementsAreLoaded = (loaded: boolean): void => {
    statementsLoaded.current = loaded;
  }

  const areStatementsLoaded = (): boolean => {
    return statementsLoaded.current;
  }

  const [alert, setAlert] = useState<AlertType>();

  const prepareStatementsLoad = (_service: number | string, _sid: string): number => {
    let serviceId: number = 0;

    logger.debug("StatementDetails", "prepareStatementsLoad", "Services loaded?", js(services.current));

    if (typeof _service === 'number') {
      serviceId = _service;
      const service = services.current.find((service) => service.id === _service);
      if (service) {
        serviceId = service.id;
        setSelectedServiceName(service.name);
      }
  } else {
      if (_service !== allItems) {
        const service = services.current.find((service) => service.name === _service);
        if (service) {
          serviceId = service.id;
          setSelectedServiceName(service.name);
        }
      } else {
        setSelectedServiceName('All');
      }
    }

    return serviceId;
  }

  const statementsLoadedCallback = (data: ApiResponseType) => {
    logger.debug("StatementDetails", "statementsLoadedCallback", "Statements loaded", js(data));

    if (data.status === 200) {
      if (Array.isArray(data.payload)) {
        logger.debug("StatementDetails", "Loaded statements ...", js(data.payload));

        const statements: StatementType[] = data.payload;
  
        setLoadedStatements(statements);

        logger.debug("StatementDetails", "Mapping => services?", js(getLoadedServices()));
        logger.debug("StatementDetails", "Mapped Statements", js(mapStatementsToData(statements, getLoadedServices())));

        setStatementData(mapStatementsToData(statements, services.current));
        showToast("info", "Statements loaded");
      } else {
  //       logger.debug("StatementDetails", "Statement loaded", js(data.payload));

  //       const statement: StatementType = data.payload;
  
  //       setStatements([statement]);
  //       setStatementData(mapStatementToDataArray(statement, services.current));
  //       showToast("info", "Statement loaded");
      }

      setStatementsAreLoaded(true);
    }

    setLoader(false);
  }

  const servicesLoadedCallback = (_data: ApiResponseType) => {
    if (_data.status === 200) {
      logger.debug("StatementDetails", "Services loaded", JSON.stringify(_data));

      setLoadedServices(_data.payload);

      const serviceId: number = prepareStatementsLoad(_service, _sid);
      logger.debug("StatementDetails", "Current Service", getSelectedServiceName());
      logger.debug("StatementDetails", "selected service id", serviceId);
      handleLoadStatements(serviceId, _sid, statementsLoadedCallback);
    }
  }

  useEffect(() => {
    logger.debug("StatementDetails", "UseEffect[]", Date.now());
    if (_service && _sid) {
      logger.debug("StatementDetails", "UseEffect[]", "Selected service", _service);
      setSelectedServiceIdentifier(_service);
      logger.debug("StatementDetails", "UseEffect[]", "Selected sid", _sid);
      setSelectedSidIdentifier(_sid);

      logger.debug("StatementDetails", "UseEffect[]", _service, _sid);
      setLoader(true);
      handleLoadServices(servicesLoadedCallback);
    }
  }, []);

  useEffect(() => {
    if (isReloadAllowed()) {
      setReloadAllowed(false);
      logger.debug("StatementDetails", "UseEffect[reload]", Date.now());
    // setLoader(true);
    // const serviceId: number = prepareStatementsLoad(selectedService, selectedSid);
    // handleLoadStatements(serviceId, selectedSid, statementsLoadedCallback);
    }
  }, [reload]);

  const handleChangeService = (_service: string) => {
    logger.debug("StatementDetails", "Service changed", _service);
    setLoader(true);
    const serviceId: number = prepareStatementsLoad(_service, '*');
    handleLoadStatements(serviceId, '*', statementsLoadedCallback);

    setSelectedServiceIdentifier(_service);

    setSelectedServiceName(_service === allItems ? 'All' : _service);
  }

  // const statementDeletedCallback = (data: ApiResponseType) => {
  //   if (data.status === 200) {
  //     setReload((x:any) => x+1);
  //   }
  // }

  // const statementInPolicy = (_statement: Data): AlertType => {
  //     let alert = {
  //       open: false,
  //       error: false,
  //       title: "",
  //       message: "",
  //       child: <Button className="bg-orange-500" size="sm" onClick={() => setAlert(undefined)}>close</Button>
  //     };

  //     let result: boolean = false;

  //     const statement = statements.find(s => s.id === _statement.id);
  //     if (statement && statement.policies) {
  //       logger.debug("StatementDetails", "Statement is in a policy", _statement.name);
  //       if (statement.policies.length > 0) {
  //         alert.open = true;
  //         alert.error = true;
  //         alert.title = "Unable to delete statement";
  //         alert.message = `Statement is in policy '${statement.policies[0].name}'`;
  //       }
  //     }

  //     return alert;
  // }

  // /** for admin only later on */
  const handleDeleteManagedStatement = (statement: Data) => {
    // logger.debug("StatementDetails", `Forcing deleting managed statement ${statement.name}`);
    // createHistory(createHistoryType("info", "Statement delete", "Managed statement ${statement.name} is forced deleted", "Statement"));
    // handleDeleteStatement(statement.id, statementDeletedCallback);
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
          child: (<div className="flex space-x-1">
                  <Button className="bg-orange-500" size="sm" onClick={() => handleDeleteManagedStatement(statement)}>delete anyway</Button>
                  <Button className="bg-orange-500" size="sm" onClick={() => setAlert(undefined)}>OK</Button>
                  </div>)
        };

        setAlert(alert);
      } else {
        // let alert = statementInPolicy(statement);
        // if (alert.error) {
        //   setAlert(alert);
        // } else {
        //   createHistory(createHistoryType("info", "Statement delete", "Deleting statement ${statement.name}", "Statement"));
        //   handleDeleteStatement(statement.id, statementDeletedCallback);
        // }
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

    logger.debug("StatementDetails", "RENDER");

    return (
      <div>
          {/* <Button onClick={changeReload}>RELOAD</Button> */}
        <PageBreadCrumbs crumbs={[{name: "ecafé", url: "/"}, {name: "iam"}, {name: "statements", url: "/iam/statements/service=*"}]} />
        <div className="flex space-x-2 items-center">
          <PageTitle className="m-2" title={`Overview service statements for ${getSelectedServiceName() === 'All' ? 'All Services' : getSelectedServiceName()}`} />
          <EcafeLoader className={loader ? "" : "hidden"}/>
        </div>
          {!loader && 
            <div className="flex items-center justify-between p-5">
              <ServiceSelect defaultService={getSelectedServiceName()} forceAll={true} handleChangeService={handleChangeService}/>
              <StatementCreateDialog _service={getSelectedServiceName()} _enabled={statementsLoaded.current} setReload={setReload} /> 
            </div>
          }
        <div className="block space-y-5">
          {statementData && 
            <DataTable data={statementData} columns={columns} tablemeta={meta} Toolbar={DataTableToolbar} expandAll={isNumber(getSelectedServiceIdentifier())}/>
          }
        </div>
      </div>
    )
    }

    return (<>{renderComponent()}</>);
}

export default StatementDetails;
