import { cloneObject } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { defineActionButtons } from "../users/manage/data/util";
import { Meta } from "../users/data/meta";
import { dependency_policies } from "@/data/constants";
import TabItems from "./tab-items";
import { ConsoleLogger } from "@/lib/console.logger";
import { ButtonConfig, PolicyType, RoleType, UserType } from "@/types/ecafe";

const debug: boolean = false;

const TabPolicies = ({_meta}:{_meta: MetaBase}) => {
  const logger = new ConsoleLogger({ level: 'debug' });

  const allPolicies = useRef<PolicyType[]>([]);

  const [metaOfTabPolicies, setMetaOfTabPolicies] = useState<MetaBase>();
  const actionButtons = useRef<ButtonConfig>({})
 
   const policiesLoadedCallback = (_data: RoleType[]) => {
     logger.debug("TabPolicies", "policiesLoadedCallback", JSON.stringify(_data));
 
     allPolicies.current = _data;
 
     actionButtons.current = defineActionButtons(_meta.currentSubject as UserType);
 
     const newMeta: Meta = cloneObject(_meta);
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