'use client'

import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import { useEffect, useRef, useState } from "react";
import PolicyCreateDialog from "../create/create-policy-dialog";
import { action_delete, all } from "@/data/constants";
import { useToast } from "@/hooks/use-toast";
import { log } from "@/lib/utils";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./table/colums";
import { TableMeta } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { AlertType, CallbackFunctionDefault, CallbackFunctionSubjectLoaded } from "@/data/types";
import AlertMessage from "@/app/(routing)/testing/alert-message";
import { Data, mapPoliciesToData } from "@/lib/mapping";
import { PolicyType } from "@/data/iam-scheme";

 const PolicyDetails = ({_policy}:{_policy?: string | undefined;}  ) => {
    const { toast, dismiss } = useToast()
    let toastId: string;

    const [selectedPolicy, setSelectedPolicy] = useState<string>(all)
    const [policies, setPolicies] = useState<PolicyType[]>([]);
    const [policiesData, setPoliciesData] = useState<Data[]>([]);

    const policiesLoaded = useRef<boolean>(false);

    const [alert, setAlert] = useState<AlertType>();
    const [reload, setReload] = useState(0);
    
    const renderToast = () => {
        let {id} = toast({title: "Policies", description: "loading ..."})
        toastId = id;
    }

    const policiesLoadedCallback = (data: PolicyType[]) => {
        setPolicies(data);

        let mappedPolicies: Data[] = mapPoliciesToData(data);

        setPoliciesData(mapPoliciesToData(data));
        policiesLoaded.current = true;
        dismiss(toastId);
    }

    const loadPolicies = async (_policy: string, callback: CallbackFunctionSubjectLoaded) => {
          await fetch("http://localhost:3000/api/iam/policies?policy=" + _policy)
            .then((response) => response.json())
            .then((response) => {
                callback(response);
            });
    }
    
    const handleLoadPolicies = async (_policy: string, callback: CallbackFunctionSubjectLoaded) => {
        await loadPolicies(_policy, callback);
    }

    useEffect(() => {
        if (_policy) {
          setSelectedPolicy(_policy);

          renderToast();
          handleLoadPolicies(_policy, policiesLoadedCallback);
        }
    }, []);

    useEffect(() => {
        renderToast();
        handleLoadPolicies(selectedPolicy, policiesLoadedCallback);
    }, [reload, setReload]);

    const handleRemoveAlert = () => {
        setAlert(undefined);
    }
  
    const policyDeletedCallback = () => {
        setReload((x:any) => x+1);
    }

    const handleDeletePolicy = async (id: number, callback: CallbackFunctionDefault) => {
        const res = await fetch("http://localhost:3000/api/iam/policies?policyId="+id,{
            method: 'DELETE',
        }).then((response: Response) => callback());
    }

    const handleAction = (action: string, policy: Data) => {
        if (action === action_delete) {
            if (policy.other?.managed) {
              const alert = {
                open: true,
                error: true,
                title: "Unable to delete policy.",
                message: "Managed policies can not be deleted.",
                child: <Button className="bg-orange-500" size="sm" onClick={handleRemoveAlert}>close</Button>
              };
  
              setAlert(alert);
            } else {
              handleDeletePolicy(policy.id, policyDeletedCallback);
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
                    <DataTable data={policiesData} columns={columns} tablemeta={meta} expandAll={_policy !== undefined}/>
                </div>
            </div>
        )
    }

    return (<>{renderComponent()}</>);
}

export default PolicyDetails;
