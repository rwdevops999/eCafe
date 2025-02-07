"use client"

import { Row, Table } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"
import { action_delete } from "@/data/constants"
import { Data } from "@/types/ecafe"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  table: Table<TData>
}

export function DataTableRowActions<TData>({
  row,
  table
}: DataTableRowActionsProps<TData>) {

  const handleDelete = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const policy: Data = row.original as Data;
    const meta = table.options.meta;
    (meta && meta.handleAction ? meta.handleAction(action_delete, policy) : () => {});
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <Trash2 className="cursor-pointer w-[16px] h-[16px]" onClick={(e) => handleDelete(e)}/>
  );
}
