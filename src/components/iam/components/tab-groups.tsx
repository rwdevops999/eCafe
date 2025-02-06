import { MetaBase } from "@/data/meta";
import { FunctionDefault, NewButtonConfig } from "@/data/types";
import { useToast } from "@/hooks/use-toast";
import { cloneObject, log } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { defineActionButtons, userCreated } from "../users/manage/data/util";
import { Meta } from "../users/data/meta";
import { dependency_groups } from "@/data/constants";
import { handleLoadGroups } from "@/lib/db";
import TabItems from "./tab-items";
import { ConsoleLogger } from "@/lib/console.logger";

const TabGroups = ({_meta}:{_meta: MetaBase}) => {
  const logger = new ConsoleLogger({ level: 'debug' });

  logger.debug("TabGroups", "IN(_meta)", JSON.stringify(_meta))

  const allGroups = useRef<NewGroupType[]>([]);

  const [metaOfTabGroups, setMetaOfTabGroups] = useState<MetaBase>();
  const actionButtons = useRef<NewButtonConfig>({})

  const groupsLoadedCallback = (_data: NewRoleType[], _end: FunctionDefault) => {
    logger.debug("TabGroups", "groupsLoadedCallback", JSON.stringify(_data));
   
    allGroups.current = _data;
   
    actionButtons.current = defineActionButtons(_meta.currentSubject as NewUserType);
   
    const newMeta: Meta = cloneObject(_meta);
    newMeta.subject.name = "Groups";
    newMeta.subject.dependency = dependency_groups;
   
    newMeta.subject.getAllDependencies = getAllGroups;
   
    setMetaOfTabGroups(newMeta);
   
    _end();
  }
  
   const getAllGroups = (): NewGroupType[] => {
     logger.debug("TabGroups", "getAllGroups", JSON.stringify(allGroups.current));
 
     return allGroups.current;
   }
 
   useEffect(() => {
     logger.debug("TabGroups", "useEffect[]", "Loading Groups");
 
     handleLoadGroups(() => {}, groupsLoadedCallback, () => {});
   }, [])
 
  const renderComponent = () => {
    if (metaOfTabGroups) {
      return (
        <TabItems _meta={metaOfTabGroups} _buttonConfig={actionButtons.current}/>
      );
    }
  }

  return (
    <>{renderComponent()}</>
  )
}

export default TabGroups;