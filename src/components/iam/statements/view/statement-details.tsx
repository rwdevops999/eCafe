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
import { action_delete } from "@/data/constants";
import { AlertType, Data, ServiceType, StatementType } from "@/types/ecafe";
import { mapStatementsToData, mapStatementToDataArray } from "@/lib/mapping";
import { createHistoryType, js, showToast } from "@/lib/utils";
import { createHistory, handleDeleteStatement, handleLoadServices, handleLoadStatementById, handleLoadStatements, handleLoadStatementsByServiceId } from "@/lib/db";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import { useDebug } from "@/hooks/use-debug";
import { ConsoleLogger } from "@/lib/console.logger";
import { ApiResponseType } from "@/types/db";
import { boolean } from "zod";

const StatementDetails = ({_statementId}:{_statementId: number|undefined;}) => {
  const {debug} = useDebug();
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  console.log("SD IN");

  const loadedStatements = useRef<StatementType[]>([]);
  const setLoadedStatements = (_statements: StatementType[]): void => {
    loadedStatements.current = _statements;
  }

  const getLoadedStatements = (): StatementType[] => {
    return loadedStatements.current;
  }

  const [statementData, setStatementData] = useState<Data[]>();

  const serviceName = useRef<string>('All');
  const setSelectedServiceName = (service: string): void => {
    serviceName.current = service;
  }

  const getSelectedServiceName = (): string => {
    return serviceName.current;
  }

  const [loader, setLoader] = useState<boolean>(false);

  const statementsLoaded = useRef<boolean>(false);
  const setStatementsAreLoaded = (loaded: boolean): void => {
    statementsLoaded.current = loaded;
  }

  const [reload, setReload] = useState<number>(0);

  const services = useRef<ServiceType[]>([]);
  const setLoadedServices = (_services: ServiceType[]): void => {
    services.current = _services;
  }

  const getLoadedServices = (): ServiceType[] => {
    return services.current;
  }

  const [alert, setAlert] = useState<AlertType>();

  const selectedStatementId = useRef<number|undefined>(undefined);
  const setSelectedStatementId = (_statementId : number|undefined): void => {
    selectedStatementId.current = _statementId;
  }

  const getSelectedStatementId = (): number|undefined => {
    return selectedStatementId.current;
  }

  const servicesLoadedCallback = (_data: ApiResponseType) => {
    if (_data.status === 200) {
      logger.debug("StatementDetails", "Services loaded", JSON.stringify(_data));

      setLoadedServices(_data.payload);
    }
  }

  const statementLoadedCallback = (_data: ApiResponseType): void => {
    if (_data.status === 200) {
      const statement: StatementType = _data.payload;

      setSelectedServiceName(statement.service!.name);

      setLoadedStatements([statement]);
      setStatementData(mapStatementToDataArray(statement));
      showToast("info", "Statement loaded");

      setStatementsAreLoaded(true);
    }

    setLoader(false);
  }

  const statementsLoadedCallback = (_data: ApiResponseType, _serviceName: string|undefined): void => {
    logger.debug("StatementDetails", "statementsLoadedCallback", js(_data), _serviceName);
    if (_data.status === 200) {
      const statements: StatementType[] = _data.payload;
      logger.debug("StatementDetails", "statementsLoadedCallback", js(statements));

      logger.debug("StatementDetails", "statementsLoadedCallback", "serviceName", _serviceName);
      if (_serviceName) {
        setSelectedServiceName(_serviceName);
      } else {
        setSelectedServiceName('All');
      }

      setLoadedStatements(statements);
      logger.debug("StatementDetails", "statementsLoadedCallback", "PRE MAPPING", js(statements));
      setStatementData(mapStatementsToData(statements));
      showToast("info", "Statements loaded");

      setStatementsAreLoaded(true);
    }

    setLoader(false);
  }

  useEffect(() => {
    logger.debug("StatementDetails", "UseEffect[]", Date.now());
    if (_statementId) {
      logger.debug("StatementDetails", "UseEffect[]", "Selected statement id", _statementId);
      setLoader(true);
      handleLoadStatementById(_statementId, statementLoadedCallback)
    } else {
      setLoader(true);
      handleLoadStatements(statementsLoadedCallback)
    }

    handleLoadServices(servicesLoadedCallback);
  }, []);

  useEffect(() => {
    logger.debug("StatementDetails", "UseEffect[reload]", Date.now());
      logger.debug("StatementDetails", "UseEffect[reload]", Date.now());

      logger.debug("StatementDetails", "UseEffect[selectedServiceName]", getSelectedServiceName());
      logger.debug("StatementDetails", "UseEffect[loadedServices]", js(getLoadedServices()));
     const service: ServiceType|undefined = getLoadedServices().find((_service) => _service.name === getSelectedServiceName());
      logger.debug("StatementDetails", "UseEffect(service)]", service);
      if (service) {
        setLoader(true);
        handleLoadStatementsByServiceId(service.id, statementsLoadedCallback);
      } else {
        handleLoadStatements(statementsLoadedCallback);
      }
  }, [reload, setReload]);

  const handleChangeService = (_service: string) => {
    logger.debug("StatementDetails", "Service changed", _service);

    setLoader(true);

    const service: ServiceType|undefined = getLoadedServices().find((service) => service.name === _service);
    if (service) {
      handleLoadStatementsByServiceId(service.id, statementsLoadedCallback, service.name);
    } else {
      handleLoadStatements(statementsLoadedCallback);
    }
  }

  const statementDeletedCallback = (data: ApiResponseType, statementName: string) => {
    if (data.status === 200) {
      createHistory(createHistoryType("info", "Delete", `Deleted managed statement ${statementName}`, "Statement"));
      setReload((x:any) => x+1);
    }
  }

  const isStatementInPolicy = (_statement: Data): AlertType => {
      let alert = {
        open: false,
        error: false,
        title: "",
        message: "",
        child: <Button className="bg-orange-500" size="sm" onClick={() => setAlert(undefined)}>close</Button>
      };

      const statement = getLoadedStatements().find(s => s.id === _statement.id);
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

  // // /** for admin only later on */
  const handleDeleteManagedStatement = (statement: Data) => {
    logger.debug("StatementDetails", `Forcing deleting managed statement ${statement.name}`);
    handleDeleteStatement(statement.id, statementDeletedCallback, statement.name);
    setAlert(undefined);
  }

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleAction = (action: string, statement: Data) => {
    if (action === action_delete) {
      console.log("StatementDetails", "Delete?", js(statement));
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
        let alert = isStatementInPolicy(statement);
        if (alert.error) {
          setAlert(alert);
        } else {
          createHistory(createHistoryType("info", "Statement delete", "Deleting statement ${statement.name}", "Statement"));
          handleDeleteStatement(statement.id, statementDeletedCallback);
        }
      }
    } else {
      console.log(`UPDATE ${statement.id}`);
      setSelectedStatementId(statement.id);

      console.log("OPEN DIALOG");
      setOpenDialog(true);
    }
  }

  const closeDialog = () => {
    console.log("SD: Close Dialog", openDialog);

    console.log("CLOSE DIALOG");
    setOpenDialog(false);
  }

  const meta: TableMeta<Data[]> = {
    handleAction: handleAction,
  };

  const renderComponent = () => {
    console.log("SD RENDER", openDialog);

    if (alert && alert.open) {
        return (<AlertMessage alert={alert}></AlertMessage>)
    }

    logger.debug("StatementDetails", "RENDER", getSelectedServiceName());

    return (
      <div>
        <PageBreadCrumbs crumbs={[{name: "ecafé", url: "/"}, {name: "iam"}, {name: "statements", url: "/iam/statements/service=*"}]} />
        <div className="flex space-x-2 items-center">
          <PageTitle className="m-2" title={`Overview service statements for ${getSelectedServiceName() === 'All' ? 'All Services' : getSelectedServiceName()}`} />
          <EcafeLoader className={loader ? "" : "hidden"}/>
        </div>
          {!loader && 
            <div className="flex items-center justify-between p-5">
              <ServiceSelect defaultService={getSelectedServiceName()} forceAll={true} handleChangeService={handleChangeService}/>
              <StatementCreateDialog _service={getSelectedServiceName()} _enabled={statementsLoaded.current} setReload={setReload} openDialog={openDialog} setDialogState={setOpenDialog} statementId={getSelectedStatementId()}/> 
            </div>
          }
        <div className="block space-y-5">
          {statementData && 
            <DataTable data={statementData} columns={columns} tablemeta={meta} Toolbar={DataTableToolbar} />
            // expandAll={isNumber(getSelectedServiceIdentifier())}/>
          }
        </div>
      </div>
    )
    }

    return (<>{renderComponent()}</>);
}

export default StatementDetails;
