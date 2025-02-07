 'use client'

import { ConsoleLogger } from "@/lib/console.logger";
import { useEffect, useRef, useState } from "react";
import { action_delete } from "@/data/constants";
import { TableMeta } from "@tanstack/react-table";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./table/colums";
import { DataTableToolbar } from "./table/data-table-toolbar";
import GroupDialog from "../manage/group-dialog";
import { cloneObject } from "@/lib/utils";
import { Data, GroupType } from "@/types/ecafe";
import { initGroupMeta, Meta } from "../meta/meta";
import { mapGroupsToData } from "@/lib/mapping";

const GroupDetails = ({_selectedGroup}:{_selectedGroup: string | undefined}) => {
  const logger = new ConsoleLogger({ level: 'debug' });

  logger.debug("GroupDetails", "IN(_selectedGroup)", _selectedGroup);

  const [reloadState, setReloadState] = useState<number>(0);
  const [rerender, setRerender] = useState<number>(0);

  const [dialogState, setDialogState] = useState<boolean>(false);

  const groupsRef = useRef<GroupType[]>([]);
  const groupsDataRef = useRef<Data[]>([]);

  const metaGroupDetails = useRef<Meta>(initGroupMeta);

  const setSelectedGroup = (_group: GroupType|undefined) => {
    logger.debug("GroupDetails", "setSelectedGroup => META currentSubject", JSON.stringify(_group));
    metaGroupDetails.current.currentSubject = _group;
  }

  const groupsLoadedCallback = (_groups: GroupType[]) => {
    logger.debug("GroupDetails", "groupsLoadedCallback", JSON.stringify(_groups));

    groupsRef.current = _groups

    setSelectedGroup(undefined);

    groupsDataRef.current = mapGroupsToData(_groups);
    setRerender((x:any) => x+1);
  }

  const handleDialogState = (open: boolean) => {
    logger.debug("GroupDetails", "handleDialogState(open)", open);
    if (! open) {
      logger.debug("GroupDetails", "handleDialogState", "Set group to undefined");

      setSelectedGroup(undefined);
    }    

    setDialogState(open)
  }

  useEffect(() => {
    logger.debug("GroupDetails", "USE EFFECT[] => META handleDialogState");
    metaGroupDetails.current.control.handleDialogState = handleDialogState;

    handleLoadGroups(groupsLoadedCallback);
  }, []);

  useEffect(() => {
    logger.debug("GroupDetails", "LOAD GROUPS AFTER RELOAD");

    handleLoadGroups(groupsLoadedCallback);
  }, [reloadState, setReloadState]);

  const groupDeletedCallback = () => {
    setSelectedGroup(undefined);
    handleLoadGroups(groupsLoadedCallback);
  }

  // const [reload, setReload] = useState<number>(0);

  const handleAction = (_action: string, _group: Data) => {
    logger.debug("GroupDetails", "handleAction", _action);
    if (_action === action_delete) {
      logger.debug("GroupDetails", "handleAction", "see VSCODE terminal for API messages");
      handleDeleteGroup(_group.id, groupDeletedCallback);
    } else {
      logger.debug("GroupDetails", "handleAction", _group);
      const selectedGroup: GroupType = groupsRef.current.find((group) => group.id === _group.id)!;
      setSelectedGroup(selectedGroup);
      logger.debug("GroupsDetails", "changeDialogState => true");
      setDialogState(true);
    }
  }

  // // create TableMeta for handling actions
  const tablemeta: TableMeta<Data[]> = {
    handleAction: handleAction,
  };

  const renderComponent = () => {
    if  (groupsDataRef && metaGroupDetails) {
      logger.debug("GroupDetails", "RENDER");
      logger.debug("GroupDetails", ">>> dialogState", dialogState);

      return (
        <div>
          <PageBreadCrumbs crumbs={[{name: "iam"}, {name: "groups", url: "/iam/groups"}]} />
          <PageTitle className="m-2" title={`Overview group`} />

            <div className="flex items-center justify-end">
              <GroupDialog _open={dialogState}  _meta={cloneObject(metaGroupDetails.current)} _setReload={setReloadState}/>
            </div>
            <div className="block space-y-5">
              <DataTable data={groupsDataRef.current} columns={columns} tablemeta={tablemeta} Toolbar={DataTableToolbar} rowSelecting enableRowSelection={false}/>
            </div>
        </div>
      );
    }

    return null;
  };

  return (<>{renderComponent()}</>);
}

export default GroupDetails;