'use client'

import { DataTable } from "@/components/datatable/data-table";
import AllowDenySwitch from "@/components/ecafe/allow-deny-switch";
import EcafeButton from "@/components/ecafe/ecafe-button";
import PageTitle from "@/components/ecafe/page-title";
import ServiceSelect from "@/components/ecafe/service-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { columns, initialTableState } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Separator } from "@/components/ui/separator";
import { Row } from "@tanstack/react-table"
import { ActionType, Data, ServiceType, StatementActionType, StatementType, UseStateValue } from "@/types/ecafe";
import { mapActionsToData, mapServiceActionsToData } from "@/lib/mapping";
import { defaultAccess, defaultService } from "@/data/constants";
import { createHistory, handleCreateStatement, handleLoadActions, handleLoadActionsByServiceId, handleLoadServiceByIdentifier, handleLoadStatementById } from "@/lib/db";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import { useDebug } from "@/hooks/use-debug";
import { ConsoleLogger } from "@/lib/console.logger";
import { ApiResponseType } from "@/types/db";
import { cloneObject, createHistoryType, cuv, guv, js, showToast } from "@/lib/utils";
import StatementForm from "./statement-form";
import { StatementEntity } from "./data/model";
import { Button } from "@/components/ui/button";
import { stat } from "fs";

