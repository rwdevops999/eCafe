import TabItems from "@/components/iam/components/tab-items";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { assignButton, cancelButton, Meta, validateButton } from "./data/meta";
import { Data, mapPoliciesToData } from "@/lib/mapping";
import { ColumnMeta, RowData } from "@tanstack/react-table"
import { handleLoadPolicies } from "@/lib/db";

const TabPolicies = ({meta}:{meta: Meta}) => {
  const { toast, dismiss } = useToast();
  let toastId: string;

  const [metaRoles, setMetaRoles] = useState<Meta>();

  const renderToast = () => {
      let {id} = toast({title: "Policies", description: "loading ..."})
      toastId = id;
  }

  const policiesLoadedCallback = (_data: RoleType[]) => {
    let mappedPolicies = mapPoliciesToData(_data);

    meta.buttons = [validateButton, assignButton, cancelButton]
    meta.items = {
      title: "Assign policies to user",
      columnname: "Policies",
      data: mappedPolicies
    }
    setMetaRoles(meta);

    dismiss(toastId);
  }

  const columnMeta: ColumnMeta<Data, string> = {
    title: "Policies"
  };

  useEffect(() => {
    renderToast();
    handleLoadPolicies(policiesLoadedCallback);
  }, [])

  const renderComponent = () => {
    if (metaRoles) {
      return (
        <TabItems meta={metaRoles}/>
      );
    }

    return null;
  }

  return (<>{renderComponent()}</>)
}

export default TabPolicies;