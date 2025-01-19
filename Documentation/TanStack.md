# Abstractions

* Data: the core data array for provisioning the table
* Column Defs: used to configure a column
* Table Instance: the table object
* Row Model: how the 'data' is transformed into useful rows
* Rows: row data
* Cells: the row-column instersection
* Header group: a group of headers
* Header: Asssociated with column def
* Column: the column defs representation

# Features

* Column Faceting: List of unique column values
* Column Filtering: Filtering rows based in column search values

* Global Faceting: List of unique lists of column values for the entire table
* Global Filtering: Filter rows based on search values for the entire table

* Row Paginaton: Paginate rows
* Row selection: Select/deselect rows
* Row sorting: Sort rows by column values

# Installation

npm install @tanstack/react-table --legacy-peer-deps

## DATA

Tables start with your data. Column definitions and rows depend on the shape of the data. Data is an array of objects that will be turned into rows of the table. As generic TDATA is used.

```example
// TData
type User = {
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: string
}
```

### More complex data

type User = {
  name: {
    first: string
    last: string
  }
  info: {
    age: number
    visits: number
  }
}

const columns = [
  {
    header: 'First Name',
    accessorKey: 'name.first',
  },
  {
    header: 'Last Name',
    accessorKey: 'name.last',
  },
  {
    header: 'Age',
    accessorFn: info => info.age, 
  },
  //...
]

## COLUMN DEFINITIONS

Column defs are the single most important part of building a table. They are responsible for:

Building the underlying data model that will be used for everything including sorting, filtering, grouping, etc.
Formatting the data model into what will be displayed in the table
Creating header groups, headers and footers
Creating columns for display-only purposes, eg. action buttons, checkboxes, expanders, sparklines, etc.

## Def Types

* Accessor Columns
  have an underlying data model which means they can be sorted, filtered, grouped, etc.

## Column helpers

createColumnHelper function is exposed from the table core which, when called with a row type, returns a utility for creating different column definition types with the highest type-safety possible.

```example
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const columnHelper = createColumnHelper<Person>()

const defaultColumns = [
  // Display Column
  columnHelper.display({
    id: 'actions',
    cell: props => <RowActions row={props.row} />,
  }),
  // Grouping Column
  columnHelper.group({
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      // Accessor Column
      columnHelper.accessor('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id,
      }),
      // Accessor Column
      columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      }),
    ],
    columnHelper.group({
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      // Accessor Column
      columnHelper.accessor('age', {
        header: () => 'Age',
        footer: props => props.column.id,
      }),
      // Grouping Column
      columnHelper.group({
        header: 'More Info',
        columns: [
          // Accessor Column
          columnHelper.accessor('visits', {
            header: () => <span>Visits</span>,
            footer: props => props.column.id,
          }),
          // Accessor Column
          columnHelper.accessor('status', {
            header: 'Status',
            footer: props => props.column.id,
          }),
          // Accessor Column
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            footer: props => props.column.id,
          }),
        ],
      }),
    ],
  }),
]
```

## Accessor Columns

### Object keys

If your items are objects.

```example
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

columnHelper.accessor('firstName')

// OR

{
  accessorKey: 'firstName',
}
```

### Deep keys

If each of your items is an object with the following shape:

```example
type Person = {
  name: {
    first: string
    last: string
  }
  info: {
    age: number
    visits: number
  }
}

columnHelper.accessor('name.first', {
  id: 'firstName',
})

// OR

{
  accessorKey: 'name.first',
  id: 'firstName',
}
```

### Array indices

If each of your items is an array with the following shape:

```example
type Sales = [Date, number]

columnHelper.accessor(1)

// OR

{
  accessorKey: 1,
}
```

### Accessor functions

```example
columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
  id: 'fullName',
})

// OR

{
  id: 'fullName',
  accessorFn: row => `${row.firstName} ${row.lastName}`,
}
```

## FORMATTING AND RENDERING

### Cell formatting

You can provide a custom cell formatter by passing a function to the cell property and using the props.getValue() function to access your cell's value.

```example
columnHelper.accessor('firstName', {
  cell: props => <span>{props.getValue().toUpperCase()}</span>,
})
```

