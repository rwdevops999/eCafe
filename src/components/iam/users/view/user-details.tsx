'use client'

import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import ManageUserDialog from "../manage/manage-user-dialog";
import { useEffect, useRef, useState } from "react";
import { RoleType, UserType } from "@/data/iam-scheme";
import { useToast } from "@/hooks/use-toast";
import { Data, mapUsersToData } from "@/lib/mapping";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./table/colums";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { action_delete } from "@/data/constants";
import { TableMeta } from "@tanstack/react-table";
import { CallbackFunctionDefault, CallbackFunctionSubjectLoaded } from "@/data/types";
import { log } from "@/lib/utils";
import { Meta } from "../manage/tabs/data/meta";

const UserDetails = ({_selectedUser}:{_selectedUser: string | undefined}) => {
  const { toast, dismiss } = useToast();
  let toastId: string;

  const renderToast = () => {
    let {id} = toast({title: "Loading...", description: "Users"})
    toastId = id;
  }

  const users = useRef<UserType[]>([]);
  const usersLoaded = useRef<boolean>(false);
  const [usersData, setUsersData] = useState<Data[]>([]);

  const [user, setUser] = useState<UserType|undefined>();
  const [reload, setReload] = useState<number>(0);

  const usersLoadedCallback = (data: UserType[]) => {
    dismiss(toastId);

    users.current = data;
    setUsersData(mapUsersToData(data, 2));
    usersLoaded.current = true;
  }

  const loadUsers = async (callback: CallbackFunctionSubjectLoaded) => {
      await fetch("http://localhost:3000/api/iam/users")
        .then((response) => response.json())
        .then((response) => {
          callback(response);
        });
  }

  const handleLoadUsers = async (callback: CallbackFunctionSubjectLoaded) => {
    await loadUsers(callback);
  }
  
  useEffect(() => {
    setUser(undefined);
    renderToast();
    handleLoadUsers(usersLoadedCallback);
  }, []);

  useEffect(() => {
    renderToast();
    handleLoadUsers(usersLoadedCallback);
  }, [reload, setReload]);

  const userDeletedCallback = () => {
    setReload((x:any) => x+1);
  }

  const handleDeleteUser = async (id: number, callback: CallbackFunctionDefault) => {
    const res = await fetch("http://localhost:3000/api/iam/users?userId="+id,{
        method: 'DELETE',
    }).then((response: Response) => callback());
  }

  const deleteUser = (user: Data) => {
    handleDeleteUser(user.id, userDeletedCallback);
    setUser(undefined);
  }
  
  const updateUser = (user: Data) => {
    const selectedUser: UserType = users.current.find((_user) => _user.id === user.id)!;

    setUser(selectedUser);
    
    const button = document.getElementById("dialogButton");
    if (button !== null) {
      button.click();
    }
  }

  const handleReset = () => {
    setUser(undefined);   
  }

  const handleAction = (action: string, user: Data) => {
    if (action === action_delete) {
      deleteUser(user);
    } else {
      updateUser(user);
    }
  }

  const setupRoles = (roles: RoleType[]) => {

  }

  const updateItems = (type: string, items: any[]) => {
    if (type === "roles") {
      setupRoles(items);
    }
  }

  const meta: Meta = {
    updateItems: updateItems,
  };

  const tablemeta: TableMeta<Data[]> = {
    handleAction: handleAction,
  };

  const renderComponent = () => {
    if  (usersData) {
      return (
        <div>
            <PageBreadCrumbs crumbs={[{name: "iam"}, {name: "users", url: "/iam/users"}]} />
            <PageTitle className="m-2" title={`Overview users`} />

            <div className="flex items-center justify-end">
            <ManageUserDialog meta={meta} _enabled={usersLoaded.current} user={user} handleReset={handleReset} setReload={setReload}/> 
            </div>
            <div className="block space-y-5">
              <DataTable data={usersData} columns={columns} tablemeta={tablemeta} Toolbar={DataTableToolbar} rowSelecting enableRowSelection={false}/>
            </div>
        </div>
      );
    }

    return null;
  };

  return (<>{renderComponent()}</>);
}

export default UserDetails;