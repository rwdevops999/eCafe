'use client'

import EcafeButton from "@/components/ecafe/ecafe-button";
import PageTitle from "@/components/ecafe/page-title";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./table/colums";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { alertcolumns } from "@/components/ecafe/table/alert-columns";
import AlertTable from "@/components/ecafe/alert-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTableType, AlertType, Data, PolicyType, RoleType } from "@/types/ecafe";
import { mapPoliciesToData } from "@/lib/mapping";
import { handleCreateRole, handleLoadPolicies } from "@/lib/db";
import { validateMappedData } from "@/lib/validate";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import { Separator } from "@/components/ui/separator";

const FormSchema = z.object({
  name: z.string().min(3).max(25),
  description: z.string().min(3).max(50),
});
type FormSchemaType = z.infer<typeof FormSchema>;

const RoleCreateDialog = ({_enabled = true, setReload}:{_enabled?: boolean; setReload?(x: any): void;}) => {
  const [loader, setLoader] = useState<boolean>(false);

  /**
   * state of the dialog
   */
  const [open, setOpen] = useState<boolean>(false);

  const managed = useRef<boolean>(false);
  const [valid, setValid] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertType>();

  const [policies, setPolicies] = useState<PolicyType[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<Data[]>([]);
  const [policyData, setPolicyData] = useState<Data[]>([]);
    
  const handleDialogState = (state: boolean) => {
    setOpen(state);
  }

  const policiesLoadedCallback = (policies: PolicyType[]) => {
    setPolicies(policies);
    const mappedPolicies: Data[] = mapPoliciesToData(policies);
    setPolicyData(mappedPolicies);
    setLoader(false);
  }

  useEffect(() => {
    if (open) {
      resetAll();
      setLoader(true);
      handleLoadPolicies(policiesLoadedCallback);
    }
  }, [open]);

  const resetAll = () => {
    reset();
    setValid(false);
    managed.current = false;
  }

  const {
      register,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) });

    const mapPoliciesToRole = (_policies: Data[]): PolicyType[] => {
      let res = _policies.map((_policy) => {return policies.find((p) => p.id === _policy.id)});

      return res as PolicyType[];
    }

  const prepareCreateRole = (data: FormSchemaType): RoleType => {
    return {
      id: 0,
      name: data.name,
      description: data.description,
      managed: managed.current,
      policies: mapPoliciesToRole(selectedPolicies),
    }
  }

  const roleCreatedCallback = () => {
    if (setReload) {
      setReload((x: any) => x+1);
    }
  }

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    const role = prepareCreateRole(data);

    handleCreateRole(role, roleCreatedCallback);

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

  const handleValidate = (_value: boolean): void => {
    let conflicts: Data[] = validateMappedData(selectedPolicies);
    
      if (conflicts.length > 0) {
        showAlert("Validation Error", "Conflicts", conflicts);
      }
    
      setValid(conflicts.length === 0);
  }

  const handleChangeSelection = (selection: Row<Data>[]) => {
      setSelectedPolicies(selection.map((row) => row.original));
  }

  const renderDialog = () => {
    if (alert && alert.open) {
      return (<AlertTable alert={alert}></AlertTable>)
    }

      return (
        <Dialog open={open}>
          <DialogTrigger asChild>
            <EcafeButton className="bg-orange-400 hover:bg-orange-600 mr-3" caption="Create role" clickHandler={handleDialogState} clickValue={true} enabled={_enabled}/>
          </DialogTrigger>
          <DialogContent className="min-w-[75%]" aria-describedby="">
            <DialogHeader className="mb-2">
              <DialogTitle>
                <div className="flex space-x-2 items-center">
                  <PageTitle title="Create role" className="m-2 -ml-[2px]"/>
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
                    <EcafeButton id={"createButton"} caption="Create&nbsp;&nbsp;" enabled={Object.keys(errors).length === 0 && valid} type={"submit"}/>
                    <EcafeButton id={"cancelButton"} caption="Cancel&nbsp;&nbsp;" enabled className="bg-gray-400 hover:bg-gray-600" clickHandler={handleDialogState} clickValue={false}/>
                  </div>
                </div>
              </form>
            }

            {policyData &&
              <DataTable 
                data={policyData} 
                columns={columns} 
                rowSelecting={false} 
                handleChangeSelection={handleChangeSelection}
                Toolbar={DataTableToolbar}
                />
            }
          </DialogContent>
        </Dialog>
      );
    }

    return (<>{renderDialog()}</>);
}

export default RoleCreateDialog;