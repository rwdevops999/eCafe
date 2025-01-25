import { Button } from "@/components/ui/button";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Data } from "@/lib/mapping";
import { cn, log } from "@/lib/utils";

export const columns: ColumnDef<Data>[] = [
    {
        accessorKey: "name",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Action"/>
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
              <div className="text-foreground">
                {row.original.name}
              </div>
            </div>
            </div>
        );
        },

        footer: props => props.column.id,
    },
    {
      accessorKey: "description",

      header: ({ column }) => (
          <>Type</>
        ),
    
      cell: ({row, getValue}) => {
        let color: string = "text-foreground";
        if (getValue() === "ERROR") {
          color = "text-red-500";
        }
        
        return (
          <div className={cn("flex items-center h-[10px]", color)}>
            {getValue<string>()}
          </div>
      );
      },

      footer: props => props.column.id,
  }
]
