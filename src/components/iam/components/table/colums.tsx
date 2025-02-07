import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import IndeterminateCheckbox from "@/components/ecafe/indeterminate-checkbox";
import { Data } from "@/types/ecafe";

export const columns: ColumnDef<Data>[] = [
    {
        accessorKey: 'id',

        header: ({ column, header, table }) => (
            <>ID</>
        ),

        cell: ({row, getValue}) => {
            {row.original.id}
        },
    },
    {
        accessorKey: 'name',

        header: ({ column, header, table }) => (
            <div className="flex w-[300px]">
                <IndeterminateCheckbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                }}
                />
                <DataTableColumnHeader column={column} title={table.options.meta?.title!}/>
            </div>
        ),

        cell: ({row, getValue}) => {
            return (
                <div className="w-[300px]" style={{paddingLeft: `${row.depth * 4}rem`}}>
                    <IndeterminateCheckbox
                        className="mr-4"
                        {...{
                        checked: row.getIsSelected(),
                        indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                    {row.original.name}
                </div>
            );
        },

        filterFn: (row, id, value) => {
            return row.original.name.includes(value);
        },

        footer: props => props.column.id,
    },
    {
        accessorKey: 'description',

        header: ({ column }) => (
            <>Description</>
        ),

        cell: ({row, getValue}) => {
            return (<>{getValue<string>()}</>);
        },

        footer: props => props.column.id,
    },
]

