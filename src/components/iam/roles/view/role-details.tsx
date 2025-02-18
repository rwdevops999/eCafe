'use client'

import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./table/colums";
import RoleCreateDialog from "../create/create-role-dialog";
import { TableMeta } from "@tanstack/react-table";
import { action_delete } from "@/data/constants";
import { Button } from "@/components/ui/button";
import { AlertType, Data, RoleType } from "@/types/ecafe";
import { mapRolesToData } from "@/lib/mapping";
import { handleDeleteRole, handleLoadRoles } from "@/lib/db";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { ConsoleLogger } from "@/lib/console.logger";
import AlertMessage from "@/components/ecafe/alert-message";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import { useDebug } from "@/hooks/use-debug";
import { ApiResponseType } from "@/types/db";
import { js } from "@/lib/utils";

const RoleDetails = ({_selectedRole}:{_selectedRole: string | undefined}) => {
    const {debug} = useDebug();
  
    const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

    const [loader, setLoader] = useState<boolean>(false);

    const [reload, setReload] = useState(0);
    const [alert, setAlert] = useState<AlertType>();

    const [roles, setRoles] = useState<RoleType[]>([]);
    const [rolesData, setRolesData] = useState<Data[]>([]);
    const rolesLoaded = useRef<boolean>(false);

    const rolesLoadedCallback = (data: ApiResponseType) => {
        if (data.status === 200) {
            const roles: RoleType[] = data.payload;

            setRoles(roles);
            setRolesData(mapRolesToData(roles));
            rolesLoaded.current = true;
        }

        setLoader(false);
    }

    useEffect(() => {
        setLoader(true);
        handleLoadRoles(rolesLoadedCallback);
    }, []);

    useEffect(() => {
        setLoader(true);
        handleLoadRoles(rolesLoadedCallback);
    }, [reload, setReload]);

    const handleRemoveAlert = () => {
        setAlert(undefined);
    }
  
    const roleDeletedCallback = (_data: ApiResponseType) => {
        if (_data.payload === 200) {
            setReload((x:any) => x+1);
        }
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

    const handleDeleteManagedRole = (role: Data) => {
        handleDeleteRole(role.id, roleDeletedCallback);
        handleRemoveAlert();
    }
    
    const handleAction = (action: string, role: Data) => {
        if (action === action_delete) {
            if (role.other?.managed) {
                const alert = {
                    open: true,
                    error: true,
                    title: "Unable to delete role.",
                    message: "Managed roles can not be deleted.",
                    // child: <Button className="bg-orange-500" size="sm" onClick={handleRemoveAlert}>close</Button>
                    child: <Button className="bg-orange-500" size="sm" onClick={() => handleDeleteManagedRole(role)}>delete anyway</Button>
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
        if (alert && alert.open) {
            return (<AlertMessage alert={alert}></AlertMessage>)
        }
    
        return (
            <div>
                <PageBreadCrumbs crumbs={[{name: "ecafé", url: "/"}, {name: "iam"}, {name: "roles", url: "/iam/roles"}]} />
                <div className="flex space-x-2 items-center">
                    <PageTitle className="m-2" title={`Overview roles`} />
                    <EcafeLoader className={loader ? "" : "hidden"}/>
                </div>
                {! loader &&
                    <div className="flex items-center justify-end">
                        <RoleCreateDialog _enabled={rolesLoaded.current} setReload={setReload}/> 
                    </div>
                }   

                {rolesData &&
                    <div className="block space-y-5">
                        <DataTable data={rolesData} columns={columns} tablemeta={meta} Toolbar={DataTableToolbar}/>
                    </div>
                }
            </div>
        )
    }
    
    return (<>{renderComponent()}</>);
}

export default RoleDetails;
