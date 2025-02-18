'use client'

import { ConsoleLogger } from "@/lib/console.logger";
import { useEffect, useRef, useState } from "react";
import { cloneObject } from "@/lib/utils";
import { dependency_users } from "@/data/constants";
import TabItems from "./tab-items";
import { ButtonConfig, GroupType, UserType } from "@/types/ecafe";
import { handleLoadUsers } from "@/lib/db";
import { MetaBase } from "@/data/meta-base";
import { defineActionButtons } from "../lib/util";
import { useDebug } from "@/hooks/use-debug";
import { ApiResponseType } from "@/types/db";

const TabUsers = ({_meta}:{_meta: MetaBase}) => {
  const {debug} = useDebug();
  
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const allUsers = useRef<UserType[]>([]);

  const [metaOfTabUsers, setMetaOfTabUsers] = useState<MetaBase>();
  const actionButtons = useRef<ButtonConfig>({})

  const usersLoadedCallback = (_data: ApiResponseType) => {
    if (_data.status === 200) {
      const users: UserType[] = _data.payload;

      allUsers.current = users;
    
      actionButtons.current = defineActionButtons(_meta.currentSubject as GroupType|UserType);
    
      const newMeta: MetaBase = cloneObject(_meta);
      newMeta.subject.name = "Users";
      newMeta.subject.dependency = dependency_users;
    
      newMeta.subject.getAllDependencies = getAllUsers;
    
      setMetaOfTabUsers(newMeta);
    }
  }
  
   const getAllUsers = (): UserType[] => {
     return allUsers.current;
   }
 
   useEffect(() => {
     handleLoadUsers(usersLoadedCallback);
   }, [])
 
  const renderComponent = () => {
    return (
      <TabItems _meta={metaOfTabUsers} _buttonConfig={actionButtons.current}/>
    );
  }

  return (<>{renderComponent()}</>);
}

export default TabUsers;