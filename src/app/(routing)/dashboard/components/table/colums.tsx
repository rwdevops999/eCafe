import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Button } from "@/components/ui/button";
import { TaskData } from "@/types/ecafe";
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

const renderLink = (str: string): ReactNode => {
    return (
        <div className="-p-2 flex items-center h-[8px] underline text-blue-400">
            <Link href="">{str}</Link>
        </div>
    );
};

export const columns: ColumnDef<TaskData>[] = [
    {
        accessorKey: 'taskId',

        header: ({ column }) => (
            <>Task ID</>
        ),

        cell: ({ row, getValue }) => {
            const isOpen: boolean = row.original.status === "open";

            console.log("STATUS", row.original.id, isOpen);


            return(
                (isOpen ? renderLink(getValue<string>()) : renderNormal(getValue<string>()))
                // {isOpen ?
                //     <div className="-p-2 flex items-center h-[8px] underline text-blue-400">
                //         <Link href="">{getValue<string>()}</Link>
                //     </div> :
                //     <></>
                // }
            )
        },

        footer: props => props.column.id,
    },
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
