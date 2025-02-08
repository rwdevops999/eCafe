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
import { Data, ServiceType, StatementType } from "@/types/ecafe";
import { mapServiceActionsToData } from "@/lib/mapping";
import { defaultAccess, defaultService } from "@/data/constants";
import { handleCreateStatement, handleLoadServicesWithServiceName } from "@/lib/db";
import EcafeLoader from "@/components/ecafe/ecafe-loader";


const FormSchema = z.object({
  sid: z.string().min(3).max(25),
  description: z.string().min(3).max(50),
});
type FormSchemaType = z.infer<typeof FormSchema>;

const StatementCreateDialog = ({_service, _enabled = true, setReload}:{_service: string; _enabled?:boolean; setReload(x:any): void;}) => {
  const [loader, setLoader] = useState<boolean>(false);

  /**
   * state of the dialog
   */
  const [open, setOpen] = useState<boolean>(false);

  /**
   * the selected service for creating the statement for
   */
  const [selectedService, setSelectedService] = useState<string>();

  /**
   * access level (allow or deny)
   */
  const access = useRef<string>(defaultAccess);

  /**
   * managed (true or false)
   */
  const managed = useRef<boolean>(false);

  /**
   * the services (and their actions, dempth = 1)
   */
  const services = useRef<ServiceType[]>([]);
  const [actionsData, setActionsData] = useState<Data[]>([]);

  /**
   * selected rows in format
   * [{"id":"3","data":{"id":13,"name":"CreateOrder","createDate":"2025-01-08T13:09:23.744Z","updateDate":"2025-01-08T13:09:23.744Z","serviceId":6,"statementActionId":null}}]
   */
  const [selectedActions, setSelectedActions] = useState<Data[]>([]);

  const servicesLoadedCallback = (data: ServiceType[]) => {
    services.current = data;
    setActionsData(mapServiceActionsToData(services.current));
  }

  const resetAll = () => {
    access.current = defaultAccess;
    reset();
    handleLoadServicesWithServiceName(_service === 'All' ? defaultService.name : _service, servicesLoadedCallback);
    setSelectedService(_service === 'All' ? defaultService.name : _service);
  }

  useEffect(() => {
    resetAll();
  }, [open]);

  useEffect(() => {
    handleLoadServicesWithServiceName(_service === 'All' ? defaultService.name : _service, servicesLoadedCallback);
    setSelectedService(_service === 'All' ? defaultService.name : _service);
  }, []);

  useEffect(() => {
    setSelectedService(_service === 'All' ? defaultService.name : _service);
  }, [_service]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) });

  const handleDialogState = (state: boolean) => {
      setOpen(state);
  }

  const prepareCreateStatement = (data: any): StatementType | undefined => {
    if (selectedActions && selectedActions.length > 0) {
      const _service = services.current.find(service => service.name === selectedService)!;
      const _actions = selectedActions.map(action => {return {id: action.id, name: action.name}});

      return {
        id: 0,
        serviceId: _service.id,
        sid: data.sid,
        description: data.description,
        permission: access.current,
        managed: managed.current,
        actions: _actions,
        service: {
          id: _service.id,
          name: _service.name,
          actions: _service.actions,
          statements: []
        },
        policies: []
      }
    }

    return undefined;
  }

  const statementCreatedCallback = () => {
    setReload((x:any) => x+1);
  };

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    const statement = prepareCreateStatement(data);

    if  (statement) {
      handleCreateStatement(statement, statementCreatedCallback);
      handleDialogState(false);
    }
  }

  const handleChangeSelection = (selection: Row<Data>[]) => {
    setSelectedActions(selection.map((row) => row.original));
  }

  const changeAccessValue = (value: string) => {
    access.current = value;
  }

  const changeManaged = (checked: CheckedState) => {
    if (typeof checked === 'boolean') {
      managed.current = checked;
    }
  }

  const handleChangeService = (_service: string) => {
    setSelectedService(_service);
    handleLoadServicesWithServiceName(_service, servicesLoadedCallback);
  }

  const renderDialog = () => {
    if (selectedService) {
      return (
        <Dialog open={open}>
          <DialogTrigger asChild>
            <EcafeButton id="trigger" caption="Create statement" enabled={_enabled} clickHandler={handleDialogState} clickValue={true} />
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
              <form onSubmit={handleSubmit(onSubmit)} className="form">
                <div className="flex justify-between">
                  <div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-6 items-center gap-2">
                        <Label>Service</Label>
                        <div className="ml-2">
                          <ServiceSelect label="" defaultService={selectedService} handleChangeService={handleChangeService}/>
                        </div>
                      </div>

                      <div className="grid grid-cols-6 items-center gap-2">
                        <Label htmlFor="sid">SID</Label>
                        <Input
                          id="sid"
                          placeholder="sid..."
                          className="col-span-2 h-8"
                          {...register("sid")}
                        />
                      </div>
                      {errors.sid && 
                        <span className="text-red-500">{errors.sid.message}</span>
                      }

                      <div className="grid grid-cols-6 items-center gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          placeholder="description..."
                          className="col-span-3 h-8"
                          {...register("description")}
                        />
                      </div>
                      {errors.description && 
                        <span className="text-red-500">{errors.description.message}</span>
                      }

                      <div className="grid grid-cols-6 items-center mb-1 ml-[170px]">
                        <Label>Access Level</Label>
                        <AllowDenySwitch handleChangeAccess={changeAccessValue}/>
                        <Checkbox className="ml-28" id="managed" onCheckedChange={changeManaged}></Checkbox>
                        <Label className="ml-4" htmlFor="managed">Managed</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <EcafeButton id={"createButton"} caption="Create" enabled={Object.keys(errors).length === 0 && selectedActions.length > 0} type={"submit"}/>
                    <EcafeButton id={"cancelButton"} caption="Cancel" enabled className="bg-gray-400 hover:bg-gray-600" clickHandler={handleDialogState} clickValue={false}/>
                  </div>
                </div>
              </form>
            }
            <DataTable data={actionsData} columns={columns} handleChangeSelection={handleChangeSelection} initialTableState={initialTableState} Toolbar={DataTableToolbar}/>
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