Cell formatters are also provided the row and table objects, allowing you to customize the cell formatting beyond just the cell value. The example below provides firstName as the accessor, but also displays a prefixed user ID located on the original row object:

```example
columnHelper.accessor('firstName', {
  cell: props => (
    <span>{`${props.row.original.id} - ${props.getValue()}`}</span>
  ),
```

### Header and Footer formatting

Headers and footers do not have access to row data, but still use the same concepts for displaying custom content.

### COLUMN API

Column definitions are plain objects with the following options:

#### id

id: string

The unique identifier for the column

#### accessorKey

The key of the row object to use when extracting the value for the column

accessorKey?: string & typeof TData

#### accessorFn

The accessor function to use when extracting the value for the column from each row.

accessorFn?: (originalRow: TData, index: number) => any

#### columns

The child column defs to include in a group column

columns?: ColumnDef<TData>[]

#### header

The header to display for the column. If a string is passed, it can be used as a default for the column ID. If a function is passed, it will be passed a props object for the header and should return the rendered header value.

header?:
  | string
  | ((props: {
      table: Table<TData>
      header: Header<TData>
      column: Column<TData>
    }) => unknown)

#### footer

The footer to display for the column. If a function is passed, it will be passed a props object for the footer and should return the rendered footer value

footer?:
  | string
  | ((props: {
      table: Table<TData>
      header: Header<TData>
      column: Column<TData>
    }) => unknown)

#### cell

The cell to display each row for the column. If a function is passed, it will be passed a props object for the cell and should return the rendered cell value

cell?:
  | string
  | ((props: {
      table: Table<TData>
      row: Row<TData>
      column: Column<TData>
      cell: Cell<TData>
      getValue: () => any
      renderValue: () => any
    }) => unknown)

## TABLE INSTANCE

This is not the  <table> tag, but the table object that contains the table state and API. It is created by calling the createTable function (useReactTable). It is the main object that  we will interact with.

### Create a table instance

3 options are required for creating a table instance.

* columns
* data
* core row model

>> data: an array of objects with a stable reference. the type that you give your data will be used as a TData.
>> colums: when you define the type of your columns, you should use the same TData type that you used for your data.
>>   Here we will tell TanStack Table how each column should access and/or transform row data with either an accessorKey or accessorFn

```example
const columns: ColumnDef<User>[] = [] //Pass User type as the generic TData type
//or
const columnHelper = createColumnHelper<User>()
```

>> row model: just import the getCoreRowModel

```example
const table = createTable({ columns, data, getCoreRowModel: getCoreRowModel() })
```

### Initialize the table instance

const table = useReactTable({ columns, data, getCoreRowModel: getCoreRowModel() })

#### WHAT IS IN THE TABLE INSTANCE ?

##### Table State

Can be accessed via the table.getState() API. Each table feature registers various states in the table state. For example, the row selection feature registers rowSelection state, the pagination feature registers pagination state, etc.

```example
table.getState().rowSelection //read the row selection state
table.setRowSelection((old) => ({...old})) //set the row selection state
table.resetRowSelection() //reset the row selection state
```

### TABLE API

type useReactTable = <TData extends AnyData>(
  options: TableOptions<TData>
) => Table<TData>

#### OPTIONS

##### data
data: TData[]

The data for the table to display. This array should match the type you provided to table.setRowType<...>

##### columns
type columns = ColumnDef<TData>[]

The array of column defs to use for the table

##### defaultColumn
defaultColumn?: Partial<ColumnDef<TData>>

Default column options to use for all column defs supplied to the table. This is useful for providing default cell/header/footer renderers, sorting/filtering/grouping options, etc. All column definitions passed to options.columns are merged with this default column definition to produce the final column definitions.

##### initialState
initialState?: Partial<
  VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState
>

Use this option to optionally pass initial state to the table

##### state
state?: Partial<
  VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState
>

The state option can be used to optionally control part or all of the table state

##### onStateChange
onStateChange: (updater: Updater<TableState>) => void

The onStateChange option can be used to optionally listen to state changes within the table. If you provide this options, you will be responsible for controlling and updating the table state yourself

##### getCoreRowModel
getCoreRowModel: (table: Table<TData>) => () => RowModel<TData>

