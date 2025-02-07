'use client'

import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import { AlertType } from "@/data/types";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./table/colums";
import RoleCreateDialog from "../create/create-role-dialog";
import { Data, mapRolesToData } from "@/lib/mapping";
import { TableMeta } from "@tanstack/react-table";
import { action_delete } from "@/data/constants";
import { Button } from "@/components/ui/button";
import { handleDeleteRole, handleLoadRoles } from "@/lib/db";

const RoleDetails = ({_selectedRole}:{_selectedRole: string | undefined}) => {
    const [reload, setReload] = useState(0);
    const [alert, setAlert] = useState<AlertType>();

    const [roles, setRoles] = useState<NewRoleType[]>([]);
    const [rolesData, setRolesData] = useState<Data[]>([]);
    const rolesLoaded = useRef<boolean>(false);

    const rolesLoadedCallback = (data: NewRoleType[]) => {
        setRoles(data);
        setRolesData(mapRolesToData(data));
        rolesLoaded.current = true;
    }

    useEffect(() => {
        handleLoadRoles(rolesLoadedCallback);
    }, []);

    useEffect(() => {
        handleLoadRoles(rolesLoadedCallback);
    }, [reload, setReload]);

    const handleRemoveAlert = () => {
        setAlert(undefined);
    }
  
    const roleDeletedCallback = () => {
        setReload((x:any) => x+1);
    }

  const roleUsed = (_role: Data): AlertType => {
      let alert = {
        open: false,
        error: false,
        title: "",
        message: "",
        child: <Button className="bg-orange-500" size="sm" onClick={() => setAlert(undefined)}>close</Button>
      };

      const role = roles.find(r => r.id === _role.id);
      if (role && role.users && role.users.length > 0) {
            alert.open = true;
            alert.error = true;
            alert.title = "Unable to delete role";
            alert.message = `Role is used by user '${role.users[0].name}'`;
        } else if (role && role.groups && role.groups.length > 0) {
            alert.open = true;
            alert.error = true;
            alert.title = "Unable to delete role";
            alert.message = `Role is used by group '${role.groups[0].name}'`;
        }

      return alert;
    }

    const handleAction = (action: string, role: Data) => {
        if (action === action_delete) {
            if (role.other?.managed) {
              const alert = {
                open: true,
                error: true,
                title: "Unable to delete role.",
                message: "Managed roles can not be deleted.",
                child: <Button className="bg-orange-500" size="sm" onClick={handleRemoveAlert}>close</Button>
              };
  
              setAlert(alert);
            } else {
                let alert = roleUsed(role);
                if (alert.error) {
                    setAlert(alert);
                } else {
                    handleDeleteRole(role.id, roleDeletedCallback);
                }
            }
      }
    }

    const meta: TableMeta<Data[]> = {
        handleAction: handleAction,
    };

    const renderComponent = () => {
        return (
            <div>
                <PageBreadCrumbs crumbs={[{name: "iam"}, {name: "roles", url: "/iam/roles"}]} />
                <PageTitle className="m-2" title={`Overview roles`} />
                <div className="flex items-center justify-end">
                    <RoleCreateDialog _enabled={rolesLoaded.current} setReload={setReload}/> 
                    {/* enabled={loaded} setReload={setReload}/> */}
                </div>
                <div className="block space-y-5">
                    <DataTable data={rolesData} columns={columns} tablemeta={meta}/>
                    {/* renderAdditional={renderData} showSelectInfo={false} Toolbar={DataTableToolbar} onRowDelete={handleRowDelete}/> */}
                </div>
            </div>
        )
    }
    return (
        <div>{renderComponent()}</div>
    )
}

export default RoleDetails;