const StatementDialog = (
  {
    openDialog = false,
    buttonEnabled = true, 
    serviceId,
    statementId,
    setDialogState,
    changeService,
    // setReload,
    // setStatementId 
  }
  :
  {
    openDialog: boolean;
    buttonEnabled:boolean; 
    serviceId: number|undefined; 
    statementId: number|undefined,
    setDialogState: (b: boolean, resetService: boolean) => void,
    changeService: (service: ServiceType|undefined) => void
    // setReload(x: any): void;
    // setStatementId: (_statementId : number|undefined) => void 

  }) => {
  const {debug} = useDebug();
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const [dialogServiceId, setDialogServiceId] = useState<UseStateValue>(cuv(undefined, false));
  const [dialogStatementId, setDialogStatementId] = useState<UseStateValue>(cuv(undefined, false));

  useEffect(() => {
      setLoader(true);

      const serviceId: UseStateValue = dialogServiceId;

      if (openDialog) {
        if (serviceId.value && serviceId.action) {
          let entity: StatementEntity = statementEntity.current;
          entity.serviceIdentifier = serviceId.value;
          setStatementEntity(entity);
          
          handleLoadActionsByServiceId(serviceId.value, actionsLoadedCallback);
        } else {
          handleLoadActions(actionsLoadedCallback);
        }
      }

    }, [dialogServiceId]);

  useEffect(() => {
    const statementId: UseStateValue = dialogStatementId;

    if (statementId.value && statementId.action) {
      setLoader(true);
      handleLoadStatementById(statementId.value, statementLoadedCallback);
    } else {
      let entity: StatementEntity = {
        sid: "",
        description: "",
        access: defaultAccess,
        managed: false,
        serviceIdentifier: guv(dialogServiceId),
        statementId: undefined
      }

      setStatementEntity(entity);
    }
  }, [dialogStatementId]);
  
  const actionsLoadedCallback = (_data: ApiResponseType): void => {
    if (_data.status === 200) {
      const actions: ActionType[] = _data.payload;
      
      const mappedActions: Data[] = mapActionsToData(actions);
      setActionsData(mappedActions);
      
      showToast("info", "Actions loaded");
    }

    setLoader(false);
  }

  const statementEntity = useRef<StatementEntity>({
    sid: "",
    description: "",
    access: defaultAccess,
    managed: false,
    serviceIdentifier: defaultService.name,
    statementId: undefined
  });
  const setStatementEntity = (entity: StatementEntity): void => {
    statementEntity.current = entity;
  }

  const getStatementEntity = (): StatementEntity => {
    return cloneObject(statementEntity.current);
  }

  const selectedStatement = useRef<UseStateValue>(cuv(undefined));
  const setSelectedStatement = (statement: StatementType|undefined) => {
    selectedStatement.current = cuv(statement);
  }

  const statementLoadedCallback = (_data: ApiResponseType): void => {
    if (_data.status === 200) {
      const statement: StatementType = _data.payload;

      let entity: StatementEntity = {
        sid: statement.sid,
        description: statement.description,
        access: statement.permission,
        managed: statement.managed,
        serviceIdentifier: statement.serviceId,
        statementId: statement.id
      }

      setSelectedStatement(statement);
      setStatementEntity(entity);

      handleLoadActionsByServiceId(statement.serviceId, actionsLoadedCallback);
    }
  }

  useEffect(() => {
    if (openDialog) {
      setDialogServiceId(cuv(serviceId));
      setDialogStatementId(cuv(statementId));
    }
}, [openDialog]);

  // const loadedServices = useRef<ServiceType[]>([]);
  // const setLoadedServices = (services: ServiceType[]): void => {
  //   loadedServices.current = services;
  // }

  // const setLoadedService = (service: ServiceType): void => {
  //   loadedServices.current = [service];
  // }

  // const getLoadedServices = (): ServiceType[] => {
  //   return loadedServices.current;
  // }

  const [actionsData, setActionsData] = useState<Data[]>([]);

  const [loader, setLoader] = useState<boolean>(false);

  const [selectedService, setSelectedService] = useState<ServiceType>();

  const [selectedActions, setSelectedActions] = useState<Data[]>([]);

  // const access = useRef<string>(defaultAccess);
  // const setAccess = (_access: string): void => {
  //   access.current = _access;
  // }
  // const getAccess = (): string => {
  //   return access.current;
  // }

  // const managed = useRef<boolean>(false);
  // const setManaged = (_managed: boolean): void => {
  //   managed.current = _managed;
  // }

  // const getManaged = (): boolean => {
  //   return managed.current;
  // }

  // const serviceLoadedCallback = (data: ApiResponseType) => {
  //   if (data.status === 200) {
  //     const service: ServiceType = data.payload;

  //     setLoadedService(service);

  //     setActionsData(mapServiceActionsToData([service]));
  //     showToast("info", "Actions loaded");
  //   }

  //   setLoader(false);
  // }

  // const resetAll = () => {
  //   access.current = defaultAccess;

  //   setActiveStatement({
  //     sid: "",
  //     access: defaultAccess,
  //     managed: false,
  //     description: "",
  //     statementId: undefined,
  //     serviceName: selectedService,
  //   });

  //   setLoader(true);
  //   handleLoadServiceByIdentifier(_service === 'All' ? defaultService.name : _service, serviceLoadedCallback);
  //   setSelectedService(_service === 'All' ? defaultService.name : _service);
  // }

  // const [activeStatement, setActiveStatement] = useState<StatementEntity>({
  //   sid: "",
  //   access: defaultAccess,
  //   managed: false,
  //   description: "",
  //   statementId: undefined,
  //   serviceName: selectedService,
  // });

  // const [selectedStatement, setSelectedStatement] = useState<StatementType|undefined>(undefined);

  // const statementLoadedCallback = (_data: ApiResponseType): void => {
  //   if (_data.status === 200) {
  //     const statement: StatementType = _data.payload;

  //     setSelectedStatement(statement);

  //     setActiveStatement({
  //       statementId: statement.id,
  //       sid: statement.sid,
  //       access: statement.permission,
  //       managed: statement.managed,
  //       description: statement.description,
  //       serviceName: selectedService,
  //     })
  //   }
  // }

  const getSelectedActionIds = (): number[] => {
    let actionIds: number[] = [];
    // if (selectedStatement && selectedStatement.actions) {
    //   actionIds = selectedStatement.actions.map((action: StatementActionType) => action.actionId??0)
    // }

    return actionIds;
  }

  // useEffect(() => {
  //   if (openDialog) {
  //     resetAll();

  //     if (statementId) {
  //       handleLoadStatementById(statementId, statementLoadedCallback);
  //     }
  //   }
  // }, [openDialog]);

  // useEffect(() => {
  //   setSelectedService(_service === 'All' ? defaultService.name : _service);
  // }, [_service]);

  const prepareStatement = (onCreate: boolean, data: StatementEntity): StatementType | undefined => {
    if (selectedActions && selectedActions.length > 0) {
      const _service = selectedService;
      const _actions = selectedActions.map(action => {return {id: action.id, name: action.name}});
      const statement: StatementType|undefined = guv(selectedStatement.current);

      return {
        id: onCreate ? 0 : data.statementId!,
        serviceId: _service ? _service.id : 0,
        sid: data.sid,
        description: data.description,
        permission: data.access,
        managed: data.managed,
        actions: _actions,
        createDate: (onCreate ? new Date() : (statement ? statement.createDate : new Date())),
        updateDate: new Date(),
        service: _service,
        policies: []
      }
    }

    return undefined;
  }

  const statementCreatedCallback = (data: ApiResponseType) => {
    if (data.status === 201) {
      createHistory(createHistoryType("info", "Create", `Statement created`, "Statement Details"));
      setDialogState(false, false);
    }
  };

  const onSubmit = (entity: StatementEntity) => {
    const statement: StatementType|undefined = prepareStatement(true, entity);

    if  (statement) {
      handleCreateStatement(statement, statementCreatedCallback);
    }
}

  const handleChangeActionSelection = (selection: Row<Data>[]) => {
    setSelectedActions(selection.map((row) => row.original));
  }

  // const changeAccessValue = (value: string) => {
  //   setAccess(value);
  // }

  // const changeManaged = (checked: CheckedState) => {
  //   if (typeof checked === 'boolean') {
  //     setManaged(checked);
  //   }
  // }

  const handleChangeService = (_service: ServiceType|undefined) => {
    setSelectedService(_service);

    if (_service) {
      handleLoadActionsByServiceId(_service.id, actionsLoadedCallback);
      changeService(_service);
    }
  }

  const handleCreateButton = (value: boolean) => {
    setDialogState(true);
  }

  useEffect (() => {
    console.log("SDLG", "MOUNT");

    return (() => console.log("SDLG", "UNMOUNTED"));
  }, []);

  const renderDialog = () => {
    // if (selectedService) {
        return (
          <Dialog open={openDialog}>
             <DialogTrigger asChild>
               <EcafeButton id="trigger" caption="Create statement" enabled={buttonEnabled} clickHandler={handleCreateButton} clickValue={true} />
             </DialogTrigger>
               <DialogContent className="min-w-[75%]" aria-describedby="">
                STATEMENT DIALOG
                 <DialogHeader>
                   <DialogTitle>
                     <div className="flex space-x-2 items-center">
                       {/* <PageTitle title={`Create service statement for ${serviceName}`} className="m-2 -ml-[2px]"/> */}
                       <PageTitle title={`Create service statement for selected service`} className="m-2 -ml-[2px]"/>
                       <EcafeLoader className={loader ? "" : "hidden"}/>
                     </div>
                     <Separator className="bg-red-500"/>
                   </DialogTitle>
                 </DialogHeader>
          {/* //       {!loader && */}
                  {/* <StatementForm statement={getStatementEntity()} cancelFn={setDialogState} submitFn={onSubmit} serviceChangeFn={handleChangeService} enabledOkButton={selectedActions.length > 0}/> */}
                  {/* <StatementForm statement={getStatementEntity()} cancelFn={setDialogState} serviceChangeFn={handleChangeService}/> */}
                  <StatementForm statement={getStatementEntity()} cancelFn={setDialogState} enabledButton={selectedActions.length > 0} submitFn={onSubmit} serviceFn={handleChangeService}/>
          {/* //       } */}
                {actionsData &&
                  <DataTable data={actionsData} columns={columns} handleChangeSelection={handleChangeActionSelection} initialTableState={initialTableState} Toolbar={DataTableToolbar} selectedItems={getSelectedActionIds()}/>
                }
               </DialogContent>
            </Dialog>
        );
    // } else {
    //   return null;
    // }
  }

  return (<>{renderDialog()}</>);
}

export default StatementDialog