import { MetaBase } from "@/data/meta";
import { FunctionDefault, NewButtonConfig } from "@/data/types";
import { useToast } from "@/hooks/use-toast";
import { cloneObject, log } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { defineActionButtons } from "../users/manage/data/util";
import { Meta } from "../users/data/meta";
import { dependency_policies } from "@/data/constants";
import { handleLoadPolicies } from "@/lib/db";
import TabItems from "./tab-items";
import { ConsoleLogger } from "@/lib/console.logger";

const debug: boolean = false;

const TabPolicies = ({_meta}:{_meta: MetaBase}) => {
  const logger = new ConsoleLogger({ level: 'debug' });

  logger.debug("TabPolicies", "IN(_meta)", JSON.stringify(_meta))

  const allPolicies = useRef<NewPolicyType[]>([]);

  const [metaOfTabPolicies, setMetaOfTabPolicies] = useState<MetaBase>();
  const actionButtons = useRef<NewButtonConfig>({})
 
   const policiesLoadedCallback = (_data: NewRoleType[], _end: FunctionDefault) => {
     logger.debug("TabPolicies", "policiesLoadedCallback", JSON.stringify(_data));
 
     allPolicies.current = _data;
 
     actionButtons.current = defineActionButtons(_meta.currentSubject as NewUserType);
 
     const newMeta: Meta = cloneObject(_meta);
     newMeta.subject.name = "Policies";
     newMeta.subject.dependency = dependency_policies;
 
     newMeta.subject.getAllDependencies = getAllPolicies;
 
     setMetaOfTabPolicies(newMeta);
 
     _end();
   }
 
   const getAllPolicies = (): NewPolicyType[] => {
     logger.debug("TabPolicies", "getAllPolicies", JSON.stringify(allPolicies.current));
 
     return allPolicies.current;
   }
 
   useEffect(() => {
     logger.debug("TabPolicies", "useEffect[]", "Loading Policies");
 
     handleLoadPolicies(() => {}, policiesLoadedCallback, () => {});
   }, [])
 
   const renderComponent = () => {
    logger.debug("TabPolicies", "RENDER")
    if (metaOfTabPolicies) {
      logger.debug("TabPolicies", "RENDER", "because meta is set");
      return (
        <TabItems _meta={metaOfTabPolicies} _buttonConfig={actionButtons.current}/>
      );
    }
  }

  return (
    <>{renderComponent()}</>
  )
}

export default TabPolicies;