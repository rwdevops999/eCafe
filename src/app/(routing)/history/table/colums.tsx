import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import ProgressLink from "@/components/ecafe/progress-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HistoryData, TaskData } from "@/types/ecafe";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ReactNode } from "react";

export const columns: ColumnDef<HistoryData>[] = [
    {
        accessorKey: 'title',

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Entry"/>
        ),

        cell: ({ row, getValue }) => {
            return(
                <div className="flex items-center h-[10px] ml-4">
                    {getValue<string>()}
                </div>
            )
        },

        footer: props => props.column.id,
    },
    {
        accessorKey: 'type',

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" className="-ml-4"/>
        ),

        cell: ({ row, getValue }) => {
            return(
                <div className="flex items-center h-[10px]">
                    <Badge className={`border border-foreground/30 ${row.original.type === 'info' ? 'text-blue-500' : 'text-red-500'}`} variant="outline">
                        {getValue<string>()}
                    </Badge>
                </div>
            )
        },

        filterFn: (row, id, value) => {
            return value.includes(row.original.type);
        },

        footer: props => props.column.id,
    },
    {
        accessorKey: 'description',

        header: ({ column }) => (
            <div className="">
                <>Description</>
            </div>
        ),

        cell: ({ row, getValue }) => {
            return(
                <div className="flex items-center h-[10px]">
                    {getValue<string>()}
                </div>
            )
        },

        footer: props => props.column.id,
    },
    {
        accessorKey: 'originator',

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Originator" className="-ml-4"/>
        ),

        cell: ({ row, getValue }) => {
            return(
                <div className="flex items-center h-[10px]">
                    {getValue<string>()}
                </div>
            )
        },

        footer: props => props.column.id,
    },
    {
        accessorKey: 'date',

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created" className="-ml-4"/>
        ),

        cell: ({ row, getValue }) => {
            const date: string = getValue<string>();

            return(
                <div className="flex items-center h-[10px]">
                    {getValue<string>()}
                </div>
            )
        },

        footer: props => props.column.id,
    },
]
