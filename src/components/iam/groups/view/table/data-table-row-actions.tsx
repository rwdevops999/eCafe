"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Row, Table } from "@tanstack/react-table"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { action_delete, action_update } from "@/data/constants"
import { Data } from "@/lib/mapping"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  table: Table<TData>
}

export function DataTableRowActions<TData>({
  row,
  table,
}: DataTableRowActionsProps<TData>) {

  const handleDelete = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const group: Data = row.original as Data;
    const meta = table.options.meta;
    meta?.handleAction(action_delete, group);
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <Trash2 className="cursor-pointer w-[16px] h-[16px]" onClick={(e) => handleDelete(e)}/>
  )
}
