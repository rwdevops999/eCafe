import { Button } from "@/components/ui/button";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Data } from "@/lib/mapping";
import { log } from "@/lib/utils";

export const columns: ColumnDef<Data>[] = [
    {
        accessorKey: "name",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Actions" />
          ),
      
        cell: ({row, getValue}) => {
          return (
            <div
            style={{
              paddingLeft: `${row.depth * 4}rem`,
            }}
          >
            <div className="flex items-center h-[10px]">
              {row.original.children?.length > 0 ? (
                <Button variant="ghost" className="border-0 hover:bg-muted/10"
                {...{
                    onClick: row.getToggleExpandedHandler(),
                }}
            >
            {row.getIsExpanded() ? '📭' : '📬'}
            </Button>
          ) : ('')}
              {row.original.name}
            </div>
            </div>
        );
        },

        footer: props => props.column.id,
    },
]
