"use client"

import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table"
import { ArrowDown, ArrowRight, ArrowUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTableFacetedFilter } from "@/components/datatable/data-table-faceted-filter"
import { access } from "@/data/iam-scheme"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}


export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("access") && (
          <DataTableFacetedFilter
            column={table.getColumn("access")}
            title="Access"
            options={access}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
    </div>
  )
}
