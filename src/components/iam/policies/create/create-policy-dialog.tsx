'use client'

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import EcafeButton from "@/components/ecafe/ecafe-button"
import PageTitle from "@/components/ecafe/page-title";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {z} from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PolicyType, ServiceStatementType, ServiceType } from "@/data/iam-scheme";
import { all } from "@/data/constants";
import ServiceSelect from "@/components/ecafe/service-select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./table/colums";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { noValidation, validateData, ValidationType } from "@/lib/validate";
import { log } from "@/lib/utils";
import { Row } from "@tanstack/react-table";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertType, CallbackFunctionDefault, CallbackFunctionSubjectLoaded } from "@/data/types";
import { Button } from "@/components/ui/button";
import AlertMessage from "@/app/(routing)/testing/alert-message";
import { Data, mapStatementsToData } from "@/lib/mapping";

const FormSchema = z.object({
  name: z.string().min(3).max(25),
  description: z.string().min(3).max(50),
});
type FormSchemaType = z.infer<typeof FormSchema>;

const PolicyCreateDialog = ({_enabled = true, setReload}:{_enabled?: boolean; setReload?(x: any): void;}) => {

  const { toast, dismiss } = useToast()
  let toastId: string;

  const renderToast = (title: string) => {
    let {id} = toast({title: title, description: "loading ..."})
    toastId = id;
  }

  /**
   * state of the dialog
   */
  const [open, setOpen] = useState<boolean>(false);

  /**
   * created policy is valid
   */
  const [valid, setValid] = useState<ValidationType>(noValidation);

  /**
   * the selected service for getting the statements for creating the policy
   */
  const [selectedService, setSelectedService] = useState<string>();

  const [statements, setStatements] = useState<ServiceStatementType[]>([]);
  const [selectedStatements, setSelectedStatements] = useState<Row<Data>[]>([]);
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

  const showAlert = (_title: string, _message: string) => {
    const alert = {
      open: true,
      error: true,
      title: _title,
      message: _message,
      child: <Button className="bg-orange-500" size="sm" onClick={handleRemoveAlert}>close</Button>
    };
  
    setAlert(alert);
  }

  const handleValidate = (value: boolean): void => {
    let _statements: Data[] = selectedStatements.map((_statement: Row<Data>) =>  _statement.original);

    let validation: ValidationType = validateData(_statements);

    if (validation.result === "error") {
      showAlert("Validation Error", validation.message!);
    }

    setValid(validation);
  }

  const handleChangeService = (_service: string): void => {
    setSelectedService(_service);
    handleLoadStatements(_service, '*', statementsLoadedCallback);
  }

  const services = useRef<ServiceType[]>([]);

  const statementsLoadedCallback = (data: ServiceStatementType[]) => {
    setStatements(data);

    const sd: Data[] = mapStatementsToData(data, 0, services.current);
    setStatementData(mapStatementsToData(data, 0, services.current));
  }

  const servicesLoadedCallback = (data: ServiceType[]) => {
    services.current = data;
    setSelectedService(all);
    handleLoadStatements(all, '*', statementsLoadedCallback);
  }

  const loadServices = async (callback: CallbackFunctionSubjectLoaded) => {
        if (services.current.length === 0) {
          await fetch("http://localhost:3000/api/iam/services?service=*&depth=0")
            .then((response) => response.json())
            .then((response) => {
              callback(response)
            }
          );
        }
  };

  const handleLoadServices = async (callback: CallbackFunctionSubjectLoaded) => {
      await loadServices(callback);
  }

  const loadStatements = async (_serviceId: number, _sid: string, callback: CallbackFunctionSubjectLoaded) => {
    await fetch("http://localhost:3000/api/iam/statements?serviceId=" + _serviceId + "&sid=" + _sid)
      .then((response) => response.json())
      .then((response) => {
        callback(response);
      });
  }

  const handleLoadStatements = async (_service: string, _sid: string, callback: CallbackFunctionSubjectLoaded) => {
    let serviceId: number = 0;
    if (_service !== all) {
      let service = services.current.find((service) => service.name === _service);
      if (service) {
        serviceId = service.id;
      }
    }

    await loadStatements(serviceId, _sid, callback);
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

    const mapStatementsToPolicy = (_statements: Row<Data>[]): ServiceStatementType[] => {
      let res = _statements.map((_statement) => 
        {
          let id = _statement.original.id;
          return statements.find((s) => s.id === _statement.original.id)
        });

      return res as ServiceStatementType[];
    }

    const createPolicy = async (_policy: PolicyType, callback: CallbackFunctionDefault) => {
      await fetch('http://localhost:3000/api/iam/policies',
        {
          method: 'POST',
          body: JSON.stringify(_policy),
          headers: {
            'content-type': 'application/json'
          }
        }).then((response) => callback());
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

      createPolicy(policy, policyCreatedCallback);

      handleDialogState(false);
    }

    const handleChangeSelection = (selection: Row<Data>[]) => {
      setSelectedStatements(selection);
    }

  const resetAll = () => {
    reset();
    setValid(noValidation);
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
      return (<AlertMessage alert={alert}></AlertMessage>)
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
                  <EcafeButton id={"createButton"} caption="Create&nbsp;&nbsp;" enabled={Object.keys(errors).length === 0 && valid.result === "ok"} type={"submit"}/>
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

    return (<>{renderDialog()}</>
      )
}

export default PolicyCreateDialog;