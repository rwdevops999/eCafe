import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import IndeterminateCheckbox from "@/components/ecafe/indeterminate-checkbox";
import { Data } from "@/types/ecafe";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Data>[] = [
    {
      id: "select",

      header: ({ header, table }) => {
        return (
          <div className="w-1">
            <IndeterminateCheckbox
              {...{
                  checked: table.getIsAllRowsSelected(),
                  indeterminate: table.getIsSomeRowsSelected(),
                  onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          </div>
        );
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
        <DataTableColumnHeader column={column} title="Policies" />
      ),

      cell: ({row, getValue}) => {
        return (
          <div className="flex items-center h-[10px] ml-4">
            {getValue<string>()}
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

      cell: ({row, getValue}) => {
          return (
            <div className="flex items-center h-[10px]">
              {getValue<string>()}
            </div>
          );
      },

      footer: props => props.column.id,
  },
]
