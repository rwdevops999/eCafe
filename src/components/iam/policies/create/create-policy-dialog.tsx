'use client'

import { useEffect, useRef, useState } from "react";
import EcafeButton from "@/components/ecafe/ecafe-button"
import PageTitle from "@/components/ecafe/page-title";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {z} from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { all } from "@/data/constants";
import ServiceSelect from "@/components/ecafe/service-select";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./table/colums";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { log } from "@/lib/utils";
import { Row } from "@tanstack/react-table";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTableType, AlertType } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Data, mapStatementsToData } from "@/lib/mapping";
import { createPolicy, handleLoadServices, handleLoadStatements } from "@/lib/db";
import AlertTable from "@/components/ecafe/alert-table";
import { alertcolumns } from "@/components/ecafe/table/alert-columns";
import { validateMappedData } from "@/lib/validate";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const FormSchema = z.object({
  name: z.string().min(3).max(25),
  description: z.string().min(3).max(50),
});
type FormSchemaType = z.infer<typeof FormSchema>;

const PolicyCreateDialog = ({_enabled = true, setReload}:{_enabled?: boolean; setReload?(x: any): void;}) => {
  /**
   * state of the dialog
   */
  const [open, setOpen] = useState<boolean>(false);

  /**
   * created policy is valid
   */
  const [valid, setValid] = useState<boolean>(false);

  /**
   * the selected service for getting the statements for creating the policy
   */
  const [selectedService, setSelectedService] = useState<string>();

  const [statements, setStatements] = useState<NewStatementType[]>([]);
  const [selectedStatements, setSelectedStatements] = useState<Data[]>([]);
  const [statementData, setStatementData] = useState<Data[]>([]);
  /**
   * managed (true or false)
   */
  const managed = useRef<boolean>(false);

  const [alert, setAlert] = useState<AlertType>();
  
  const handleDialogState = (state: boolean) => {
    setOpen(state);
  }

  const handleRemoveAlert = () => {
    setAlert(undefined);
  }

  const showAlert = (_title: string, _message: string, data: Data[]) => {
    const alert: AlertTableType = {
      open: true,
      error: true,
      title: _title,
      message: _message,
      table: <DataTable data={data} columns={alertcolumns}/>,
      child: <Button className="bg-orange-400 hover:bg-orange-600" size="sm" onClick={handleRemoveAlert}>close</Button>
    };
  
    setAlert(alert);
  }

  const handleValidate = (value: boolean): void => {
    let conflicts: Data[] = validateMappedData(selectedStatements);

    if (conflicts.length > 0) {
      showAlert("Validation Error", "Conflicts", conflicts);
    }

    setValid(conflicts.length === 0);
  }

  const prepareStatementsLoad = (_service: number | string, _sid: string): number => {
    let serviceId: number = 0;

    if (_service !== all) {
      let service = services.current.find((service) => service.name === _service);
      if (service) {
        serviceId = service.id;
      }
    }

    return serviceId;
  }

  const handleChangeService = (_service: string): void => {
    setSelectedService(_service);
    
    const serviceId = prepareStatementsLoad(_service, '*');
    handleLoadStatements(serviceId, '*', statementsLoadedCallback);
  }

  const services = useRef<NewServiceType[]>([]);

  const statementsLoadedCallback = (data: NewStatementType[]) => {
    setStatements(data);

    const sd: Data[] = mapStatementsToData(data, services.current);
    setStatementData(sd);
  }

  const servicesLoadedCallback = (data: NewServiceType[]) => {
    services.current = data;
    setSelectedService(all);
    const serviceId = prepareStatementsLoad(all, '*');
    handleLoadStatements(serviceId, '*', statementsLoadedCallback);
  }

  useEffect(() => {
    handleLoadServices(servicesLoadedCallback);
  }, []);

  const {
      register,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) });

    const mapStatementsToPolicy = (_statements: Data[]): NewStatementType[] => {
      let res = _statements.map((_statement) => 
        {
          return statements.find((s) => s.id === _statement.id)
        });

      return res as NewStatementType[];
    }

    const prepareCreatePolicy = (data: FormSchemaType): NewPolicyType => {
      return {
        id: 0,
        name: data.name,
        description: data.description,
        managed: managed.current,
        statements: mapStatementsToPolicy(selectedStatements),
        roles: []
      }
    }

    const policyCreatedCallback = () => {
      if (setReload) {
        setReload((x: any) => x+1);
      }
    }

    const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
      const policy = prepareCreatePolicy(data);

      createPolicy(policy, policyCreatedCallback);

      handleDialogState(false);
    }

    const handleChangeSelection = (selection: Row<Data>[]) => {
      setSelectedStatements(selection.map((row) => row.original));
    }

  const resetAll = () => {
    reset();
    setValid(false);
  }

  useEffect(() => {
    resetAll();
  }, [open]);

  const changeManaged = (checked: CheckedState) => {
    if (typeof checked === 'boolean') {
      managed.current = checked;
    }
  }

  const renderDialog = () => {
    if (alert && alert.open) {
      return (<AlertTable alert={alert}></AlertTable>)
    }

      return (
        <Dialog open={open}>
          <DialogTrigger asChild>
            <EcafeButton className="bg-orange-400 hover:bg-orange-600 mr-3" caption="Create policy" clickHandler={handleDialogState} clickValue={true} enabled={_enabled}/>
          </DialogTrigger>
          <DialogContent className="min-w-[75%]" aria-describedby="">
            <DialogHeader className="mb-2">
              <DialogTitle>
                <PageTitle title="Create policy" className="m-2 -ml-[2px]"/>
                <Separator className="bg-red-500"/>
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
              <div className="flex justify-between">
                <div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-6 items-center gap-2 mb-2" >
                      <Label>Service</Label>
                      <div className="ml-2">
                        <ServiceSelect label="" defaultService={selectedService?selectedService:all} handleChangeService={handleChangeService}/>
                      </div>
                    </div>
                  </div>
                <div className="grid gap-2">
                    <div className="grid grid-cols-6 items-center gap-2 mb-2" >
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="name..."
                        className="col-span-2 h-8"
                        {...register("name")}
                      />
                    </div>
                    {errors.name && 
                      <span className="text-red-500">{errors.name.message}</span>
                    }
                  </div>

                  <div className="grid gap-2">
                    <div className="grid grid-cols-6 items-center gap-2 mb-2">
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
                  </div>

                  <div className="grid gap-2">
                    <div className="grid grid-cols-6 items-center gap-2 mt-2 mb-2">
                      <Label htmlFor="managed">Managed</Label>
                      <Checkbox id="managed" onCheckedChange={changeManaged}></Checkbox>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <EcafeButton id={"validateButton"} caption="Validate" className="bg-blue-500 hover:bg-blue-600" clickHandler={handleValidate} enabled={selectedStatements.length > 0}/>
                  <EcafeButton id={"createButton"} caption="Create&nbsp;&nbsp;" enabled={Object.keys(errors).length === 0 && valid} type={"submit"}/>
                  <EcafeButton id={"cancelButton"} caption="Cancel&nbsp;&nbsp;" enabled className="bg-gray-400 hover:bg-gray-600" clickHandler={handleDialogState} clickValue={false}/>
                </div>
              </div>
            </form>
            <DataTable 
              data={statementData} 
              columns={columns} 
              rowSelecting={false} 
              Toolbar={DataTableToolbar}
              handleChangeSelection={handleChangeSelection} />
          </DialogContent>
        </Dialog>
      );
    }

    return (<>{renderDialog()}</>)
}

export default PolicyCreateDialog;