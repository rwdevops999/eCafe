import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import IndeterminateCheckbox from "@/components/ecafe/indeterminate-checkbox";
import { Badge } from "@/components/ui/badge";
import { Data } from "@/lib/mapping";
import { log } from "@/lib/utils";
import { ColumnDef, RowData, Table } from "@tanstack/react-table";

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
        accessorKey: 'name',

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Statements" />
        ),

        cell: ({row, getValue}) => {
            return (
                <div style={{paddingLeft: `${row.depth * 4}rem`}}>
                    <div className="flex items-center h-[10px]">
                        <Badge className="ml-2 text-foreground/50" variant="outline">{row.original.other?.serviceName}</Badge>&nbsp;
                        {getValue<string>()}
                        <Badge className={`ml-2 text-foreground/50 ${row.original.other?.access === 'Allow' ? 'text-green-500' : 'text-red-500'}`} variant="outline">
                            {row.original.other?.access}
                        </Badge>
                    </div>
                </div>
            );
        },

        footer: props => props.column.id,
    },
]

