import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
      handleAction?: (action: string, id: any) => void
      title?: string
  }
  
  interface ColumnMeta<TData, TValue> {
    title: string;
  }

  interface DataTableToolbarProps<TData> {
    table: Table<TData>
  }
  
}