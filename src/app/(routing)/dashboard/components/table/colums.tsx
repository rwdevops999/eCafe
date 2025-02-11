import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Button } from "@/components/ui/button";
import { TaskData } from "@/types/ecafe";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<TaskData>[] = [
    {
        accessorKey: 'name',

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tasks" />
        ),

        cell: ({ row, getValue }) => {
            return(
                <div className="-p-2 flex items-center ml-5 h-[8px]">
                    {getValue<string>()}
                </div>
            )
        },

        footer: props => props.column.id,
    },
    {
        accessorKey: 'description',

        header: ({ column }) => (
            <>Description</>
        ),

        cell: ({ row, getValue }) => {
            return(
                <div className="-p-2 flex items-center h-[8px]">
                    {getValue<string>()}
                </div>
            )
        },

        footer: props => props.column.id,
    },
    {
        accessorKey: 'type',

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),

        cell: ({ row, getValue }) => {
            return(
                <div className="-p-2 flex items-center ml-5 h-[8px]">
                    {getValue<string>()}
                </div>
            )
        },

        footer: props => props.column.id,
    },
    {
        accessorKey: 'status',

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),

        cell: ({ row, getValue }) => {
            let statusColor = "text-green-500";

            if (row.original.status === "open") {
                statusColor = "text-red-500";
            }

            return(
                <div className={`flex items-center ml-5 h-[8px] ${statusColor}`}>
                    {getValue<string>()}
                </div>
            )
        },

        footer: props => props.column.id,
    },
]
