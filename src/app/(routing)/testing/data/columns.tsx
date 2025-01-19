"use client"

import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header"
import { ColumnDef, RowData, Table } from "@tanstack/react-table"
import { access } from "@/data/iam-scheme"

declare module '@tanstack/table-core' {
  export interface TableMeta<TData extends RowData> {
  }

  export interface DataTableToolbarProps<TData> {
    table: Table<TData>
  }
}

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("firstname")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "access",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Access" />
    ),
    cell: ({ row }) => {
      const _access = access.find(
        (acc) => acc.label === row.getValue("access")
      )

      if (!_access) {
        return null
      }

      return (
        <div className="flex items-center">
          <span>{_access.value}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]
