import TabItems from "@/components/iam/components/tab-items"
import { cancelButton, createButton, issuer_groups, Meta, updateButton, validateButton } from "./data/meta"
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { mapGroupsToData } from "@/lib/mapping";
import { handleLoadGroups } from "@/lib/db";
import { GroupType, UserType } from "@/data/iam-scheme";
import { log } from "@/lib/utils";

const TabGroups = ({meta, user}:{meta: Meta; user: UserType|undefined;}) => {
  const { toast, dismiss } = useToast();
  let toastId: string;

  if (meta.submitForm) {
    console.log("TabGroups: SF defined");
  }

  const [metaForGroups, setMetaForGroups] = useState<Meta>();

  const renderToast = () => {
      let {id} = toast({title: "Groups", description: "loading ..."})
      toastId = id;
  }

  const groupsLoadedCallback = (_data: GroupType[]) => {
    let mappedGroups = mapGroupsToData(_data);

    if (meta.form?.getValues) {
      console.log("TabGroups: groupsLoadedCallback1: GetValues defined");
    }

    meta.buttons = [validateButton, (user ? updateButton : createButton), cancelButton]
    meta.items = {
      issuer: issuer_groups,
      title: "Assign user to groups",
      columnname: "Groups",
      data: mappedGroups,
      setSelection: meta.items?.setSelection,
      getSelection: meta.items?.getSelection,
      validateItems: meta.items?.validateItems,
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