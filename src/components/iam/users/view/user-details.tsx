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
import { log } from "@/lib/utils";
import { Meta } from "../manage/tabs/data/meta";
import { handleDeleteUser, handleLoadUsers } from "@/lib/db";

const UserDetails = ({_selectedUser}:{_selectedUser: string | undefined}) => {
  const { toast, dismiss } = useToast();
  let toastId: string;

  const renderToast = () => {
    let {id} = toast({title: "Loading...", description: "Users"})
    toastId = id;
  }

  const [metaForUserDetails, setMetaForUserDetails] = useState<Meta>();
  const [reload, setReload] = useState<number>(0);

  const users = useRef<UserType[]>([]);
  const usersLoaded = useRef<boolean>(false);
  // const [usersData, setUsersData] = useState<Data[]>([]);

  const usersData = useRef<Data[]>([]);

  const [user, setUser] = useState<UserType|undefined>();

  const usersLoadedCallback = (data: UserType[]) => {
    dismiss(toastId);

    users.current = data;
    usersData.current = mapUsersToData(data, 2);
    usersLoaded.current = true;
  }

  const changeMeta = (meta: Meta) => {
    setMetaForUserDetails(meta);
    setReload((x: number) => x+1);
  }
  
  useEffect(() => {
    let meta:Meta = {
      sender: "UserDetails",
      user: undefined,
      changeMeta: changeMeta,
      control: {
        updateItems: updateItems,
      }
    }
    setMetaForUserDetails(meta);

    renderToast();
    handleLoadUsers(usersLoadedCallback);
  }, []);

  useEffect(() => {
    renderToast();
    handleLoadUsers(usersLoadedCallback);
  }, [reload, setReload]);

  const userDeletedCallback = () => {
    setUser(undefined);
    setReload((x:any) => x+1);
  }

  const deleteUser = (user: Data) => {
    handleDeleteUser(user.id, userDeletedCallback);
  }
  
  const updateUser = (user: Data) => {
    const selectedUser: UserType = users.current.find((_user) => _user.id === user.id)!;

    setUser(selectedUser);
    if (metaForUserDetails) {
      metaForUserDetails.user = selectedUser;
      setMetaForUserDetails(metaForUserDetails);
    }
    
    const button = document.getElementById("dialogButton");
    if (button !== null) {
      button.click();
    }
  }

  const handleReset = () => {
    setUser(undefined);

    if (metaForUserDetails) {
      metaForUserDetails.user = undefined;
      setMetaForUserDetails(metaForUserDetails);
      setReload((x: number) => x+1);
    }
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

  const tablemeta: TableMeta<Data[]> = {
    handleAction: handleAction,
  };

  const renderComponent = () => {
    if  (usersData && metaForUserDetails) {
      return (
        <div>
            <PageBreadCrumbs crumbs={[{name: "iam"}, {name: "users", url: "/iam/users"}]} />
            <PageTitle className="m-2" title={`Overview users`} />

            <div className="flex items-center justify-end">
            <ManageUserDialog meta={metaForUserDetails} _enabled={usersLoaded.current} handleReset={handleReset} setReload={setReload}/> 
            </div>
            <div className="block space-y-5">
              <DataTable id="UserDetailsTable" data={usersData.current} columns={columns} tablemeta={tablemeta} Toolbar={DataTableToolbar} rowSelecting enableRowSelection={false}/>
            </div>
        </div>
      );
    }

    return null;
  };

  return (<>{renderComponent()}</>);
}

export default UserDetails;