'use client'

import { useEffect, useRef, useState } from "react";
import { dependency_groups } from "@/data/constants";
import TabItems from "./tab-items";
import { ConsoleLogger } from "@/lib/console.logger";
import { ButtonConfig, GroupType, UserType } from "@/types/ecafe";
import { cloneObject } from "@/lib/utils";
import { handleLoadGroups } from "@/lib/db";
import { MetaBase } from "@/data/meta-base";
import { defineActionButtons } from "../lib/util";
import { Meta } from "../users/meta/meta";
import { useDebug } from "@/hooks/use-debug";

const TabGroups = ({_meta}:{_meta: MetaBase}) => {
  const {debug} = useDebug();
  
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const allGroups = useRef<GroupType[]>([]);

  const [metaOfTabGroups, setMetaOfTabGroups] = useState<MetaBase>();
  const actionButtons = useRef<ButtonConfig>({})

  const groupsLoadedCallback = (_data: GroupType[]) => {
    logger.debug("TabGroups", "groupsLoadedCallback", JSON.stringify(_data));
   
    allGroups.current = _data;
   
    actionButtons.current = defineActionButtons(_meta.currentSubject as UserType);
   
    const newMeta: MetaBase = cloneObject(_meta);
    newMeta.subject.name = "Groups";
    newMeta.subject.dependency = dependency_groups;
   
    newMeta.subject.getAllDependencies = getAllGroups;
   
    setMetaOfTabGroups(newMeta);
  }
  
   const getAllGroups = (): GroupType[] => {
     logger.debug("TabGroups", "getAllGroups", JSON.stringify(allGroups.current));
 
     return allGroups.current;
   }
 
   useEffect(() => {
     logger.debug("TabGroups", "useEffect[]", "Loading Groups");
 
     handleLoadGroups(groupsLoadedCallback);
   }, [])
 
  const renderComponent = () => {
    return (
      <TabItems _meta={metaOfTabGroups} _buttonConfig={actionButtons.current}/>
    );
  }

  return (<>{renderComponent()}</>);
}

export default TabGroups;