import { MetaBase } from "@/data/meta";
import { NewButtonConfig } from "@/data/types";
import { ConsoleLogger } from "@/lib/console.logger";
import { useEffect, useRef, useState } from "react";
import { defineActionButtons } from "../users/manage/data/util";
import { Meta } from "../users/data/meta";
import { cloneObject } from "@/lib/utils";
import { dependency_users } from "@/data/constants";
import { handleLoadUsers } from "@/lib/db";
import TabItems from "./tab-items";

const TabUsers = ({_meta}:{_meta: MetaBase}) => {
  const logger = new ConsoleLogger({ level: 'debug' });

  const allUsers = useRef<NewUserType[]>([]);

  const [metaOfTabUsers, setMetaOfTabUsers] = useState<MetaBase>();
  const actionButtons = useRef<NewButtonConfig>({})

  const usersLoadedCallback = (_data: NewUserType[]) => {
    logger.debug("TabUsers", "usersLoadedCallback", JSON.stringify(_data));
   
    allUsers.current = _data;
   
    actionButtons.current = defineActionButtons(_meta.currentSubject as NewGroupType);
   
    const newMeta: Meta = cloneObject(_meta);
    newMeta.subject.name = "Users";
    newMeta.subject.dependency = dependency_users;
   
    newMeta.subject.getAllDependencies = getAllUsers;
   
    setMetaOfTabUsers(newMeta);
  }
  
   const getAllUsers = (): NewUserType[] => {
     logger.debug("TabUsers", "getAllUsers", JSON.stringify(allUsers.current));
 
     return allUsers.current;
   }
 
   useEffect(() => {
     logger.debug("TabUsers", "useEffect[]", "Loading Users");
 
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