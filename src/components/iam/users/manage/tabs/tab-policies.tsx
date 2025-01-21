import TabItems from "@/components/iam/components/tab-items";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { assignButton, cancelButton, issuer_policies, Meta, validateButton } from "./data/meta";
import { Data, mapPoliciesToData } from "@/lib/mapping";
import { ColumnMeta, RowData } from "@tanstack/react-table"
import { handleLoadPolicies } from "@/lib/db";
import { PolicyType } from "@/data/iam-scheme";
import { log } from "@/lib/utils";

const TabPolicies = ({meta}:{meta: Meta}) => {
  const { toast, dismiss } = useToast();
  let toastId: string;

  const [metaForPolicies, setMetaForPolicies] = useState<Meta>();

  const renderToast = () => {
      let {id} = toast({title: "Policies", description: "loading ..."})
      toastId = id;
  }

  const policiesLoadedCallback = (_data: PolicyType[]) => {
    let mappedPolicies = mapPoliciesToData(_data, 2);

    meta.buttons = [validateButton, assignButton, cancelButton]
    meta.items = {
      issuer: issuer_policies,
      title: "Assign policies to user",
      columnname: "Policies",
      data: mappedPolicies,
      setSelection: meta.items?.setSelection,
      validateItems: meta.items?.validateItems,
      showPrimeTab: meta.items?.showPrimeTab
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