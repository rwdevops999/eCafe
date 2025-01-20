import PageTitle from "@/components/ecafe/page-title"
import { Separator } from "@/components/ui/separator"
import { Meta } from "../users/manage/tabs/data/meta"
import ActionButtons from "../users/manage/components/action-buttons"
import { DataTable } from "@/components/datatable/data-table"

import { ColumnMeta, RowData, TableMeta } from "@tanstack/react-table"
import { columns } from "./table/colums"
import { Data } from "@/lib/mapping"

const TabItems = ({meta}:{meta:Meta}) => {

  const tableMeta: TableMeta<Data[]> = {
    title: meta.items?.columnname
  };

  return (
    <>
        <PageTitle className="m-2" title={meta.items?.title!} />
        <Separator />

        <div className="grid grid-cols-12">
            <div className="col-span-11 space-y-1">
                <DataTable columns={columns} data={meta.items?.data!} tablemeta={tableMeta}/>
            </div>
            <div className=" flex justify-end">
            <ActionButtons _meta={meta}/>
            </div>
        </div>
    </>
  )
}

export default TabItems