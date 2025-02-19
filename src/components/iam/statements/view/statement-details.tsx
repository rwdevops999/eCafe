'use client'

import { DataTable } from "@/components/datatable/data-table";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import { Button } from "@/components/ui/button";
import { useDebug } from "@/hooks/use-debug";
import { ConsoleLogger } from "@/lib/console.logger";
import { handleLoadStatementById, handleLoadStatements, handleLoadStatementsByServiceId } from "@/lib/db";
import { mapStatementsToData } from "@/lib/mapping";
import { ApiResponseType } from "@/types/db";
import { Data, ServiceType, StatementType, UseStateValue } from "@/types/ecafe";
import { useEffect, useRef, useState } from "react";
import { columns } from "./table/colums";
import { TableMeta } from "@tanstack/react-table";
import { DataTableToolbar } from "./table/data-table-toolbar";
import PageTitle from "@/components/ecafe/page-title";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import ServiceSelect from "@/components/ecafe/service-select";
import Link from "next/link";
import StatementDialog from "../create/statement-dialog";
import { cuv, guv, js } from "@/lib/utils";

const StatementDetails = ({_statementId}:{_statementId: number|undefined;}) => {
  const {debug} = useDebug();
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  console.log("SD IN");

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

  // const [alert, setAlert] = useState<AlertType>();

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

  // const statementDeletedCallback = (data: ApiResponseType, statementName: string) => {
  //   if (data.status === 200) {
  //     createHistory(createHistoryType("info", "Delete", `Deleted managed statement ${statementName}`, "Statement"));
  //     setReload((x:any) => x+1);
  //   }
  // }

  // const isStatementInPolicy = (_statement: Data): AlertType => {
  //     let alert = {
  //       open: false,
  //       error: false,
  //       title: "",
  //       message: "",
  //       child: <Button className="bg-orange-500" size="sm" onClick={() => setAlert(undefined)}>close</Button>
  //     };

  //     const statement = getLoadedStatements().find(s => s.id === _statement.id);
  //     if (statement && statement.policies) {
  //       if (statement.policies.length > 0) {
  //         alert.open = true;
  //         alert.error = true;
  //         alert.title = "Unable to delete statement";
  //         alert.message = `Statement is in policy '${statement.policies[0].name}'`;
  //       }
  //     }

  //     return alert;
  // }

  // // // /** for admin only later on */
  // const handleDeleteManagedStatement = (statement: Data) => {
  //   handleDeleteStatement(statement.id, statementDeletedCallback, statement.name);
  //   setAlert(undefined);
  // }

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

  const handleDialogState = (state: boolean): void => {
    console.log("SC", "handleDialogState", state);
    if (! state) {
      loadedAllStatements.current = false;


      // setSelectedServiceId(cuv(undefined, false));
      // setCurrentStatementId(cuv(undefined));
    }

    setOpenDialog(cuv(state, false));
  }

  // const handleTableAction = () => {
  //   setSelectedStatementId(5);
  //   handleDialogState(true);
  // }

  // THE STATEMENT ID OF THE STATEMENT WE ARE WORKIN WITH (Incoming or Table selected)
  const [currentStatementId, setCurrentStatementId] = useState<UseStateValue>({value: undefined, action: true});

  useEffect(() => {
    console.log("SD: UseEffect[_statementId]", _statementId);

    if (_statementId) {
      console.log("SD: UseEffect[_statementId]", "Loading...");

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
    console.log("SD: mapCurrentStatements", js(mappedStatements));
  }

  // Get Statement (when id is defined) with actions and service
  const statementLoadedCallback = (_data: ApiResponseType): void => {
    if (_data.status === 200) {
      console.log("SD: statementLoadedCallback", "Statement loaded");

      const statement: StatementType = _data.payload;
      console.log("SD: statementLoadedCallback", "Loaded statement", js(statement));

      setCurrentStatements([statement]);

      mapCurrentStatements();
    }

    setStatementsAreLoaded(true);
    setLoader(false);
  }

  // Get Statements (when id is undefined) with actions and service
  const statementsLoadedCallback = (_data: ApiResponseType): void => {
    if (_data.status === 200) {
      console.log("SD: statementsLoadedCallback", "All statements loaded");

      const statements: StatementType[] = _data.payload;
      console.log("SD: statementLoadedCallback", "Loaded statement", js(statements));

      setCurrentStatements(statements);

      mapCurrentStatements();
    }

    setStatementsAreLoaded(true);
    setLoader(false);
  }

  const loadedAllStatements = useRef<boolean>(false);

  useEffect(() => {
    console.log("SD: UseEffect[currentStatementId]", js(currentStatementId));

    if (currentStatementId.value && currentStatementId.action) {
      console.log("SD: UseEffect[currentStatementId]", "Loading...");

      setLoader(true);
      handleLoadStatementById(guv(currentStatementId), statementLoadedCallback)
      loadedAllStatements.current = false;
    } else {
      if (! loadedAllStatements.current) {
        console.log("SD: UseEffect[currentStatementId]", "Loading...");
        setLoader(true);
        handleLoadStatements(statementsLoadedCallback);
        loadedAllStatements.current = true;
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
    console.log("SD: UseEffect[selectedServiceId]", js(selectedServiceId));

    if (selectedServiceId.value && selectedServiceId.action) {
      console.log("SD: UseEffect[selectedServiceId]", "Loading(1)...");
      setLoader(true);
      handleLoadStatementsByServiceId(selectedServiceId.value, statementsLoadedCallback);
      loadedAllStatements.current = false;
    } else {
      if (! loadedAllStatements.current) {
        if (selectedServiceId.action) {
          console.log("SD: UseEffect[selectedServiceId]", "Loading(2)...");
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

  const handleAction = (action: string, statement: StatementType): void => {
    console.log("SD", "Action Selected", "action =" , action, "id = ", js(statement));
  }

  const meta: TableMeta<Data[]> = {
    handleAction: handleAction,
  };

  const handleChangeService = (service: ServiceType|undefined) => {
    console.log("CHANGE SERVICE(1)", js(service))
    console.log("CHANGE SERVICE(2)", guv(selectedServiceId))

    const serviceId: any = guv(selectedServiceId);

    console.log("CHANGE SERVICE(equal)", (serviceId != service?.id))

    if (serviceId != service?.id) {
      setSelectedServiceName(service ? service.name : undefined);
      console.log("SET SELECTED SERVICE ID", (service ? service.id : undefined));
      setSelectedServiceId(cuv(service ? service.id : undefined));
    }
  }

  const renderComponent = () => {
    console.log("SD RENDER", guv(selectedServiceId));

    // if (alert && alert.open) {
    //     return (<AlertMessage alert={alert}></AlertMessage>)
    // }

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
