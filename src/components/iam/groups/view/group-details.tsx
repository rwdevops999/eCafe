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
import { cloneObject, js } from "@/lib/utils";
import { Data, GroupType } from "@/types/ecafe";
import { initGroupMeta, Meta } from "../meta/meta";
import { mapGroupsToData } from "@/lib/mapping";
import { handleDeleteGroup, handleLoadGroups } from "@/lib/db";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import { useDebug } from "@/hooks/use-debug";
import { ApiResponseType } from "@/types/db";

const GroupDetails = ({_selectedGroup}:{_selectedGroup: string | undefined}) => {
  const {debug} = useDebug();
  
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const [loader, setLoader] = useState<boolean>(false);

  const [reloadState, setReloadState] = useState<number>(0);
  const [rerender, setRerender] = useState<number>(0);

  const [dialogState, setDialogState] = useState<boolean>(false);

  const groupsRef = useRef<GroupType[]>([]);
  const groupsDataRef = useRef<Data[]>([]);

  const metaGroupDetails = useRef<Meta>(initGroupMeta);

  const setSelectedGroup = (_group: GroupType|undefined) => {
    metaGroupDetails.current.currentSubject = _group;
  }

  const groupsLoadedCallback = (_data: ApiResponseType) => {
    if (_data.status === 200) {
      const groups: GroupType[] = _data.payload;

      groupsRef.current = groups

      setSelectedGroup(undefined);

      groupsDataRef.current = mapGroupsToData(groups);
      setRerender((x:any) => x+1);
    }

    setLoader(false);
  }

  const handleDialogState = (open: boolean) => {
    if (! open) {
      setSelectedGroup(undefined);
    }    

    setDialogState(open)
  }

  useEffect(() => {
    metaGroupDetails.current.control.handleDialogState = handleDialogState;

    setLoader(true);
    handleLoadGroups(groupsLoadedCallback);
  }, []);

  useEffect(() => {
    setLoader(true);
    handleLoadGroups(groupsLoadedCallback);
  }, [reloadState, setReloadState]);

  const groupDeletedCallback = (_data: ApiResponseType) => {
    if (_data.status === 200) {
      setSelectedGroup(undefined);
      setLoader(true);
      handleLoadGroups(groupsLoadedCallback);
    }
  }

  const handleAction = (_action: string, _group: Data) => {
    if (_action === action_delete) {
      handleDeleteGroup(_group.id, groupDeletedCallback);
    } else {
      const selectedGroup: GroupType = groupsRef.current.find((group) => group.id === _group.id)!;
      setSelectedGroup(selectedGroup);
      setDialogState(true);
    }
  }

  // // create TableMeta for handling actions
  const tablemeta: TableMeta<Data[]> = {
    handleAction: handleAction,
  };

  const renderComponent = () => {
    if  (groupsDataRef && metaGroupDetails) {
      return (
        <div>
          <PageBreadCrumbs crumbs={[{name: "ecafé", url: "/"}, {name: "iam"}, {name: "groups", url: "/iam/groups"}]} />
          <div className="flex space-x-2 items-center">
            <PageTitle className="m-2" title={`Overview group`} />
            <EcafeLoader className={loader ? "" : "hidden"}/>
          </div>

          {!loader &&
            <div className="flex items-center justify-end">
              <GroupDialog _open={dialogState}  _meta={cloneObject(metaGroupDetails.current)} _setReload={setReloadState}/>
            </div>
          }

          {groupsDataRef.current &&
            <div className="block space-y-5">
              <DataTable data={groupsDataRef.current} columns={columns} tablemeta={tablemeta} Toolbar={DataTableToolbar} rowSelecting enableRowSelection={false}/>
            </div>
          }
        </div>
      );
    }

    return null;
  };

  return (<>{renderComponent()}</>);
}

export default GroupDetails;