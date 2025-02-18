"use client"

import { Row, Table } from "@tanstack/react-table"
import { PencilLine, Trash2 } from "lucide-react"
import { action_delete, action_update } from "@/data/constants"
import { Data } from "@/types/ecafe"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  table: Table<TData>
}

export function DataTableRowActions<TData>({
  row,
  table,
}: DataTableRowActionsProps<TData>) {

  const handleDelete = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    console.log("HANDLE DELETE");
    const statement: Data = row.original as Data;
    const meta = table.options.meta;
    (meta && meta.handleAction ? meta.handleAction(action_delete, statement) : () => {});
    event.preventDefault();
    event.stopPropagation();
  }

  const handleUpdate = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    console.log("HANDLE UPDATE");
    const statement: Data = row.original as Data;
    const meta = table.options.meta;
    (meta && meta.handleAction ? meta.handleAction(action_update, statement) : () => {});
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <div className="flex space-x-2">
      <Trash2 width={16} height={16} className="cursor-pointer" onClick={(e) => handleDelete(e)}/>
        <PencilLine width={16} height={16} className="cursor-pointer" onClick={(e) => handleUpdate(e)}/>
    </div>
  )
}
