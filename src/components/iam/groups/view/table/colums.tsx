import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { access } from "@/data/iam-scheme";
import { ColumnDef, RowData, Table } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { Data } from "@/lib/mapping";
import { log } from "@/lib/utils";

declare module '@tanstack/table-core' {
    export interface TableMeta<TData extends RowData> {
        handleAction: (action: string, id: any) => void
    }

  export interface DataTableToolbarProps<TData> {
    table: Table<TData>
  }
}

export const columns: ColumnDef<Data>[] = [
    {
        accessorKey: 'name',

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),

        cell: ({row, getValue}) => {
            return (
                <div
                style={{
                  paddingLeft: `${row.depth * 4}rem`,
                }}
              >
                {row.original.name}
                  {/* <div className="flex items-center h-[10px]">
                  {row.original.children?.length > 0 ? (
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
                </div> */}
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

