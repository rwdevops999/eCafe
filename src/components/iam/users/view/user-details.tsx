 'use client'

import { DataTable } from "@/components/datatable/data-table";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import { FunctionDefault } from "@/data/types";
import { useToast } from "@/hooks/use-toast";
import { handleDeleteUser, handleLoadUsers } from "@/lib/db";
import { Data, mapUsersToData } from "@/lib/mapping";
import { cloneObject, log } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { columns } from "./table/colums";
import { TableMeta } from "@tanstack/react-table";
import { action_delete } from "@/data/constants";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { initUserMeta, Meta } from "../data/meta";
import UserDialog from "../manage/user-dialog";
import { ConsoleLogger } from "@/lib/console.logger";

const UserDetails = ({_selectedUser}:{_selectedUser: string | undefined}) => {
  const logger = new ConsoleLogger({ level: 'debug' });

  logger.debug("UserDetails", "IN(_selectedUser)", _selectedUser);

  const [reloadState, setReloadState] = useState<number>(0);
  const [rerender, setRerender] = useState<number>(0);

  const [dialogState, setDialogState] = useState<boolean>(false);

  const usersRef = useRef<NewUserType[]>([]);
  const usersDataRef = useRef<Data[]>([]);

  const metaUserDetails = useRef<Meta>(initUserMeta);

  const setSelectedUser = (_user: NewUserType|undefined) => {
    logger.debug("UserDetails", "setSelectedUser => META currentSubject", JSON.stringify(_user));
    metaUserDetails.current.currentSubject = _user;
  }

  const usersLoadedCallback = (_users: NewUserType[], _end: FunctionDefault) => {
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
  //   _end();
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

    handleLoadUsers(() => {}, usersLoadedCallback, () => {});
  }, []);

  useEffect(() => {
    logger.debug("UserDetails", "LOAD USERS AFTER RELOAD");

    handleLoadUsers(() => {}, usersLoadedCallback, () => {});
  }, [reloadState, setReloadState]);

  // on deletion of user, reload the component
  const userDeletedCallback = () => {
    setSelectedUser(undefined);
    handleLoadUsers(()=>{}, usersLoadedCallback, ()=>{});
  }

  // const [reload, setReload] = useState<number>(0);

  const handleAction = (_action: string, _user: Data) => {
    logger.debug("UserDetails", "handleAction", _action);
    if (_action === action_delete) {
      logger.debug("UserDetails", "handleAction", "see VSCODE terminal for API messages");
      handleDeleteUser(_user.id, ()=>{}, userDeletedCallback, ()=>{});
    } else {
      logger.debug("UserDetails", "handleAction", _user);
      const selectedUser: NewUserType = usersRef.current.find((user) => user.id === _user.id)!;
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
        // log(debug, "UserDetails", ">>> dataUsers", dataUsers, true);
        // log(debug, "UserDetails", ">>> currentUser", metaUserDetails.current.currentSubject ?? "user is undefined", true);

      return (
        <div>
            <PageBreadCrumbs crumbs={[{name: "iam"}, {name: "users", url: "/iam/users"}]} />
            <PageTitle className="m-2" title={`Overview users`} />

              <div className="flex items-center justify-end">
                <UserDialog _open={dialogState}  _meta={cloneObject(metaUserDetails.current)} _setReload={setReloadState}/>
              {/* <ManageUserDialog meta={metaForUserDetails} _enabled={usersLoaded.current} handleReset={handleReset} setReload={setReload}/>  */}
              </div>
              <div className="block space-y-5">
                <DataTable data={usersDataRef.current} columns={columns} tablemeta={tablemeta} Toolbar={DataTableToolbar} rowSelecting enableRowSelection={false}/>
              </div>
        </div>
      );
    }

    return null;
  };

  return (<>{renderComponent()}</>);
}

export default UserDetails;