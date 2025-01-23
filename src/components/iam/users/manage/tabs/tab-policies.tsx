import TabItems from "@/components/iam/components/tab-items";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { cancelButton, createButton, issuer_policies, Meta, updateButton, validateButton } from "./data/meta";
import { Data, mapPoliciesToData } from "@/lib/mapping";
import { ColumnMeta, RowData } from "@tanstack/react-table"
import { handleLoadPolicies } from "@/lib/db";
import { PolicyType, UserType } from "@/data/iam-scheme";
import { log } from "@/lib/utils";

const TabPolicies = ({meta, user}:{meta: Meta; user: UserType|undefined}) => {
  const { toast, dismiss } = useToast();
  let toastId: string;

  const [metaForPolicies, setMetaForPolicies] = useState<Meta>();

  const renderToast = () => {
      let {id} = toast({title: "Policies", description: "loading ..."})
      toastId = id;
  }

  const policiesLoadedCallback = (_data: PolicyType[]) => {
    let mappedPolicies: Data[] = mapPoliciesToData(_data, 2);

    meta.buttons = [validateButton, (user ? updateButton : createButton), cancelButton]
    meta.items = {
      issuer: issuer_policies,
      title: "Assign policies to user",
      columnname: "Policies",
      data: mappedPolicies,
      setSelection: meta.items?.setSelection,
      getSelection: meta.items?.getSelection,
      validateItems: meta.items?.validateItems,
    }
    setMetaForPolicies(meta);

    dismiss(toastId);
  }

  useEffect(() => {
    renderToast();
    handleLoadPolicies(policiesLoadedCallback);
  }, [])

  const renderComponent = () => {
    if (metaForPolicies) {
      return (
        <TabItems meta={metaForPolicies}/>
      );
    }

    return null;
  }

  return (<>{renderComponent()}</>)
}

export default TabPolicies;