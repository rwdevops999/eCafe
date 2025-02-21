'use client'

import { cloneObject } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { dependency_policies } from "@/data/constants";
import TabItems from "./tab-items";
import { ConsoleLogger } from "@/lib/console.logger";
import { ButtonConfig, GroupType, PolicyType, RoleType, UserType } from "@/types/ecafe";
import { handleLoadPolicies } from "@/lib/db";
import { MetaBase } from "@/data/meta-base";
import { defineActionButtons } from "../lib/util";
import { useDebug } from "@/hooks/use-debug";

const debug: boolean = false;

const TabPolicies = ({_meta}:{_meta: MetaBase}) => {
  const {debug} = useDebug();
  
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const allPolicies = useRef<PolicyType[]>([]);

  const [metaOfTabPolicies, setMetaOfTabPolicies] = useState<MetaBase>();
  const actionButtons = useRef<ButtonConfig>({})
 
   const policiesLoadedCallback = (_data: RoleType[]) => {
     logger.debug("TabPolicies", "policiesLoadedCallback", JSON.stringify(_data));
 
     allPolicies.current = _data;
 
     actionButtons.current = defineActionButtons(_meta.currentSubject as UserType|GroupType);
 
     const newMeta: MetaBase = cloneObject(_meta);
     newMeta.subject.name = "Policies";
     newMeta.subject.dependency = dependency_policies;
 
     newMeta.subject.getAllDependencies = getAllPolicies;
 
     setMetaOfTabPolicies(newMeta);
   }
 
   const getAllPolicies = (): PolicyType[] => {
     logger.debug("TabPolicies", "getAllPolicies", JSON.stringify(allPolicies.current));
 
     return allPolicies.current;
   }
 
   useEffect(() => {
     logger.debug("TabPolicies", "useEffect[]", "Loading Policies");
 
     handleLoadPolicies(policiesLoadedCallback);
   }, [])
 
   const renderComponent = () => {
      logger.debug("TabPolicies", "RENDER")
      logger.debug("TabPolicies", "RENDER", "because meta is set");

      return (
        <TabItems _meta={metaOfTabPolicies} _buttonConfig={actionButtons.current}/>
      );
  }

  return (<>{renderComponent()}</>);
}

export default TabPolicies;