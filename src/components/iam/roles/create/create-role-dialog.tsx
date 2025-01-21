'use client'

import EcafeButton from "@/components/ecafe/ecafe-button";
import PageTitle from "@/components/ecafe/page-title";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertType, CallbackFunctionDefault, CallbackFunctionSubjectLoaded } from "@/data/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Separator } from "@radix-ui/react-separator";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./table/colums";
import { Row } from "@tanstack/react-table";
import { getPolicyStatements, noValidation, validateData, ValidationType } from "@/lib/validate";
import { log } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import AlertMessage from "@/app/(routing)/testing/alert-message";
import { Data, mapPoliciesToData } from "@/lib/mapping";
import { PolicyType, RoleType } from "@/data/iam-scheme";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { createRole, handleLoadPolicies } from "@/lib/db";

const FormSchema = z.object({
  name: z.string().min(3).max(25),
  description: z.string().min(3).max(50),
});
type FormSchemaType = z.infer<typeof FormSchema>;

const RoleCreateDialog = ({_enabled = true, setReload}:{_enabled?: boolean; setReload?(x: any): void;}) => {
  const { toast, dismiss } = useToast();
  let toastId: string;

  const renderToast = (title: string) => {
    let {id} = toast({title: title, description: "loading ..."})
    toastId = id;
  }

  /**
   * state of the dialog
   */
  const [open, setOpen] = useState<boolean>(false);

  const managed = useRef<boolean>(false);
  const [valid, setValid] = useState<ValidationType>(noValidation);
  const [alert, setAlert] = useState<AlertType>();

  const [policies, setPolicies] = useState<PolicyType[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<Row<Data>[]>([]);
  const [policyData, setPolicyData] = useState<Data[]>([]);
    
  const handleDialogState = (state: boolean) => {
    setOpen(state);
  }

  const policiesLoadedCallback = (data: PolicyType[]) => {
    dismiss(toastId);
    setPolicies(data);
    const mappedPolicies: Data[] = mapPoliciesToData(data, 3);
    setPolicyData(mappedPolicies);
  }

  useEffect(() => {
    if (open) {
      resetAll();
      renderToast("Loading policies");
      handleLoadPolicies(policiesLoadedCallback);
    }
  }, [open]);

  const resetAll = () => {
    reset();
    setValid(noValidation);
    managed.current = false;
  }

  const {
      register,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) });

    const mapPoliciesToRole = (_policies: Row<Data>[]): PolicyType[] => {
      let res = _policies.map((_policy) => 
        {
          let id = _policy.original.id;
          return policies.find((p) => p.id === _policy.original.id)
        });

      return res as PolicyType[];
    }

  const prepareCreateRole = (data: FormSchemaType): RoleType => {
    let prep: Row<Data>[] = selectedPolicies.flatMap((policy) => {
      return (policy.depth === 0 ? policy : []);
      }
    ) as Row<Data>[];

    return {
      id: 0,
      name: data.name,
      description: data.description,
      managed: managed.current,
      policies: mapPoliciesToRole(prep),
    }
  }

  const roleCreatedCallback = () => {
    if (setReload) {
      setReload((x: any) => x+1);
    }
  }

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    const role = prepareCreateRole(data);

    createRole(role, roleCreatedCallback);

    handleDialogState(false);
  }

  const changeManaged = (checked: CheckedState) => {
    if (typeof checked === 'boolean') {
      managed.current = checked;
    }
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

  const handleValidate = (_value: boolean): void => {
    const policyStatements: Data[] = getPolicyStatements(selectedPolicies);
    
    let validationResult: ValidationType = validateData(policyStatements);

    if (validationResult.result === "error") {
      showAlert("Validation Error", validationResult.message!);
    }

    setValid(validationResult);
  }

  const handleChangeSelection = (selection: Row<Data>[]) => {
      setSelectedPolicies(selection);
  }

  const renderDialog = () => {
      if (alert && alert.open) {
        return (<AlertMessage alert={alert}></AlertMessage>)
      }

      return (
        <Dialog open={open}>
          <DialogTrigger asChild>
            <EcafeButton className="bg-orange-400 hover:bg-orange-600 mr-3" caption="Create role" clickHandler={handleDialogState} clickValue={true} enabled={_enabled}/>
          </DialogTrigger>
          <DialogContent className="min-w-[75%]" aria-describedby="">
            <DialogHeader className="mb-2">
              <DialogTitle>
                <PageTitle title="Create role" className="m-2 -ml-[2px]"/>
                <Separator className="bg-red-500"/>
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
              <div className="flex justify-between">
                <div>
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
                        className="col-span-5 h-8"
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
                  <EcafeButton id={"validateButton"} caption="Validate" className="bg-blue-500 hover:bg-blue-600" clickHandler={handleValidate} enabled={selectedPolicies.length > 0}/>
                  <EcafeButton id={"createButton"} caption="Create&nbsp;&nbsp;" enabled={Object.keys(errors).length === 0 && valid.result === "ok"} type={"submit"}/>
                  <EcafeButton id={"cancelButton"} caption="Cancel&nbsp;&nbsp;" enabled className="bg-gray-400 hover:bg-gray-600" clickHandler={handleDialogState} clickValue={false}/>
                </div>
              </div>
            </form>
            <DataTable 
              data={policyData} 
              columns={columns} 
              rowSelecting={false} 
              handleChangeSelection={handleChangeSelection}
              Toolbar={DataTableToolbar}
              />
          </DialogContent>
        </Dialog>
      );
    }

    return (<>{renderDialog()}</>
    )
}

export default RoleCreateDialog;