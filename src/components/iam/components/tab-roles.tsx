'use client'

import { initMetaBase, MetaBase } from "@/data/meta";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cloneObject, log } from "@/lib/utils";
import { FunctionDefault, NewButtonConfig } from "@/data/types";
import { handleLoadRoles } from "@/lib/db";
import TabItems from "./tab-items";
import { Meta } from "../users/data/meta";
import { dependency_roles } from "@/data/constants";
import { ConsoleLogger } from "@/lib/console.logger";
import { defineActionButtons } from "../users/manage/data/util";

const debug = true;

const TabRoles = ({_meta}:{_meta: MetaBase}) => {
  const logger = new ConsoleLogger({ level: 'debug' });

  const allRoles = useRef<NewRoleType[]>([]);

  const [metaOfTabRoles, setMetaOfTabRoles] = useState<MetaBase>();
  const actionButtons = useRef<NewButtonConfig>({})

  const rolesLoadedCallback = (_data: NewRoleType[]) => {
    logger.debug("TabRoles", "rolesLoadedCallback", JSON.stringify(_data));

    allRoles.current = _data;

    actionButtons.current = defineActionButtons(_meta.currentSubject as NewUserType);

    const newMeta: Meta = cloneObject(_meta);
    newMeta.subject.name = "Roles";
    newMeta.subject.dependency = dependency_roles;

    newMeta.subject.getAllDependencies = getAllRoles;

    setMetaOfTabRoles(newMeta);
  }

  const getAllRoles = (): NewRoleType[] => {
    logger.debug("TabRoles", "getAllRoles", JSON.stringify(allRoles.current));

    return allRoles.current;
  }

  useEffect(() => {
    logger.debug("TabRoles", "useEffect[]", "Loading Roles");

    handleLoadRoles(rolesLoadedCallback);
  }, [])

  const renderComponent = () => {
    logger.debug("TabRoles", "RENDER")
    // if (metaOfTabRoles) {
      logger.debug("TabRoles", "RENDER", "because meta is set");
      return (
        <TabItems _meta={metaOfTabRoles} _buttonConfig={actionButtons.current}/>
      );
    // }
  }

  return (
    <>{renderComponent()}</>
  )
}

export default TabRoles;