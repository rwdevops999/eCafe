import TabItems from "@/components/iam/components/tab-items"
import { cancelButton, createButton, issuer_groups, Meta, updateButton, validateButton } from "./data/meta"
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { mapGroupsToData } from "@/lib/mapping";
import { handleLoadGroups } from "@/lib/db";
import { GroupType, UserType } from "@/data/iam-scheme";
import { log } from "@/lib/utils";

const TabGroups = ({meta}:{meta: Meta;}) => {
  const { toast, dismiss } = useToast();
  let toastId: string;

  const [metaForTabGroups, setMetaForTabGroups] = useState<Meta>();

  const renderToast = () => {
      let {id} = toast({title: "Groups", description: "loading ..."})
      toastId = id;
  }

  const groupsLoadedCallback = (_data: GroupType[]) => {
    let mappedGroups = mapGroupsToData(_data);

    let createMode: boolean = (meta.subject === undefined);
    if (! createMode) {
      createMode = (meta.subject.id === 0);
    }

    meta.buttons = [validateButton, createMode ? createButton : updateButton, cancelButton]
    meta.items ? meta.items.issuer = issuer_groups : meta.items = {issuer: issuer_groups};
    meta.items ? meta.items.title = "Assign user to groups" : meta.items = {title: "Assign user to groups"};
    meta.items ? meta.items.columnname = "Groups" : meta.items = {columnname: "Groups"};
    meta.items ? meta.items.data = mappedGroups : meta.items = {data: mappedGroups};

    setMetaForTabGroups(meta);
    meta.changeMeta ? meta.changeMeta(meta) : (_meta: Meta) => {}

    dismiss(toastId);
  }

  useEffect(() => {
    renderToast();
    handleLoadGroups(groupsLoadedCallback);
  }, [])

  const renderComponent = () => {
    if (metaForTabGroups) {
      return (
        <TabItems meta={metaForTabGroups}/>
      );
    }

    return null;
  }

  return (<>{renderComponent()}</>);
}

export default TabGroups;