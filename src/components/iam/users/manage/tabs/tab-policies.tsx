import TabItems from "@/components/iam/components/tab-items";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { cancelButton, createButton, issuer_policies, Meta, updateButton, validateButton } from "./data/meta";
import { Data, mapPoliciesToData } from "@/lib/mapping";
import { ColumnMeta, RowData } from "@tanstack/react-table"
import { handleLoadPolicies } from "@/lib/db";
import { PolicyType, UserType } from "@/data/iam-scheme";
import { log } from "@/lib/utils";

const TabPolicies = ({meta}:{meta: Meta<any>;}) => {
  const { toast, dismiss } = useToast();
  let toastId: string;

  const [metaForTabPolicies, setMetaForTabPolicies] = useState<Meta<any>>();

  const renderToast = () => {
      let {id} = toast({title: "Policies", description: "loading ..."})
      toastId = id;
  }

  const policiesLoadedCallback = (_data: PolicyType[]) => {
    let mappedPolicies: Data[] = mapPoliciesToData(_data, 2);

    meta.buttons = [validateButton, (meta.subject ? updateButton : createButton), cancelButton]
    meta.items ? meta.items.issuer = issuer_policies : meta.items = {issuer: issuer_policies};
    meta.items ? meta.items.title = "Assign policies to user" : meta.items = {title: "Assign policies to user"};
    meta.items ? meta.items.columnname = "Policies" : meta.items = {columnname: "Policies"};
    meta.items ? meta.items.data = mappedPolicies : meta.items = {data: mappedPolicies};

    setMetaForTabPolicies(meta);
    meta.changeMeta ? meta.changeMeta(meta) : (_meta: Meta<any>) => {}

    dismiss(toastId);
  }

  useEffect(() => {
    renderToast();
    handleLoadPolicies(policiesLoadedCallback);
  }, [])

  const renderComponent = () => {
    if (metaForTabPolicies) {
      return (
        <TabItems meta={metaForTabPolicies}/>
      );
    }

    return null;
  }

  return (<>{renderComponent()}</>)
}

export default TabPolicies;