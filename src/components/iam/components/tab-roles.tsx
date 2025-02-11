'use client'

import { useEffect, useRef, useState } from "react";
import { cloneObject } from "@/lib/utils";
import TabItems from "./tab-items";
import { dependency_roles } from "@/data/constants";
import { ConsoleLogger } from "@/lib/console.logger";
import { ButtonConfig, GroupType, RoleType, UserType } from "@/types/ecafe";
import { handleLoadRoles } from "@/lib/db";
import { MetaBase } from "@/data/meta-base";
import { defineActionButtons } from "../lib/util";
import { useDebug } from "@/hooks/use-debug";

const TabRoles = ({_meta}:{_meta: MetaBase}) => {
  const {debug} = useDebug();
    
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});
  
  const allRoles = useRef<RoleType[]>([]);

  const [metaOfTabRoles, setMetaOfTabRoles] = useState<MetaBase>();
  const actionButtons = useRef<ButtonConfig>({})

  const rolesLoadedCallback = (_data: RoleType[]) => {
    logger.debug("TabRoles", "rolesLoadedCallback", JSON.stringify(_data));

    allRoles.current = _data;

    actionButtons.current = defineActionButtons(_meta.currentSubject as UserType|GroupType);

    const newMeta: MetaBase = cloneObject(_meta);
    newMeta.subject.name = "Roles";
    newMeta.subject.dependency = dependency_roles;

    newMeta.subject.getAllDependencies = getAllRoles;

    setMetaOfTabRoles(newMeta);
  }

  const getAllRoles = (): RoleType[] => {
    logger.debug("TabRoles", "getAllRoles", JSON.stringify(allRoles.current));

    return allRoles.current;
  }

  useEffect(() => {
    logger.debug("TabRoles", "useEffect[]", "Loading Roles");

    handleLoadRoles(rolesLoadedCallback);
  }, [])

  const renderComponent = () => {
    logger.debug("TabRoles", "RENDER")

    return (
      <TabItems _meta={metaOfTabRoles} _buttonConfig={actionButtons.current}/>
    );
  }

  return (<>{renderComponent()}</>);
}

export default TabRoles;