Computes and returns the core row model for the table.

##### getSubRows
getSubRows?: (
  originalRow: TData,
  index: number
) => undefined | TData[]

To access the sub rows for any given row.

##### getRowId
getRowId?: (
  originalRow: TData,
  index: number,
  parent?: Row<TData>
) => string

used to derive a unique ID for any given row.

#### API
Available on the tablee object

##### initialState
The resolved initial state of the table

initialState: VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState

##### reset
reset: () => void

reset the table state to the initial state

##### getState
getState: () => TableState

To get the table's current state

##### setState
setState: (updater: Updater<TableState>) => void

to update the table state. It's recommended you pass an updater function in the form of (prevState) => newState to update the state, but a direct object can also be passed

##### getCoreRowModel
getCoreRowModel: () => {
  rows: Row<TData>[],
  flatRows: Row<TData>[],
  rowsById: Record<string, Row<TData>>,
}

Returns the core row model before any processing has been applied

##### getRowModel
getRowModel: () => {
  rows: Row<TData>[],
  flatRows: Row<TData>[],
  rowsById: Record<string, Row<TData>>,
}

Returns the final model after all processing from other used features has been applied.

##### getAllColums
type getAllColumns = () => Column<TData>[]

Returns all columns in the table

##### getAllFlatColumns
type getAllFlatColumns = () => Column<TData>[]

Returns all columns in the table flattened to a single level.

##### getAllLeafColumns
type getAllLeafColumns = () => Column<TData>[]

Returns all leaf-node columns in the table flattened to a single level

##### getColumn
type getColumn = (id: string) => Column<TData> | undefined

Returns a single column by its ID.

##### getHeaderGroups
type getHeaderGroups = () => HeaderGroup<TData>[]

Returns the header groups for the table.

##### getFooterGroups
type getFooterGroups = () => HeaderGroup<TData>[]

Returns the footer groups for the table.

##### getFlatHeaders
type getFlatHeaders = () => Header<TData>[]

Returns a flattened array of Header objects for the table, including parent headers

##### getLeafHeaders
type getLeafHeaders = () => Header<TData>[]

Returns a flattened array of leaf-node Header objects for the table.

## ROW MODEL

Not all code for every single feature is included in the createTable functions/hooks by default. You only need to import and include the code that you will need to correctly generate rows based on the features you want to use.

Row models run under the hood to transform your original data in useful ways that are needed for data grid features like filtering, sorting, grouping, expanding, and pagination.

### Import row models

Only import the row models that you need.

```example
//only import the row models you need
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
}
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getFacetedMinMaxValues: getFacetedMinMaxValues(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  getFilteredRowModel: getFilteredRowModel(),
  getGroupedRowModel: getGroupedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

### Available row models

* getRowModel - This is the main row model that you should use for rendering your table rows markup. It will use all of the other row models to generate the final row model that you will use to render your table rows.

* getCoreRowModel - returns a basic row model that is just a 1:1 mapping of the original data passed to the table.

* getFilteredRowModel - returns a row model that accounts for column filtering and global filtering.

* getGroupedRowModel - returns a row model that applies grouping and aggregation to the data and creates sub-rows.

* getSortedRowModel - returns a row model that has had sorting applied to it.

* getExpandedRowModel - returns a row model that accounts for expanded/hidden sub-rows.

* getPaginationRowModel - returns a row model that only includes the rows that should be displayed on the current page based on the pagination state.

* getSelectedRowModel - returns a row model of all selected rows (but only based on the data that was passed to the table). Runs after getCoreRowModel.

* getFilteredSelectedRowModel - returns a row model of selected rows after column filtering and global filtering. Runs after getFilteredRowModel.

### order of execution

getCoreRowModel -> getFilteredRowModel -> getGroupedRowModel -> getSortedRowModel -> getExpandedRowModel -> getPaginationRowModel -> getRowModel

### row model data structure

Each row model has the rows in 3 formats:

* rows - An array of rows. (console.log(table.getRowModel().rows))
* flatRows: An array of rows, but all sub-rows are flattened into the top level. (console.log(table.getRowModel().flatRows))
* rowsById - An object of rows, where each row is keyed by its id (console.log(table.getRowModel().rowsById['row-id']))

