import TabItems from "@/components/iam/components/tab-items"
import { assignButton, cancelButton, issuer_groups, Meta, validateButton } from "./data/meta"
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Data, mapGroupsToData } from "@/lib/mapping";
import { ColumnMeta } from "@tanstack/react-table";
import { handleLoadGroups } from "@/lib/db";
import { GroupType } from "@/data/iam-scheme";
import { log } from "@/lib/utils";

const TabGroups = ({meta}:{meta: Meta}) => {
  const { toast, dismiss } = useToast();
  let toastId: string;

  const [metaForGroups, setMetaForGroups] = useState<Meta>();

  const renderToast = () => {
      let {id} = toast({title: "Groups", description: "loading ..."})
      toastId = id;
  }

  const groupsLoadedCallback = (_data: GroupType[]) => {
    let mappedGroups = mapGroupsToData(_data);
    meta.buttons = [validateButton, assignButton, cancelButton]
    meta.items = {
      issuer: issuer_groups,
      title: "Assign user to groups",
      columnname: "Groups",
      data: mappedGroups,
      setSelection: meta.items?.setSelection,
      validateItems: meta.items?.validateItems
    }
    setMetaForGroups(meta);

    dismiss(toastId);
  }

  useEffect(() => {
    renderToast();
    handleLoadGroups(groupsLoadedCallback);
  }, [])

  const renderComponent = () => {
    if (metaForGroups) {
      return (
        <TabItems meta={metaForGroups}/>
      );
    }

    return null;
  }

  return (<>{renderComponent()}</>);
}

export default TabGroups;