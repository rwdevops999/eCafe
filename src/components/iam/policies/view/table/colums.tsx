import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTableRowActions } from "./data-table-row-actions";
import { Data } from "@/lib/mapping";

export const columns: ColumnDef<Data>[] = [
    {
        accessorKey: 'name',

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Policies" />
        ),

        cell: ({row, getValue}) => {
            return (
                <div
                style={{
                  paddingLeft: `${row.depth * 4}rem`,
                }}
              >
                <div className="flex items-center h-[10px]">
                {row.original.children && row.original.children?.length > 0 ? (
                    <Button variant="ghost" className="border-0 hover:bg-muted/10"
                    {...{
                        onClick: row.getToggleExpandedHandler(),
                    }}
                >
                {row.getIsExpanded() ? '📭' : '📬'}
                </Button>
              ) : ('')}&nbsp;{row.depth === 1 ? 
                    <Link className="text-blue-400 underline" href={`http://localhost:3000/iam/statements/service=${row.original.other?.serviceId}&sid=${row.original.name}`}>{row.original.name}</Link>
                    :  row.original.name}
                  &nbsp;
                  {row.original.other?.managed ? 'Ⓜ️' : ''}
                </div>
                </div>
            );
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
                <div className="flex items-center h-[10px]">
                    {getValue<string>()}
                </div>
            )
        },

        footer: props => props.column.id,
    },
    {
        id: "actions",
        cell: ({ table, row }) => {
            if (row.depth === 0) {
                return(
                    <div className="h-[10px]">
                        <DataTableRowActions row={row} table={table}/>
                    </div>
                );
            }
        },
    },
]
