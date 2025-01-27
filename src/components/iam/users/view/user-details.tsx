'use client'

import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import ManageUserDialog from "../manage/manage-user-dialog";
import { useEffect, useRef, useState } from "react";
import { defaultCountry, RoleType, UserType } from "@/data/iam-scheme";
import { useToast } from "@/hooks/use-toast";
import { Data, mapUsersToData } from "@/lib/mapping";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./table/colums";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { action_delete } from "@/data/constants";
import { TableMeta } from "@tanstack/react-table";
import { log } from "@/lib/utils";
import { handleDeleteUser, handleLoadUsers } from "@/lib/db";
import { FormSchemaType, Meta } from "../manage/tabs/data/meta";

const UserDetails = ({_selectedUser}:{_selectedUser: string | undefined}) => {
  const { toast, dismiss } = useToast();
  let toastId: string;

  const renderToast = () => {
    let {id} = toast({title: "Loading...", description: "Users"})
    toastId = id;
  }

  const [metaForUserDetails, setMetaForUserDetails] = useState<Meta<FormSchemaType>>();
  const [reload, setReload] = useState<number>(0);

  const users = useRef<UserType[]>([]);
  const usersLoaded = useRef<boolean>(false);
  const usersData = useRef<Data[]>([]);

  const [user, setUser] = useState<UserType|undefined>();

  const usersLoadedCallback = (data: UserType[]) => {
    dismiss(toastId);

    users.current = data;
    usersData.current = mapUsersToData(data);
    usersLoaded.current = true;
  }

  const changeMeta = (meta: Meta<FormSchemaType>): void => {
    setMetaForUserDetails(meta);
    setReload((x: number) => x+1);
  };

  useEffect(() => {
    let meta:Meta<FormSchemaType> = {
      sender: "UserDetails",
      subject: undefined,
      changeMeta: changeMeta,
      data: {
        country: {
          id: 0,
          name: defaultCountry.name,
          dialCode: defaultCountry.dialCode
        }
      }
    }

    log (true, "UD", "INIT META", meta.data, true);
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
      metaForUserDetails.subject = selectedUser;
      setMetaForUserDetails(metaForUserDetails);
    }
    
    const button = document.getElementById("dialogButton");
    if (button !== null) {
      button.click();
    }
  }

  const handleReset = () => {
    log (true, "UD", "RESET");
    setUser(undefined);

    if (metaForUserDetails) {
      metaForUserDetails.subject = undefined;
      
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