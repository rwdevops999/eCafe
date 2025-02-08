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
import { mapPoliciesToData } from "@/lib/mapping";
import { handleDeletePolicy, handleLoadPoliciesWithPolicyName } from "@/lib/db";
import { DataTableToolbar } from "./table/data-table-toolbar";

 const PolicyDetails = ({_policy}:{_policy?: string | undefined;}  ) => {
    const logger = new ConsoleLogger({ level: 'debug' });

    const [selectedPolicy, setSelectedPolicy] = useState<string>(allItems)
    const [policies, setPolicies] = useState<PolicyType[]>([]);
    const [policiesData, setPoliciesData] = useState<Data[]>([]);

    const policiesLoaded = useRef<boolean>(false);

    const [alert, setAlert] = useState<AlertType>();
    const [reload, setReload] = useState(0);
    
    const policiesLoadedCallback = (data: PolicyType[]) => {
        logger.debug("PolicyDetails", "policiesLoadedCallback", JSON.stringify(data));
        
        setPolicies(data);

        let mappedPolicies: Data[] = mapPoliciesToData(data);

        setPoliciesData(mappedPolicies);
        policiesLoaded.current = true;
    }

    useEffect(() => {
        if (_policy) {
          setSelectedPolicy(_policy);

          handleLoadPoliciesWithPolicyName(_policy, policiesLoadedCallback);
        }
    }, []);

    useEffect(() => {
        handleLoadPoliciesWithPolicyName(selectedPolicy, policiesLoadedCallback);
    }, [reload, setReload]);

    const handleRemoveAlert = () => {
        setAlert(undefined);
    }
  
    const policyDeletedCallback = () => {
        setReload((x:any) => x+1);
    }

    const policyInRole = (_policy: Data): AlertType => {
        let alert = {
            open: false,
            error: false,
            title: "",
            message: "",
            child: <Button className="bg-orange-500" size="sm" onClick={() => setAlert(undefined)}>close</Button>
        };

        const policy = policies.find(p => p.id === _policy.id);
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
                <PageBreadCrumbs crumbs={[{name: "iam"}, {name: "policies", url: "/iam/policies/policy=*"}]} />
                <PageTitle className="m-2" title={`Overview policies`} />
                <div className="flex items-center justify-end">
                    <PolicyCreateDialog _enabled={policiesLoaded.current} setReload={setReload}/> 
                </div>
    
                <div className="block space-y-5">
                    <DataTable data={policiesData} columns={columns} tablemeta={meta} Toolbar={DataTableToolbar}/>
                </div>
            </div>
        )
    }

    return (<>{renderComponent()}</>);
}

export default PolicyDetails;
