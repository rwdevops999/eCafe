import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HistoryData, TaskData } from "@/types/ecafe";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ReactNode } from "react";

const renderNormal = (str: string): ReactNode => {
    return (
        <div className="-p-2 flex items-center h-[8px]">
            {str}
        </div>
    );
};

const renderLink = (id: number, str: string): ReactNode => {
    return (
        <div className="-p-2 flex items-center h-[8px] underline text-blue-400">
            <Link href={`/task/${id}`}>{str}</Link>
        </div>
    );
};

export const columns: ColumnDef<HistoryData>[] = [
    {
        accessorKey: 'title',

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Entry" />
        ),

        cell: ({ row, getValue }) => {
            return(
                <div className="-p-2 flex items-center ml-4 h-[8px]">
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
        accessorKey: 'originator',

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Originator" />
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
        accessorKey: 'date',

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created" />
        ),

        cell: ({ row, getValue }) => {
            const date: string = getValue<string>();

            return(
                <div className="-p-2 flex items-center ml-5 h-[8px]">
                    {date.replace('T', ' ').slice(0, date.length - 5)}
                </div>
            )
        },

        footer: props => props.column.id,
    },
]
