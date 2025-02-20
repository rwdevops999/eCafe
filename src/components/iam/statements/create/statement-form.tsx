'use client'

import { useEffect, useMemo, useState } from 'react'
import { StatementEntity } from './data/model';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDebug } from '@/hooks/use-debug';
import { ConsoleLogger } from '@/lib/console.logger';
import ServiceSelect from '@/components/ecafe/service-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AllowDenySwitch from '@/components/ecafe/allow-deny-switch';
import { cloneObject, js, showToast } from '@/lib/utils';
import EcafeButton from '@/components/ecafe/ecafe-button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { ServiceType } from '@/types/ecafe';
import { defaultAccess } from '@/data/constants';

export interface FormProps {
  statement: StatementEntity;

  cancelFn: (b: boolean, resetService: boolean) => void
  submitFn: (e: StatementEntity) => void
  serviceFn: (service: ServiceType|undefined) => void
  enabledButton: boolean,
}

const StatementForm = (props: FormProps) => {
  const {debug} = useDebug();
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const formMethods = useForm({
    defaultValues: useMemo(() => {
      return props.statement;
    }, [props])
  });

  console.log("[SF]", "IN(statement)", js(props.statement));

  const {reset, handleSubmit, register, formState: {errors}, setValue, getValues} = formMethods;

  useEffect(() => {
    console.log("SF MOUNTED");

    return () => console.log("SF UNMOUNTED");
  }, []);

  const [managed, setManaged] = useState<boolean>(false);
  const [access, setAccess] = useState<string>(defaultAccess);

  useEffect(() => {
    // let newEntity: StatementEntity = {
    //   sid: "SID",
    //   serviceId: undefined,
    //   statementId: undefined,
    //   description: "DESCR",
    //   access: "Deny",
    //   managed: false
    // }

    setManaged(props.statement.managed);
    setAccess(props.statement.access);
    reset(props.statement);

  }, [props]);

  const changeAccessValue = (value: string) => {
    setAccess(value);
    setValue("access", value);
  }

  const changeManaged = (checked: CheckedState) => {
    if (typeof checked === 'boolean') {
      setValue("managed", checked);
      setManaged(checked);
    }
  }

  const handleChangeService = (_service: ServiceType|undefined) => {
    props.serviceFn(_service);
  }

  const onSubmit: SubmitHandler<StatementEntity> = (formData: StatementEntity) => {
    props.submitFn(formData);
  }

  const cancelForm = (_dummy: boolean): void => {
    props.cancelFn(false, false);
  }

  const renderComponent = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="flex justify-between">
          <div>
            <div className="grid gap-2">
              <div className="grid grid-cols-6 items-center gap-2">
                <Label>Service</Label>
                <div className="ml-2">
                  <ServiceSelect label="" defaultService={props.statement.serviceIdentifier} handleChangeService={handleChangeService} />
                </div>
              </div>
  
              <div className="grid grid-cols-6 items-center gap-2">
                <Label htmlFor="sid">SID</Label>
                <Input
                  id="sid"
                  placeholder="sid..."
                  className="col-span-2 h-8"
                  disabled={! props.enabledButton}
                  {...register("sid", 
                      {
                        required: {value: true, message: "Sid is required"},
                        minLength: {value: 3, message: "Sid must be a least 3 characters"},
                        maxLength: {value: 25, message: "Sid may not be longer than 25 characters"}
                      }
                  )}
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
                   disabled={! props.enabledButton}
                   {...register("description",
                     {
                       required: {value: true, message: "Description is required"},
                       minLength: {value: 3, message: "Description must be a least 3 characters"},
                       maxLength: {value: 25, message: "Description may not be longer than 25 characters"}
                     }
                   )}
                 />
               </div>
               {errors.description && 
                 <span className="text-red-500">{errors.description.message}</span>
               }
  
               <div className="grid grid-cols-6 items-center mb-1 ml-[170px]">
                 <Label>Access Level</Label>
                 <AllowDenySwitch accessFn={changeAccessValue} value={access}/>
                 <Checkbox checked={managed} className="ml-28" id="managed" onCheckedChange={changeManaged}></Checkbox>
                 <Label className="ml-4" htmlFor="managed">Managed</Label>
               </div>
  
            </div>
          </div> 
          <div className="space-y-1">
            {(props.statement.sid === "") && <EcafeButton id={"createButton"} caption="Create" type={"submit"} enabled={props.enabledButton} />}
            {(! (props.statement.sid === "")) && <EcafeButton id={"updateButton"} caption="Update" type={"submit"} enabled={props.enabledButton} />}
            <EcafeButton id={"cancelButton"} caption="Cancel" enabled className="bg-gray-400 hover:bg-gray-600" clickHandler={cancelForm} clickValue={false}/>
            {/* <EcafeButton id={"createButton"} caption="Create" enabled={Object.keys(errors).length === 0 && props.enabledOkButton} type={"submit"}/>
            <EcafeButton id={"cancelButton"} caption="Cancel" enabled className="bg-gray-400 hover:bg-gray-600" clickHandler={props.cancelFn} clickValue={false}/> */}
          </div>
        </div>
      </form>
    )
  }

  return (<>{renderComponent()}</>)
}

export default StatementForm;