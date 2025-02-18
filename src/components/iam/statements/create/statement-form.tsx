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

export interface FormProps {
  statement: StatementEntity;

  cancelFn: (b: boolean) => void
  submitFn: (data: any) => void
  serviceChangeFn: (service: string) => void
  enabledOkButton: boolean,
}

const StatementForm = (props: FormProps) => {
  const {debug} = useDebug();
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  console.log("SF", "IN", js(props.statement));

  const formMethods = useForm({
    defaultValues: useMemo(() => {
      logger.debug("SF", "statement has changed");
      return props.statement;
    }, [props])
  });

  const {reset, handleSubmit, register, formState: {errors}, setValue} = formMethods;

  useEffect(() => {
    console.log("SF", "useEffect[props.statement]", "Reset", js(props.statement));
    reset(props.statement);

  }, [props.statement]);

  const changeAccessValue = (value: string) => {
    logger.debug("StatementForm", "Access value changed", value);
    setValue("access", value);
  }

  const changeManaged = (checked: CheckedState) => {
    if (typeof checked === 'boolean') {
      logger.debug("StatementForm", "managed changed", checked);
      setValue("managed", checked);
    }
  }

  const handleChangeService = (_service: string) => {
    logger.debug("StatementForm", "handleChangeService", _service);

    props.serviceChangeFn(_service);
    // let _entity: StatementEntity = cloneObject(props.statement);

    // _entity.serviceName = _service;

    // props.statement = _entity;
  }

  const onSubmit: SubmitHandler<StatementEntity> = (formData: StatementEntity) => {
    logger.debug("CreateStatementDialog", "Submit(formData)", js(formData));
    console.log("SF", "Submit");
    props.submitFn(formData);
  }

  const renderComponent = () => {
    console.log("SF", "RENDER");
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="flex justify-between">
          <div>
            <div className="grid gap-2">
              <div className="grid grid-cols-6 items-center gap-2">
                <Label>Service</Label>
                <div className="ml-2">
                    <ServiceSelect label="" defaultService={props.statement.serviceName!} handleChangeService={handleChangeService}/>
                </div>
              </div>
  
              <div className="grid grid-cols-6 items-center gap-2">
                <Label htmlFor="sid">SID</Label>
                <Input
                    id="sid"
                    placeholder="sid..."
                    className="col-span-2 h-8"
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
                <AllowDenySwitch handleChangeAccess={changeAccessValue}/>
                <Checkbox className="ml-28" id="managed" onCheckedChange={changeManaged}></Checkbox>
                <Label className="ml-4" htmlFor="managed">Managed</Label>
              </div>
  
            </div>
          </div> 
          <div className="space-y-1">
          <EcafeButton id={"createButton"} caption="Create" enabled={Object.keys(errors).length === 0 && props.enabledOkButton} type={"submit"}/>
          <EcafeButton id={"cancelButton"} caption="Cancel" enabled className="bg-gray-400 hover:bg-gray-600" clickHandler={props.cancelFn} clickValue={false}/>
          </div>
        </div>
      </form>
    )
  }

  return (<>{renderComponent()}</>)
}

export default StatementForm;