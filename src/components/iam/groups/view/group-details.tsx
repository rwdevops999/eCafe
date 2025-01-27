'use client'

import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import { FormSchemaType, Meta } from "../manage/tabs/data/meta";
import { GroupType } from "@/data/iam-scheme";
import { Data, mapGroupsToData } from "@/lib/mapping";
import { handleDeleteGroup, handleLoadGroups } from "@/lib/db";
import { action_delete } from "@/data/constants";
import { TableMeta } from "@tanstack/react-table";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import ManageGroupDialog from "../manage/manage-group-dialog";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./table/colums";
import { DataTableToolbar } from "./table/data-table-toolbar";

const GroupDetails = ({_selectedGroup}:{_selectedGroup: string | undefined}) => {
  const { toast, dismiss } = useToast();
  let toastId: string;

  const renderToast = () => {
    let {id} = toast({title: "Loading...", description: "Groups"})
    toastId = id;
  }

  const [metaForGroupDetails, setMetaForGroupDetails] = useState<Meta<FormSchemaType>>();
  const [reload, setReload] = useState<number>(0);
  
  const groups = useRef<GroupType[]>([]);
  const groupsLoaded = useRef<boolean>(false);
  const groupsData = useRef<Data[]>([]);
  
  const [group, setGroup] = useState<GroupType|undefined>();

  const groupsLoadedCallback = (data: GroupType[]) => {
    dismiss(toastId);

    groups.current = data;
    groupsData.current = mapGroupsToData(data);
    groupsLoaded.current = true;
  }
  
  const changeMeta = (meta: Meta<FormSchemaType>) => {
    setMetaForGroupDetails(meta);
    setReload((x: number) => x+1);
  }
  
  useEffect(() => {
    let meta:Meta<FormSchemaType> = {
      sender: "GroupDetails",
      subject: undefined,
      changeMeta: changeMeta,
    }
    setMetaForGroupDetails(meta);

    renderToast();
    handleLoadGroups(groupsLoadedCallback);
  }, []);
  
  useEffect(() => {
    renderToast();
    handleLoadGroups(groupsLoadedCallback);
  }, [reload, setReload]);

  const groupDeletedCallback = () => {
    setGroup(undefined);
    setReload((x:any) => x+1);
  }

  const deleteGroup = (group: Data) => {
    handleDeleteGroup(group.id, groupDeletedCallback);
  }

  const updateGroup = (group: Data) => {
    const selectedGroup: GroupType = groups.current.find((_group) => _group.id === group.id)!;

    setGroup(selectedGroup);
    if (metaForGroupDetails) {
      metaForGroupDetails.subject = selectedGroup;
      setMetaForGroupDetails(metaForGroupDetails);
    }
    
    const button = document.getElementById("groupDialogButton");
    if (button !== null) {
      button.click();
    }
  }

  const handleReset = () => {
    setGroup(undefined);

    if (metaForGroupDetails) {
      metaForGroupDetails.subject = undefined;
      setMetaForGroupDetails(metaForGroupDetails);
      setReload((x: number) => x+1);
    }
  }

  const handleAction = (action: string, group: Data) => {
    if (action === action_delete) {
      deleteGroup(group);
    } else {
      updateGroup(group);
    }
  }

  const tablemeta: TableMeta<Data[]> = {
    handleAction: handleAction,
  };

  const renderComponent = () => {
    if  (groupsData && metaForGroupDetails) {
      return (
      <div>
        <PageBreadCrumbs crumbs={[{name: "iam"}, {name: "groups", url: "/iam/groups"}]} />
        <PageTitle className="m-2" title={`Overview user groups`} />

        <div className="flex items-center justify-end">
          <ManageGroupDialog meta={metaForGroupDetails} _enabled={groupsLoaded.current} handleReset={handleReset} setReload={setReload}/>
        </div>
        <div className="block space-y-5">
          <DataTable data={groupsData.current} columns={columns} tablemeta={tablemeta} Toolbar={DataTableToolbar} rowSelecting enableRowSelection={false}/>
        </div>
        </div>
      );
    }

    return null;
  }

  return (<>{renderComponent()}</>);
}

export default GroupDetails;