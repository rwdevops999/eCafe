import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { Data } from "@/types/ecafe";

export const columns: ColumnDef<Data>[] = [
    {
        accessorKey: 'name',

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),

        cell: ({row, getValue}) => {
            return (
                <div style={{paddingLeft: `${row.depth * 4}rem`}}>
                    {row.original.name}
                </div>
            );
        },

        filterFn: (row, id, value) => {
            return value.includes(row.original.other?.access);
        },

        footer: props => props.column.id,
    },
    {
        accessorKey: 'description',

        header: ({ column }) => (
            <>Firstname</>
        ),

        cell: ({row, getValue}) => {
            return (<>{getValue<string>()}</>);
        },

        filterFn: (row, id, value) => {
            return value.includes(row.original.other?.access);
        },

        footer: props => props.column.id,
    },
    {
        id: "actions",

        cell: ({ table, row }) => {
            return (
                <div className="flex items-center h-[10px]">
                    {row.depth === 0 && <DataTableRowActions row={row} table={table}/>}
                </div>
            );
        }
    },
]
