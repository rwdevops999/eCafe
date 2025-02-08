 'use client'

import { DataTable } from "@/components/datatable/data-table";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import { cloneObject } from "@/lib/utils";
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

const UserDetails = ({_selectedUser}:{_selectedUser: string | undefined}) => {
  const logger = new ConsoleLogger({ level: 'debug' });
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

  const usersLoadedCallback = (_users: UserType[]) => {
    logger.debug("UserDetails", "usersLoadedCallback", JSON.stringify(_users));

    // Store all the users in ref
    usersRef.current = _users

    // if _selectedUser !== undefined handle it here
    setSelectedUser(undefined);

    // map the users to Data for rendering the DataTable
    //    id:           user.id,
    //    name:         user.name,
    //    description:  user.firstname,
    //    children:     []
    // setDataUsers(mapUsersToData(_users));
    usersDataRef.current = mapUsersToData(_users);
    setRerender((x:any) => x+1);
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

  // on deletion of user, reload the component
  const userDeletedCallback = () => {
    setSelectedUser(undefined);
    setLoader(true);
    handleLoadUsers(usersLoadedCallback);
  }

  // const [reload, setReload] = useState<number>(0);

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

  // // create TableMeta for handling actions
  const tablemeta: TableMeta<Data[]> = {
    handleAction: handleAction,
  };

  const renderComponent = () => {
    if  (usersDataRef && metaUserDetails) {
      logger.debug("UserDetails", "RENDER");
      logger.debug("UserDetails", ">>> dialogState", dialogState);

      return (
        <div>
          <PageBreadCrumbs crumbs={[{name: "iam"}, {name: "users", url: "/iam/users"}]} />
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