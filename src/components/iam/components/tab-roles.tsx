'use client'

import { useEffect, useRef, useState } from "react";
import { cloneObject, js } from "@/lib/utils";
import TabItems from "./tab-items";
import { dependency_roles } from "@/data/constants";
import { ConsoleLogger } from "@/lib/console.logger";
import { ButtonConfig, GroupType, RoleType, UserType } from "@/types/ecafe";
import { handleLoadRoles } from "@/lib/db";
import { MetaBase } from "@/data/meta-base";
import { defineActionButtons } from "../lib/util";
import { useDebug } from "@/hooks/use-debug";
import { ApiResponseType } from "@/types/db";

const TabRoles = ({_meta}:{_meta: MetaBase}) => {
  const {debug} = useDebug();
    
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});
  
  const allRoles = useRef<RoleType[]>([]);

  const [metaOfTabRoles, setMetaOfTabRoles] = useState<MetaBase>();
  const actionButtons = useRef<ButtonConfig>({})

  const rolesLoadedCallback = (_data: ApiResponseType) => {
    if (_data.status === 200) {
      allRoles.current = _data.payload;

      actionButtons.current = defineActionButtons(_meta.currentSubject as UserType|GroupType);

      const newMeta: MetaBase = cloneObject(_meta);
      newMeta.subject.name = "Roles";
      newMeta.subject.dependency = dependency_roles;

      newMeta.subject.getAllDependencies = getAllRoles;

      setMetaOfTabRoles(newMeta);
    }
  }

  const getAllRoles = (): RoleType[] => {
    return allRoles.current;
  }

  useEffect(() => {
    handleLoadRoles(rolesLoadedCallback);
  }, [])

  const renderComponent = () => {
    return (
      <TabItems _meta={metaOfTabRoles} _buttonConfig={actionButtons.current}/>
    );
  }

  return (<>{renderComponent()}</>);
}

export default TabRoles;