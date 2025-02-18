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
import { Data, ServiceType, StatementActionType, StatementType } from "@/types/ecafe";
import { mapServiceActionsToData } from "@/lib/mapping";
import { defaultAccess, defaultService } from "@/data/constants";
import { createHistory, handleCreateStatement, handleLoadServiceByIdentifier, handleLoadStatementById } from "@/lib/db";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import { useDebug } from "@/hooks/use-debug";
import { ConsoleLogger } from "@/lib/console.logger";
import { ApiResponseType } from "@/types/db";
import { createHistoryType, js, showToast } from "@/lib/utils";
import StatementForm from "./statement-form";
import { StatementEntity } from "./data/model";
import { Button } from "@/components/ui/button";

const StatementCreateDialog = (
  {
    _service, 
    _enabled = true, 
    setReload,
    openDialog = false,
    statementId = undefined,
    setDialogState,
    setStatementId 
  }
  :
  {
    _service: string; 
    _enabled?:boolean; 
    setReload(x: any): void;
    openDialog?: boolean;
    statementId?: number|undefined,
    setDialogState: (b: boolean) => void,
    setStatementId: (_statementId : number|undefined) => void 

  }) => {
  const {debug} = useDebug();
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const loadedServices = useRef<ServiceType[]>([]);
  const setLoadedServices = (services: ServiceType[]): void => {
    loadedServices.current = services;
  }

  const setLoadedService = (service: ServiceType): void => {
    loadedServices.current = [service];
  }

  const getLoadedServices = (): ServiceType[] => {
    return loadedServices.current;
  }

  const [actionsData, setActionsData] = useState<Data[]>([]);

  const [loader, setLoader] = useState<boolean>(false);

  const [selectedService, setSelectedService] = useState<string>(defaultService.name);

  const [selectedActions, setSelectedActions] = useState<Data[]>([]);

  const access = useRef<string>(defaultAccess);
  const setAccess = (_access: string): void => {
    access.current = _access;
  }
  const getAccess = (): string => {
    return access.current;
  }

  const managed = useRef<boolean>(false);
  const setManaged = (_managed: boolean): void => {
    managed.current = _managed;
  }

  const getManaged = (): boolean => {
    return managed.current;
  }

  const serviceLoadedCallback = (data: ApiResponseType) => {
    if (data.status === 200) {
      const service: ServiceType = data.payload;

      setLoadedService(service);

      setActionsData(mapServiceActionsToData([service]));
      showToast("info", "Actions loaded");
    }

    setLoader(false);
  }

  const resetAll = () => {
    access.current = defaultAccess;

    setActiveStatement({
      sid: "",
      access: defaultAccess,
      managed: false,
      description: "",
      statementId: undefined,
      serviceName: selectedService,
    });

    setLoader(true);
    handleLoadServiceByIdentifier(_service === 'All' ? defaultService.name : _service, serviceLoadedCallback);
    setSelectedService(_service === 'All' ? defaultService.name : _service);
  }

  const [activeStatement, setActiveStatement] = useState<StatementEntity>({
    sid: "",
    access: defaultAccess,
    managed: false,
    description: "",
    statementId: undefined,
    serviceName: selectedService,
  });

  const [selectedStatement, setSelectedStatement] = useState<StatementType|undefined>(undefined);

  const statementLoadedCallback = (_data: ApiResponseType): void => {
    if (_data.status === 200) {
      const statement: StatementType = _data.payload;

      setSelectedStatement(statement);

      setActiveStatement({
        statementId: statement.id,
        sid: statement.sid,
        access: statement.permission,
        managed: statement.managed,
        description: statement.description,
        serviceName: selectedService,
      })
    }
  }

  const getStatementActionsId = (): number[] => {
    let actionIds: number[] = [];
    if (selectedStatement && selectedStatement.actions) {
      actionIds = selectedStatement.actions.map((action: StatementActionType) => action.actionId??0)
    }

    return actionIds;
  }

  useEffect(() => {
    if (openDialog) {
      resetAll();

      if (statementId) {
        handleLoadStatementById(statementId, statementLoadedCallback);
      }
    }
  }, [openDialog]);

  useEffect(() => {
    setSelectedService(_service === 'All' ? defaultService.name : _service);
  }, [_service]);

  const provisionStatement = (data: StatementEntity): StatementType | undefined => {
    if (selectedActions && selectedActions.length > 0) {
      const _service = getLoadedServices().find(service => service.name === selectedService)!;
      const _actions = selectedActions.map(action => {return {id: action.id, name: action.name}});

      return {
        id: 0,
        serviceId: _service.id,
        sid: data.sid,
        description: data.description,
        permission: access.current,
        managed: getManaged(),
        actions: _actions,
        createDate: new Date(),
        updateDate: new Date(),
        service: {
          id: _service.id,
          name: _service.name,
          actions: _service.actions,
          createDate: new Date(),
          updateDate: new Date(),
          statements: []
        },
        policies: []
      }
    }

    return undefined;
  }

  const statementCreatedCallback = (data: ApiResponseType) => {
    if (data.status === 201) {
      createHistory(createHistoryType("info", "Create", `Sattement created`, "Statement Details"));
      setReload((x: any) => x+1);
    }
  };

  const onSubmit = (entity: StatementEntity) => {
    // const statement: StatementType|undefined = provisionStatement(entity);

    // if  (statement) {
    //   handleCreateStatement(statement, statementCreatedCallback);
    // }

    // setDialogState(false);
  }

  const handleChangeSelection = (selection: Row<Data>[]) => {
    setSelectedActions(selection.map((row) => row.original));
  }

  const changeAccessValue = (value: string) => {
    setAccess(value);
  }

  const changeManaged = (checked: CheckedState) => {
    if (typeof checked === 'boolean') {
      setManaged(checked);
    }
  }

  const handleChangeService = (_service: string) => {
    setSelectedService(_service);
    handleLoadServiceByIdentifier(_service, serviceLoadedCallback);
  }

  const handleCreateButton = (value: boolean) => {
    setStatementId(undefined);
    setDialogState(true);
  }

  const renderDialog = () => {
    if (selectedService) {
        return (
          <Dialog open={openDialog}>
            <DialogTrigger asChild>
              <EcafeButton id="trigger" caption="Create statement" enabled={_enabled} clickHandler={handleCreateButton} clickValue={true} />
            </DialogTrigger>
              <DialogContent className="min-w-[75%]" aria-describedby="">
                <DialogHeader>
                  <DialogTitle>
                    <div className="flex space-x-2 items-center">
                      <PageTitle title={`Create service statement for ${selectedService}`} className="m-2 -ml-[2px]"/>
                      <EcafeLoader className={loader ? "" : "hidden"}/>
                    </div>
                    <Separator className="bg-red-500"/>
                  </DialogTitle>
                </DialogHeader>
                {!loader &&
                  <StatementForm statement={activeStatement} cancelFn={setDialogState} submitFn={onSubmit} serviceChangeFn={handleChangeService} enabledOkButton={selectedActions.length > 0}/>
                }
                {actionsData &&
                  <DataTable data={actionsData} columns={columns} handleChangeSelection={handleChangeSelection} initialTableState={initialTableState} Toolbar={DataTableToolbar} selectedItems={getStatementActionsId()}/>
                }
              </DialogContent>
            </Dialog>
        );
    } else {
      return null;
    }
  }

  return (<>{renderDialog()}</>);
}

export default StatementCreateDialog