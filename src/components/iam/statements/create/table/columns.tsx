import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import IndeterminateCheckbox from "@/components/ecafe/indeterminate-checkbox";
import { Button } from "@/components/ui/button";
import { Data } from "@/lib/mapping";
import { ColumnDef, RowData } from "@tanstack/react-table";

export const initialTableState = {
  pagination: {
    pageIndex: 0, //custom initial page index
    pageSize: 10, //custom default page size
  },
}

export const columns: ColumnDef<Data>[] = [
    {
        id: "select",

        header: ({ header, table }) => {
            return (<div className="w-1">
              <IndeterminateCheckbox
                {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                }}
              />
            </div>)
        },

          cell: ({ row }) => (
            <div className="w-1">
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />
            </div>
          ),
  
          enableSorting: false
      },
    {
        accessorKey: "name",

        // filterFn: "includesString",
        
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
