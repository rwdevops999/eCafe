'use client'

import { useEffect, useRef, useState } from "react";
import EcafeButton from "@/components/ecafe/ecafe-button"
import PageTitle from "@/components/ecafe/page-title";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {z} from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ServiceSelect from "@/components/ecafe/service-select";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./table/colums";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import AlertTable from "@/components/ecafe/alert-table";
import { alertcolumns } from "@/components/ecafe/table/alert-columns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTableType, AlertType, Data, PolicyType, ServiceType, StatementType } from "@/types/ecafe";
import { allItems } from "@/data/constants";
import { mapStatementsToData, mapStatementToDataArray } from "@/lib/mapping";
import { CheckedState } from "@radix-ui/react-checkbox";
import { handleCreatePolicy, handleLoadServices, handleLoadStatements } from "@/lib/db";
import { validateMappedData } from "@/lib/validate";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import { ApiResponseType } from "@/types/db";

const FormSchema = z.object({
  name: z.string().min(3).max(25),
  description: z.string().min(3).max(50),
});
type FormSchemaType = z.infer<typeof FormSchema>;

const PolicyCreateDialog = ({_enabled = true, setReload}:{_enabled?: boolean; setReload?(x: any): void;}) => {
  const [loader, setLoader] = useState<boolean>(false);

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

  const [statements, setStatements] = useState<StatementType[]>([]);
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

    if (_service !== allItems) {
      let service = services.current.find((service) => service.name === _service);
      if (service) {
        serviceId = service.id;
      }
    }

    return serviceId;
  }

  const handleChangeService = (_service: string): void => {
    setLoader(true);
    setSelectedService(_service);
    
    const serviceId = prepareStatementsLoad(_service, '*');
    handleLoadStatements(serviceId, '*', statementsLoadedCallback);
  }

  const services = useRef<ServiceType[]>([]);

  const statementsLoadedCallback = (data: ApiResponseType) => {
    if (data.status === 200) {
        const statements: StatementType[] = data.payload;

        setStatements(statements);

        setStatementData(mapStatementsToData(statements, services.current));
    }
    
    setLoader(false);
  }

  const servicesLoadedCallback = (data: ApiResponseType): void => {
    if (data.status === 200) {
      services.current = data.payload;
      setSelectedService(allItems);
      const serviceId = prepareStatementsLoad(allItems, allItems);
      handleLoadStatements(serviceId, '*', statementsLoadedCallback);
    }
  }

  useEffect(() => {
    setLoader(true);
    handleLoadServices(servicesLoadedCallback);
  }, []);

  const {
      register,
      handleSubmit,
      formState: { errors },
      reset
  } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) });

  const mapStatementsToPolicy = (_statements: Data[]): StatementType[] => {
    let res = _statements.map((_statement) => {return statements.find((s) => s.id === _statement.id)});

    return res as StatementType[];
  }

  const prepareCreatePolicy = (data: FormSchemaType): PolicyType => {
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

    handleCreatePolicy(policy, policyCreatedCallback);

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
              <div className="flex space-x-2 items-center">
                <PageTitle title="Create policy" className="m-2 -ml-[2px]"/>
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
                    <div className="grid grid-cols-6 items-center gap-2 mb-2" >
                      <Label>Service</Label>
                      <div className="ml-2">
                        <ServiceSelect label="" defaultService={selectedService??allItems} handleChangeService={handleChangeService}/>
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
          }
          {statementData &&
            <DataTable 
              data={statementData} 
              columns={columns} 
              rowSelecting={false} 
              Toolbar={DataTableToolbar}
              handleChangeSelection={handleChangeSelection} />
          }
        </DialogContent>
      </Dialog>
    );
  }

  return (<>{renderDialog()}</>)
}

export default PolicyCreateDialog;