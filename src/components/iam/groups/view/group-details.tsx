'use client'

import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";

const GroupDetails = ({_selectedGroup}:{_selectedGroup: string | undefined}) => {

  const renderComponent = () => {
    return (
      <div>
        <PageBreadCrumbs crumbs={[{name: "iam"}, {name: "users", url: "/iam/groups"}]} />
        <PageTitle className="m-2" title={`Overview user groups`} />

        {/* <div className="flex items-center justify-end">
          <ManageUserDialog _enabled={true} user={user} handleReset={handleReset} setReload={setReload}/> 
        </div>
        <div className="block space-y-5">
          <DataTable data={usersData} columns={columns} tablemeta={meta} Toolbar={DataTableToolbar} rowSelecting enableRowSelection={false}/>
        </div> */}
        </div>
      );
  }

  return (<>{renderComponent()}</>);
}

export default GroupDetails;