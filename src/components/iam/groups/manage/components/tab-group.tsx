'use client'

import { useForm, UseFormReturn } from "react-hook-form";
import { ConsoleLogger } from "@/lib/console.logger";
import { useEffect, useRef, useState } from "react";
import { FormSchema, FormSchemaType } from "./data/form-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import PageTitle from "@/components/ecafe/page-title";
import { Separator } from "@radix-ui/react-separator";
import ActionButtons from "@/components/iam/components/action-buttons";
import GroupSection from "./group-section";
import { Meta } from "../../meta/meta";
import { ButtonConfig, GroupType } from "@/types/ecafe";
import { defineActionButtons } from "@/components/iam/lib/util";
import { storeGroupFormValues } from "./data/util";
import { useDebug } from "@/hooks/use-debug";

const TabGroup = ({_meta, onTabLeave, setFormMethods}:{_meta: Meta; onTabLeave: boolean; setFormMethods(methods: UseFormReturn<any>): void;}) => {
  const {debug} = useDebug();
  
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  // logger.debug("TabUsers", "IN(_meta)", JSON.stringify(_meta))
  logger.debug("TabGroups", "IN(onTabLeave)", onTabLeave);

  const storedGroupRef = useRef<GroupType|undefined>(undefined);

  let group: GroupType|undefined = _meta.currentSubject as GroupType;
  
  if (storedGroupRef.current) {
    logger.debug("TabGroups", "IN(storedGroupRef)", "Using Stored Values");
    group = storedGroupRef.current;
  }

  logger.debug("TabGroups", "IN(group)", JSON.stringify(group));

  const formMethods = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
     name: "",
    },
    values: {
      name: group?.name??"",
      description: group?.description ?? "",
    },
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: true
    }
  });

  const actionButtons = useRef<ButtonConfig>({})

  const [nrOfItemsToValidate, setNrOfItemsToValidate] = useState<number>(0);

  useEffect(() => {
    logger.debug("TabGroup", "useEffect[]", JSON.stringify(_meta.currentSubject));

    actionButtons.current = defineActionButtons(_meta.currentSubject as GroupType)
    setFormMethods(formMethods);

    const itemsToValidate: number = _meta.control.calculateValidationItems();
    logger.debug("TabGroups", "ItemsToValidate", itemsToValidate);
    setNrOfItemsToValidate(itemsToValidate);
  }, []);

  const {handleSubmit, getValues} = formMethods;

  useEffect(() => {
    if (onTabLeave) {
      const _group: GroupType = storeGroupFormValues(_meta.currentSubject as GroupType, getValues);
      logger.debug("TabGroup", "LeavingTab => STORE GROUP", JSON.stringify(_group));

      storedGroupRef.current = _group;
    }
  }, [onTabLeave]);

  const onSubmit = async (data: any) => {
    logger.debug("TabGroups", "onSubmit", "SUBMITTING...");
  };

  const renderComponent = () => {
    logger.debug("TabGroups", "RENDER");
    return (
      <>
        <PageTitle className="m-2" title={`Group Details`} />
        <Separator />
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12">
            <div className="col-span-11 space-y-1">
              <GroupSection formMethods={formMethods}/>
            </div>
            <div className="ml-5 col-span-1">
              <ActionButtons buttonConfig={actionButtons.current} meta={_meta} nrOfItemsToValidate={nrOfItemsToValidate} />
            </div>
          </div>
        </form>
      </>
    );
  }

  return (<>{renderComponent()}</>);
}

export default TabGroup;