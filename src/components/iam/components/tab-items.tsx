'use client'

import PageTitle from "@/components/ecafe/page-title"
import { Separator } from "@/components/ui/separator"
import { Meta } from "../users/manage/tabs/data/meta"
import ActionButtons from "../users/manage/components/action-buttons"
import { DataTable } from "@/components/datatable/data-table"

import { ColumnMeta, RowData, TableMeta } from "@tanstack/react-table"
import { columns } from "./table/colums"
import { Data } from "@/lib/mapping"
import { useEffect, useState } from "react"

const TabItems = ({meta}:{meta:Meta}) => {
  const [itemCount, setItemCount] = useState<number>(0);

  const tableMeta: TableMeta<Data[]> = {
    title: meta.items?.columnname
  };

  const handleChangeSelection = (selection: any[]) => {
    if (meta.items && meta.items.setSelection) {
      meta.items.setSelection(meta.items.issuer!, selection);
      setItemCount(selection.length);
    }
  }

  return (
    <>
        <PageTitle className="m-2" title={meta.items?.title!} />
        <Separator />

        <div className="grid grid-cols-12">
            <div className="col-span-11 space-y-1">
                <DataTable columns={columns} data={meta.items?.data!} tablemeta={tableMeta} handleChangeSelection={handleChangeSelection}/>
            </div>
            <div className=" flex justify-end">
            <ActionButtons _meta={(meta)} itemCount={itemCount}/>
            </div>
        </div>
    </>
  )
}

export default TabItems