'use client'


import { DataTable } from "@/components/datatable/data-table";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import { Button } from "@/components/ui/button";
import { useDebug } from "@/hooks/use-debug";
import { ConsoleLogger } from "@/lib/console.logger";
import { createHistory, handleDeleteStatement, handleLoadStatementById, handleLoadStatements, handleLoadStatementsByServiceId } from "@/lib/db";
import { mapStatementsToData } from "@/lib/mapping";
import { ApiResponseType } from "@/types/db";
import { AlertType, Data, ServiceType, StatementType, UseStateValue } from "@/types/ecafe";
import { useEffect, useRef, useState } from "react";
import { columns } from "./table/colums";
import { TableMeta } from "@tanstack/react-table";
import { DataTableToolbar } from "./table/data-table-toolbar";
import PageTitle from "@/components/ecafe/page-title";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import ServiceSelect from "@/components/ecafe/service-select";
import Link from "next/link";
import StatementDialog from "../create/statement-dialog";
import { createHistoryType, cuv, guv, js } from "@/lib/utils";
import { action_delete, action_update } from "@/data/constants";
import AlertMessage from "@/components/ecafe/alert-message";

const StatementDetails = ({_statementId}:{_statementId: number|undefined;}) => {
  const {debug} = useDebug();
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  // const loadedStatements = useRef<StatementType[]>([]);
  // const setLoadedStatements = (_statements: StatementType[]): void => {
  //   loadedStatements.current = _statements;
  // }

  // const getLoadedStatements = (): StatementType[] => {
  //   return loadedStatements.current;
  // }

  // const [statementData, setStatementData] = useState<Data[]>();

  const serviceName = useRef<string|undefined>(undefined);
  const setSelectedServiceName = (service: string|undefined): void => {
    serviceName.current = service?? 'All';
  }

  const getSelectedServiceName = (): string => {
    return serviceName.current?? 'All';
  }

  const [loader, setLoader] = useState<boolean>(false);

  const statementsLoaded = useRef<boolean>(false);
  const setStatementsAreLoaded = (loaded: boolean): void => {
    statementsLoaded.current = loaded;
  }

  const areStatementsLoaded = (): boolean => {
    return statementsLoaded.current;
  }

  // const [reload, setReload] = useState<number>(0);

  // const services = useRef<ServiceType[]>([]);
  // const setLoadedServices = (_services: ServiceType[]): void => {
  //   services.current = _services;
  // }

  // const getLoadedServices = (): ServiceType[] => {
  //   return services.current;
  // }

  const [alert, setAlert] = useState<AlertType>();

  // const selectedStatementId = useRef<number|undefined>(undefined);
  // const setSelectedStatementId = (_statementId : number|undefined): void => {
  //   selectedStatementId.current = _statementId;
  // }

  // const getSelectedStatementId = (): number|undefined => {
  //   return selectedStatementId.current;
  // }

  // const servicesLoadedCallback = (_data: ApiResponseType) => {
  //   if (_data.status === 200) {
  //     setLoadedServices(_data.payload);
  //   }
  // }

  // const statementLoadedCallback = (_data: ApiResponseType): void => {
  //   if (_data.status === 200) {
  //     const statement: StatementType = _data.payload;

  //     setSelectedServiceName(statement.service!.name);

  //     setLoadedStatements([statement]);
  //     setStatementData(mapStatementToDataArray(statement));
  //     showToast("info", "Statement loaded");

  //     setStatementsAreLoaded(true);
  //   }

  //   setLoader(false);
  // }

  // const statementsLoadedCallback = (_data: ApiResponseType, _serviceName: string|undefined): void => {
  //   if (_data.status === 200) {
  //     const statements: StatementType[] = _data.payload;
  //     if (_serviceName) {
  //       setSelectedServiceName(_serviceName);
  //     } else {
  //       setSelectedServiceName('All');
  //     }

  //     setLoadedStatements(statements);
  //     setStatementData(mapStatementsToData(statements));
  //     showToast("info", "Statements loaded");

  //     setStatementsAreLoaded(true);
  //   }

  //   setLoader(false);
  // }

  useEffect(() => {
    console.log("SD MOUNTED");
    return (() => {
      console.log("SD UNMOUNTED");
    })
  }, []);

  // useEffect(() => {
  //    const service: ServiceType|undefined = getLoadedServices().find((_service) => _service.name === getSelectedServiceName());
  //     if (service) {
  //       setLoader(true);
  //       handleLoadStatementsByServiceId(service.id, statementsLoadedCallback);
  //     } else {
  //       handleLoadStatements(statementsLoadedCallback);
  //     }
  // }, [reload, setReload]);

  const statementDeletedCallback = (data: ApiResponseType, statementName: string) => {
    if (data.status === 200) {
      createHistory(createHistoryType("info", "Delete", `Deleted statement ${statementName}`, "Statement"));
      console.log("[SD]", "Clear statement info");
      loadedAllStatements.current = false;
      setCurrentStatementId(cuv(undefined));
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

      const statement = currentStatements.current.find((s: StatementType) => s.id === _statement.id)
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

  // // // /** for admin only later on */
  const handleDeleteManagedStatement = (statement: Data) => {
    handleDeleteStatement(statement.id, statementDeletedCallback, statement.name);
    setAlert(undefined);
  }

  const [openDialog, setOpenDialog] = useState<UseStateValue>({value: false, action: true});

  // const handleAction = (action: string, statement: Data) => {
  //   if (action === action_delete) {
  //     if (statement.other?.managed) {
  //       const alert = {
  //         open: true,
  //         error: true,
  //         title: "Unable to delete statement.",
  //         message: "Managed statements can not be deleted.",
  //         child: (<div className="flex space-x-1">
  //                 <Button className="bg-orange-500" size="sm" onClick={() => handleDeleteManagedStatement(statement)}>delete anyway</Button>
  //                 <Button className="bg-orange-500" size="sm" onClick={() => setAlert(undefined)}>OK</Button>
  //                 </div>)
  //       };

  //       setAlert(alert);
  //     } else {
  //       let alert = isStatementInPolicy(statement);
  //       if (alert.error) {
  //         setAlert(alert);
  //       } else {
  //         createHistory(createHistoryType("info", "Statement delete", "Deleting statement ${statement.name}", "Statement"));
  //         handleDeleteStatement(statement.id, statementDeletedCallback);
  //       }
  //     }
  //   } else {
  //     setSelectedStatementId(statement.id);

  //     setOpenDialog(true);
  //   }
  // }

  // const meta: TableMeta<Data[]> = {
  //   handleAction: handleAction,
  // };

  const handleDialogState = (state: boolean, resetService: boolean = true): void => {
    if (! state) {
      loadedAllStatements.current = false;

      if (resetService) {
        setSelectedServiceId(cuv(undefined, true));
        setCurrentStatementId(cuv(undefined, false));
      } else {
        setSelectedServiceId(cuv(guv(selectedServiceId), true));
        setCurrentStatementId(cuv(undefined, false));
      }

      setOpenDialog(cuv(state, false));
    } else if (resetService) {
      setSelectedServiceId(cuv(undefined, true));
    }

    setOpenDialog(cuv(state, true));
  }

  // const handleTableAction = () => {
  //   setSelectedStatementId(5);
  //   handleDialogState(true);
  // }

  // THE STATEMENT ID OF THE STATEMENT WE ARE WORKIN WITH (Incoming or Table selected)
  const [currentStatementId, setCurrentStatementId] = useState<UseStateValue>({value: undefined, action: true});

  useEffect(() => {
    if (_statementId) {
      setCurrentStatementId(cuv(_statementId));
    }
  }, [_statementId]);

  const currentStatements = useRef<StatementType[]>([]);
  const setCurrentStatements = (_statements: StatementType[]): void => {
      currentStatements.current = _statements;
  }

  const getCurrentStatements = (): StatementType[] => {
    return currentStatements.current;
  }

  const getCurrentStatement = (): StatementType|undefined => {
    const statement: StatementType|undefined = getCurrentStatements().find((statement) => statement.id === currentStatementId.value);

    if (statement) {
      return statement;
    }

    return undefined;
  }

  const [mappedStatements, setMappedStatements] = useState<Data[]>([]);

  const mapCurrentStatements = () => {
    const mappedStatements: Data[] = mapStatementsToData(getCurrentStatements());

    setMappedStatements(mappedStatements);
  }

  // Get Statement (when id is defined) with actions and service
  const statementLoadedCallback = (_data: ApiResponseType): void => {
    if (_data.status === 200) {
      const statement: StatementType = _data.payload;

      setCurrentStatements([statement]);

      mapCurrentStatements();
    }

    setStatementsAreLoaded(true);
    setLoader(false);
  }

  // Get Statements (when id is undefined) with actions and service
  const statementsLoadedCallback = (_data: ApiResponseType): void => {
    if (_data.status === 200) {
      const statements: StatementType[] = _data.payload;

      setCurrentStatements(statements);

      mapCurrentStatements();
    }

    setStatementsAreLoaded(true);
    setLoader(false);
  }

  const loadedAllStatements = useRef<boolean>(false);

  useEffect(() => {

    console.log("[SD]", "useEffect[currentStatementId");
    if (currentStatementId.value && currentStatementId.action) {
      setLoader(true);
      handleLoadStatementById(guv(currentStatementId), statementLoadedCallback)
      loadedAllStatements.current = false;
    } else {
      if (! loadedAllStatements.current) {
        if (currentStatementId.action) {
          setLoader(true);
          handleLoadStatements(statementsLoadedCallback);
          loadedAllStatements.current = true;
        }
      }
    }
  }, [currentStatementId]);

  const handleFakeStatementSelect = () => {
    console.log("SD: handleFakeStatementSelect");

    setSelectedServiceId(cuv(9, false));
    setCurrentStatementId(cuv(25));
  }

  const [selectedServiceId, setSelectedServiceId] = useState<UseStateValue>({value: undefined, action: true});

  useEffect(() => {
    if (selectedServiceId.value && selectedServiceId.action) {
      setLoader(true);
      handleLoadStatementsByServiceId(selectedServiceId.value, statementsLoadedCallback);
      loadedAllStatements.current = false;
    } else {
      if (! loadedAllStatements.current) {
        if (selectedServiceId.action) {
          setLoader(true);
          handleLoadStatements(statementsLoadedCallback);
          loadedAllStatements.current = true;
        }
      }
    }
  }, [selectedServiceId]);
  
  const handleFakeServiceSelect = () => {
    console.log("SD: handleFAkeServiceSelect");

    setSelectedServiceId(cuv(9));
  }

  const handleFakeDialog = () => {
    console.log("SD: handleFakeDialog");

    setOpenDialog(cuv(true));
  }

  const handleAction = (action: string, statement: Data): void => {
    console.log("SD", "Action Selected", "action =" , action, "id = ", js(statement));
    if (action === action_delete) {
      if (statement.other && statement.other.managed) {
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
          handleDeleteStatement(statement.id, statementDeletedCallback, statement.name);
        }
      }
    } else if (action === action_update) {
      console.log("[SD]", "Update", js(statement));

      setSelectedServiceId(cuv(statement.other?.serviceId));
      setCurrentStatementId(cuv(statement.id));

      setOpenDialog(cuv(true));
    }
  }

  const meta: TableMeta<Data[]> = {
    handleAction: handleAction,
  };

  const handleChangeService = (service: ServiceType|undefined) => {
    const serviceId: any = guv(selectedServiceId);

    if (serviceId != service?.id) {
      setSelectedServiceName(service ? service.name : undefined);
      setSelectedServiceId(cuv(service ? service.id : undefined));
    }
  }

  const renderComponent = () => {
    if (alert && alert.open) {
        return (<AlertMessage alert={alert}></AlertMessage>)
    }

    return (
      <div>
        <PageBreadCrumbs crumbs={[{name: "ecafé", url: "/"}, {name: "iam"}, {name: "statements", url: "/iam/statements/service=*"}]} />
        <div className="flex space-x-2 items-center">
          <PageTitle className="m-2" title={`Overview service statements for \'${getSelectedServiceName()}\'`} />
          <EcafeLoader className={loader ? "" : "hidden"}/>
        </div>
            <div className="flex items-center justify-between p-5">
              <ServiceSelect defaultService={guv(selectedServiceId)} handleChangeService={handleChangeService}/>
              {/* <ServiceSelect defaultService={getSelectedServiceName()} forceAll={true} handleChangeService={handleChangeService}/> */}
              {/* <StatementCreateDialog _service={getSelectedServiceName()} _enabled={statementsLoaded.current} setReload={setReload} openDialog={openDialog} setDialogState={handleDialogState} statementId={getSelectedStatementId()} setStatementId={setSelectedStatementId}/>  */}
              <StatementDialog 
                openDialog={guv(openDialog)} 
                buttonEnabled={areStatementsLoaded()}
                serviceId={guv(selectedServiceId)}
                statementId={guv(currentStatementId)}
                setDialogState={handleDialogState}
                changeService={handleChangeService}
              />
            </div>
          <div className="block space-y-5">
            {mappedStatements && 
              <DataTable data={mappedStatements} columns={columns} tablemeta={meta} Toolbar={DataTableToolbar} />
            }
          </div>
          <Button onClick={handleFakeStatementSelect}>Fake Table</Button>
          <Button onClick={handleFakeServiceSelect}>Fake Service</Button>
          <Button onClick={handleFakeDialog}>Open Dialog</Button>
      </div>
    )
  }

  return (<>{renderComponent()}</>);
}

export default StatementDetails;
