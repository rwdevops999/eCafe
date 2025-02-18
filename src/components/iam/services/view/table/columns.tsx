import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Data } from "@/types/ecafe";

export const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "name",

      size: 1280,

      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
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
              ) : ('')}
                {row.original.name}
            </div>
          </div>
        );
      },

      footer: props => props.column.id,
    },
]
