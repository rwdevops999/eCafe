'use client'

import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import { useEffect, useRef, useState } from "react";
import PolicyCreateDialog from "../create/create-policy-dialog";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./table/colums";
import { TableMeta } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import AlertMessage from "@/components/ecafe/alert-message";
import { ConsoleLogger } from "@/lib/console.logger";
import { action_delete, allItems } from "@/data/constants";
import { AlertType, Data, PolicyType } from "@/types/ecafe";
import { mapPoliciesToData, mapPolicyToData } from "@/lib/mapping";
import { handleDeletePolicy, handleLoadPolicyByName } from "@/lib/db";
import { DataTableToolbar } from "./table/data-table-toolbar";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import { useDebug } from "@/hooks/use-debug";
import { ApiResponseType } from "@/types/db";
import { js } from "@/lib/utils";

 const PolicyDetails = ({_policy}:{_policy?: string | undefined;}  ) => {
    const {debug} = useDebug();
  
    const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

    const [loader, setLoader] = useState<boolean>(false);

    const [selectedPolicy, setSelectedPolicy] = useState<string>(allItems)
    const [policy, setPolicy] = useState<PolicyType>();
    const [policyData, setPolicyData] = useState<Data[]>([]);

    const policiesLoaded = useRef<boolean>(false);

    const [alert, setAlert] = useState<AlertType>();
    const [reload, setReload] = useState(0);
    
    const policyLoadedCallback = (data: ApiResponseType) => {
        if (data.status === 200) {
            logger.debug("PolicyDetails", "policyLoadedCallback", js(data));
            
            const policy: PolicyType = data.payload;

            setPolicy(policy);

            let mappedPolicy: Data[] = mapPolicyToData(policy);

            setPolicyData(mappedPolicy);

            policiesLoaded.current = true;
        }

        setLoader(false);
    }

    useEffect(() => {
        if (_policy) {
          setSelectedPolicy(_policy);

          setLoader(true);
          handleLoadPolicyByName(_policy, policyLoadedCallback);
        }
    }, []);

    useEffect(() => {
        setLoader(true);
        handleLoadPolicyByName(selectedPolicy, policyLoadedCallback);
    }, [reload, setReload]);

    const handleRemoveAlert = () => {
        setAlert(undefined);
    }
  
    const policyDeletedCallback = (_data: ApiResponseType) => {
        if (_data.status === 200) {
            setReload((x:any) => x+1);
        }
    }

    const policyInRole = (_policy: Data): AlertType => {
        let alert = {
            open: false,
            error: false,
            title: "",
            message: "",
            child: <Button className="bg-orange-500" size="sm" onClick={() => setAlert(undefined)}>close</Button>
        };

        if (policy && policy.roles) {
            if (policy.roles.length > 0) {
                alert.open = true;
                alert.error = true;
                alert.title = "Unable to delete policy";
                alert.message = `Policy is in role '${policy.roles[0].name}'`;
            }
        }

        return alert;
    }

    const handleDeleteManagedPolicy = (policy: Data) => {
        handleDeletePolicy(policy.id, policyDeletedCallback);
        handleRemoveAlert();
    }

    const handleAction = (action: string, policy: Data) => {
        if (action === action_delete) {
            if (policy.other?.managed) {
              const alert = {
                open: true,
                error: true,
                title: "Unable to delete policy.",
                message: "Managed policies can not be deleted.",
                // child: <Button className="bg-orange-500" size="sm" onClick={handleRemoveAlert}>close</Button>
                child: <Button className="bg-orange-500" size="sm" onClick={() => handleDeleteManagedPolicy(policy)}>delete anyway</Button>
              };
  
              setAlert(alert);
            } else {
                let alert = policyInRole(policy);
                if (alert.error) {
                    setAlert(alert);
                } else {
                    handleDeletePolicy(policy.id, policyDeletedCallback);
                }
            }
      }
    }
    
    const meta: TableMeta<Data[]> = {
        handleAction: handleAction,
    };

    const renderComponent= () => {
        if (alert && alert.open) {
            return (<AlertMessage alert={alert}></AlertMessage>)
        }

        return (
            <div>
                <PageBreadCrumbs crumbs={[{name: "ecafé", url: "/"}, {name: "iam"}, {name: "policies", url: "/iam/policies/policy=*"}]} />
                <div className="flex space-x-2 items-center">
                    <PageTitle className="m-2" title={`Overview policies`} />
                    <EcafeLoader className={loader ? "" : "hidden"}/>
                </div>
                {! loader &&
                    <div className="flex items-center justify-end">
                        <PolicyCreateDialog _enabled={policiesLoaded.current} setReload={setReload}/> 
                    </div>
                }   
    
                {policyData &&
                    <div className="block space-y-5">
                        <DataTable data={policyData} columns={columns} tablemeta={meta} Toolbar={DataTableToolbar}/>
                    </div>
                }
            </div>
        )
    }

    return (<>{renderComponent()}</>);
}

export default PolicyDetails;
