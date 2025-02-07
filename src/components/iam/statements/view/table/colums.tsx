import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { Data } from "@/types/ecafe";

export const columns: ColumnDef<Data>[] = [
    {
        accessorKey: 'name',

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Statements" />
        ),

        cell: ({row, getValue}) => {
            return (
                <div style={{paddingLeft: `${row.depth * 4}rem`}}>
                    <div className="flex items-center h-[10px]">
                        {row.original.children && row.original.children?.length > 0 ? (
                            <Button variant="ghost" className="border-0 hover:bg-muted/10"
                            {...{
                                onClick: row.getToggleExpandedHandler(),
                            }}
                            >
                                {row.getIsExpanded() ? '📭' : '📬'}
                            </Button>
                        ) : ('⚙️')}&nbsp;
                            {row.original.name}
                            {row.depth == 1 ? (
                                <Badge 
                                    className={`ml-2 text-foreground/50 ${row.original.other?.access === 'Allow' ? 'text-green-500' : 'text-red-500'}`}
                                    variant="outline">
                                        {row.original.other?.access}
                                </Badge>) : null}&nbsp;
                            {row.original.other?.managed ? 'Ⓜ️' : ''}
                    </div>
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
            <>Description</>
        ),

        cell: ({row, getValue}) => {
            return ((row.depth === 0 ? 
                <div
                    style={{
                      paddingLeft: `${row.depth * 4}rem`,
                    }}
                >
                    {row.original.description}
                </div>
            : null));
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

