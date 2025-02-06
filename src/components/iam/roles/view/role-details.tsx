'use client'

import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import { AlertType, FunctionDefault } from "@/data/types";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./table/colums";
import RoleCreateDialog from "../create/create-role-dialog";
import { RoleType } from "@/data/iam-scheme";
import { Data, mapRolesToData } from "@/lib/mapping";
import { TableMeta } from "@tanstack/react-table";
import { action_delete } from "@/data/constants";
import { Button } from "@/components/ui/button";
import { handleDeleteRole, handleLoadRoles } from "@/lib/db";
import { log } from "@/lib/utils";

const debug: boolean = false;

const RoleDetails = ({_selectedRole}:{_selectedRole: string | undefined}) => {
    const { toast, dismiss } = useToast();
    let toastId: string;

    const renderToast = (_title: string, _description: string): void => {
      log(debug, "PolicyDetails", "render toast");
      let {id} = toast({title: `${_title}`, description: `${_description}`});
      toastId = id;
    }
    
    const renderToastLoadRoles = () => renderToast("Loading...", "roles");
    const renderToastDeleteRole = () => renderToast("Deleting...", "role");
    
    const closeToast = () => {
        log(debug, "CreateStatementDetails", "dismiss toast");
        dismiss(toastId);
    }

    const [reload, setReload] = useState(0);
    const [alert, setAlert] = useState<AlertType>();

    const [roles, setRoles] = useState<RoleType[]>([]);
    const [rolesData, setRolesData] = useState<Data[]>([]);
    const rolesLoaded = useRef<boolean>(false);

    const rolesLoadedCallback = (data: RoleType[]) => {
        setRoles(data);
        let mappedRoles = mapRolesToData(data);

        setRolesData(mapRolesToData(data));
        rolesLoaded.current = true;
        dismiss(toastId);
    }

    useEffect(() => {
        handleLoadRoles(renderToastLoadRoles, rolesLoadedCallback, closeToast);
    }, []);

    useEffect(() => {
        handleLoadRoles(renderToastLoadRoles, rolesLoadedCallback, closeToast);
    }, [reload, setReload]);

    const handleRemoveAlert = () => {
        setAlert(undefined);
    }
  
    const roleDeletedCallback = (_end: FunctionDefault) => {
        _end();
        
        setReload((x:any) => x+1);
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
              handleDeleteRole(role.id, renderToastDeleteRole, roleDeletedCallback, closeToast);
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
