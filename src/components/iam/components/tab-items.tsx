'use client'

import PageTitle from "@/components/ecafe/page-title"
import { Separator } from "@/components/ui/separator"
import ActionButtons from "../users/manage/components/action-buttons"
import { DataTable } from "@/components/datatable/data-table"

import { ColumnMeta, Row, RowData, TableMeta } from "@tanstack/react-table"
import { columns } from "./table/colums"
import { Data } from "@/lib/mapping"
import { useEffect, useState } from "react"
import { log } from "@/lib/utils"
import { MetaBase } from "@/data/meta"
import { FormSchemaType } from "../users/manage/tabs/data/meta"
import { FieldValues } from "react-hook-form"

const TabItems = <T extends FieldValues,>({meta}:{meta:MetaBase<T>}) => {
  const [validateEnabled, setValidateEnabled] = useState<boolean>(false);

  const tableMeta: TableMeta<Data[]> = {
    title: meta.items?.columnname
  };

  const handleChangeSelection = (selection: Row<Data>[]) => {
    if (meta.items && meta.items.setSelection) {
      meta.items.setSelection(meta.items.issuer!, selection.map((row) => row.original));
      setValidateEnabled(selection.length > 0);
    }
  }

  const handleGetSelection = (): number[] => {
    if (meta.items && meta.items.getSelection) {
      const selected: Data[] = meta.items.getSelection(meta.items.issuer!);
      const ids: number[] = selected.map((_select: Data) => _select.id);
      return ids;
    }

    return [];
  }

  const renderComponent = () => {
    return (
      <>
          <PageTitle className="m-2" title={meta.items?.title!} />
          <Separator />
  
          <div className="grid grid-cols-12">
              <div className="col-span-11 space-y-1">
                  <DataTable id="TabItemTable" columns={columns} data={meta.items?.data!} tablemeta={tableMeta} handleChangeSelection={handleChangeSelection} selectedItems={handleGetSelection()} />
              </div>
              <div className=" flex justify-end">
              <ActionButtons _meta={meta} validateEnabled={validateEnabled}/>
              </div>
          </div>
      </>
    )
  };

  return (<>{renderComponent()}</>);
}

export default TabItems