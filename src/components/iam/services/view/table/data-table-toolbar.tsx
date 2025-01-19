"use client"

import { DataTableToolbarProps, Table } from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const handleChangeEvent = (e: any) => {
    table.getColumn("name")!.setFilterValue(e.target.value);
  }

  return (
    <div className="ml-2 flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter ..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => handleChangeEvent(event)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
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
