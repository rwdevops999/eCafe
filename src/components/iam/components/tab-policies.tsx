'use client'

import { cloneObject, js } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { dependency_policies } from "@/data/constants";
import TabItems from "./tab-items";
import { ConsoleLogger } from "@/lib/console.logger";
import { ButtonConfig, GroupType, PolicyType, RoleType, UserType } from "@/types/ecafe";
import { handleLoadPolicies } from "@/lib/db";
import { MetaBase } from "@/data/meta-base";
import { defineActionButtons } from "../lib/util";
import { useDebug } from "@/hooks/use-debug";
import { ApiResponseType } from "@/types/db";

const debug: boolean = false;

const TabPolicies = ({_meta}:{_meta: MetaBase}) => {
  const {debug} = useDebug();
  
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const allPolicies = useRef<PolicyType[]>([]);

  const [metaOfTabPolicies, setMetaOfTabPolicies] = useState<MetaBase>();
  const actionButtons = useRef<ButtonConfig>({})
 
  const policiesLoadedCallback = (_data: ApiResponseType) => {
    if (_data.status === 200) {
 
     allPolicies.current = _data.payload;
 
     actionButtons.current = defineActionButtons(_meta.currentSubject as UserType|GroupType);
 
     const newMeta: MetaBase = cloneObject(_meta);
     newMeta.subject.name = "Policies";
     newMeta.subject.dependency = dependency_policies;
 
     newMeta.subject.getAllDependencies = getAllPolicies;
 
     setMetaOfTabPolicies(newMeta);
    }
  }
 
   const getAllPolicies = (): PolicyType[] => {
     return allPolicies.current;
   }
 
   useEffect(() => {
     handleLoadPolicies(policiesLoadedCallback);
   }, [])
 
   const renderComponent = () => {
      return (
        <TabItems _meta={metaOfTabPolicies} _buttonConfig={actionButtons.current}/>
      );
  }

  return (<>{renderComponent()}</>);
}

export default TabPolicies;