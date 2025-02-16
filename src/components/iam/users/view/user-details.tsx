 'use client'

import { DataTable } from "@/components/datatable/data-table";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import { cloneObject, js } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { columns } from "./table/colums";
import { TableMeta } from "@tanstack/react-table";
import { action_delete } from "@/data/constants";
import { DataTableToolbar } from "./table/data-table-toolbar";
import UserDialog from "../manage/user-dialog";
import { ConsoleLogger } from "@/lib/console.logger";
import { Data, UserType } from "@/types/ecafe";
import { initUserMeta, Meta } from "../meta/meta";
import { mapUsersToData } from "@/lib/mapping";
import { handleDeleteUser, handleLoadUsers } from "@/lib/db";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import { useDebug } from "@/hooks/use-debug";
import { ApiResponseType } from "@/types/db";

const UserDetails = ({_selectedUser}:{_selectedUser: string | undefined}) => {
    const {debug} = useDebug();
  
    const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

    const [loader, setLoader] = useState<boolean>(false);

  logger.debug("UserDetails", "IN(_selectedUser)", _selectedUser);

  const [reloadState, setReloadState] = useState<number>(0);
  const [rerender, setRerender] = useState<number>(0);

  const [dialogState, setDialogState] = useState<boolean>(false);

  const usersRef = useRef<UserType[]>([]);
  const usersDataRef = useRef<Data[]>([]);

  const metaUserDetails = useRef<Meta>(initUserMeta);

  const setSelectedUser = (_user: UserType|undefined) => {
    logger.debug("UserDetails", "setSelectedUser => META currentSubject", JSON.stringify(_user));
    metaUserDetails.current.currentSubject = _user;
  }

  const usersLoadedCallback = (_data: ApiResponseType) => {
    if (_data.status === 200) {
      const users: UserType[] = _data.payload;
      logger.debug("UserDetails", "usersLoadedCallback", js(users));

      usersRef.current = users;

      setSelectedUser(undefined);

      usersDataRef.current = mapUsersToData(users);
      
      setRerender((x:any) => x+1);
    }

    setLoader(false)
  }

  const handleDialogState = (open: boolean) => {
    logger.debug("UserDetails", "handleDialogState(open)", open);
    if (! open) {
      logger.debug("UserDetails", "handleDialogState", "Set user to undefined");

      setSelectedUser(undefined);
    }    

    setDialogState(open)
  }

  useEffect(() => {
    logger.debug("UserDetails", "USE EFFECT[] => META handleDialogState");
    metaUserDetails.current.control.handleDialogState = handleDialogState;

    setLoader(true);
    handleLoadUsers(usersLoadedCallback);
  }, []);

  useEffect(() => {
    logger.debug("UserDetails", "LOAD USERS AFTER RELOAD");

    setLoader(true);
    handleLoadUsers(usersLoadedCallback);
  }, [reloadState, setReloadState]);

  const userDeletedCallback = (_data: ApiResponseType) => {
    if (_data.status === 200) {
      setSelectedUser(undefined);
      setLoader(true);
      handleLoadUsers(usersLoadedCallback);
    }
  }

  const handleAction = (_action: string, _user: Data) => {
    logger.debug("UserDetails", "handleAction", _action);
    if (_action === action_delete) {
      logger.debug("UserDetails", "handleAction", "see VSCODE terminal for API messages");
      handleDeleteUser(_user.id, userDeletedCallback);
    } else {
      logger.debug("UserDetails", "handleAction", _user);
      const selectedUser: UserType = usersRef.current.find((user) => user.id === _user.id)!;
      setSelectedUser(selectedUser);
      logger.debug("UserDetails", "changeDialogState => true");
      setDialogState(true);
    }
  }

  const tablemeta: TableMeta<Data[]> = {
    handleAction: handleAction,
  };

  const renderComponent = () => {
    if  (usersDataRef && metaUserDetails) {
      logger.debug("UserDetails", "RENDER");
      logger.debug("UserDetails", ">>> dialogState", dialogState);

      return (
        <div>
          <PageBreadCrumbs crumbs={[{name: "ecafé", url: "/"}, {name: "iam"}, {name: "users", url: "/iam/users"}]} />
          <div className="flex space-x-2 items-center">
            <PageTitle className="m-2" title={`Overview users`} />
            <EcafeLoader className={loader ? "" : "hidden"}/>
          </div>

          {!loader &&
            <div className="flex items-center justify-end">
              <UserDialog _open={dialogState}  _meta={cloneObject(metaUserDetails.current)} _setReload={setReloadState}/>
            </div>
          }

          {usersDataRef.current &&
            <div className="block space-y-5">
              <DataTable data={usersDataRef.current} columns={columns} tablemeta={tablemeta} Toolbar={DataTableToolbar} rowSelecting enableRowSelection={false}/>
            </div>
          }
        </div>
      );
    }

    return null;
  };

  return (<>{renderComponent()}</>);
}

export default UserDetails;