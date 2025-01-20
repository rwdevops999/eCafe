'use client'

import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import ManageGroupDialog from "../manage/manage-group-dialog";
import { useState } from "react";
import { GroupType } from "@/data/iam-scheme";

const GroupDetails = ({_selectedGroup}:{_selectedGroup: string | undefined}) => {
  console.log("GroupDetails IN");

  const [group, setGroup] = useState<GroupType|undefined>();
  
  const handleReset = () => {
    setGroup(undefined);
  }

  const renderComponent = () => {
    return (
      <div>
        <PageBreadCrumbs crumbs={[{name: "iam"}, {name: "users", url: "/iam/groups"}]} />
        <PageTitle className="m-2" title={`Overview user groups`} />

        <div className="flex items-center justify-end">
          <ManageGroupDialog _enabled={true} group={group} handleReset={handleReset}/>
          {/* _enabled={true} user={user} handleReset={handleReset} setReload={setReload}/>  */}
        </div>
        {/* <div className="block space-y-5">
          <DataTable data={usersData} columns={columns} tablemeta={meta} Toolbar={DataTableToolbar} rowSelecting enableRowSelection={false}/>
        </div> */}
        </div>
      );
  }

  return (<>{renderComponent()}</>);
}

export default GroupDetails;