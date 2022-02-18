---
title: Data Grid - Columns
---

# Data Grid - Columns

<p class="description">This section goes in details on the aspects of the columns you need to know.</p>

## Column definitions

Grid columns are defined with the `columns` prop.
`columns` expects an array of objects.
The columns should have this type: `GridColDef[]`.

`field` is the only required property since it's the column identifier. It's also used to match with `GridRowModel` values.

```ts
interface GridColDef {
  /**
   * The column identifier. It's used to match with [[GridRowModel]] values.
   */
  field: string;
  …
}
```

{{"demo": "BasicColumnsGrid.js", "bg": "inline"}}

By default, columns are ordered according to the order they are included in the `columns` array.

> ⚠️ The `columns` prop should keep the same reference between two renders.
> The columns are designed to be definitions, to never change once the component is mounted.
> Otherwise, you take the risk of losing the column width state (if resized).
> You can create the array outside of the render function or memoize it.

### Headers

You can configure the headers with:

- `headerName`: The title of the column rendered in the column header cell.
- `description`: The description of the column rendered as tooltip if the column header name is not fully displayed.

{{"demo": "HeaderColumnsGrid.js", "bg": "inline"}}

### Width

By default, the columns have a width of 100px.
This is an arbitrary, easy-to-remember value.
To change the width of a column, use the `width` property available in `GridColDef`.

{{"demo": "ColumnWidthGrid.js", "bg": "inline"}}

### Minimum width

By default, the columns have a minimum width of 50px.
This is an arbitrary, easy-to-remember value.
To change the minimum width of a column, use the `minWidth` property available in `GridColDef`.

{{"demo": "ColumnMinWidthGrid.js", "bg": "inline"}}

### Fluid width

Column fluidity or responsiveness can be achieved by setting the `flex` property in `GridColDef`.

The `flex` property accepts a value between 0 and ∞.
It works by dividing the remaining space in the grid among all flex columns in proportion to their `flex` value.

For example, consider a grid with a total width of 500px that has three columns: the first with `width: 200`; the second with `flex: 1`; and the third with `flex: 0.5`.
The first column will be 200px wide, leaving 300px remaining. The column with `flex: 1` is twice the size of `flex: 0.5`, which means that final sizes will be: 200px, 200px, 100px.

To set a minimum and maximum width for a `flex` column set the `minWidth` and the `maxWidth` property in `GridColDef`.

**Note**

- `flex` doesn't work together with `width`. If you set both `flex` and `width` in `GridColDef`, `flex` will override `width`.
- `flex` doesn't work if the combined width of the columns that have `width` is more than the width of the grid itself. If that is the case a scroll bar will be visible, and the columns that have `flex` will default back to their base value of 100px.

{{"demo": "ColumnFluidWidthGrid.js", "bg": "inline"}}

### Resizing [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

By default, `DataGridPro` allows all columns to be resized by dragging the right portion of the column separator.

To prevent the resizing of a column, set `resizable: false` in the `GridColDef`.
Alternatively, to disable all columns resize, set the prop `disableColumnResize={true}`.

To restrict resizing a column under a certain width set the `minWidth` property in `GridColDef`.

To restrict resizing a column above a certain width set the `maxWidth` property in `GridColDef`.

{{"demo": "ColumnSizingGrid.js", "disableAd": true, "bg": "inline"}}

To capture changes in the width of a column there are two callbacks that are called:

- `onColumnResize`: Called while a column is being resized.
- `onColumnWidthChange`: Called after the width of a column is changed, but not during resizing.

### Value getter

Sometimes a column might not have a corresponding value, or you might want to render a combination of different fields.

To achieve that, set the `valueGetter` attribute of `GridColDef` as in the example below.

```tsx
function getFullName(params) {
  return `${params.row.firstName || ''} ${params.row.lastName || ''}`;
}

const columns: GridColDef[] = [
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'fullName',
    headerName: 'Full name',
    width: 160,
    valueGetter: getFullName,
  },
];
```

{{"demo": "ValueGetterGrid.js", "bg": "inline"}}

The value generated is used for filtering, sorting, rendering, etc. unless overridden by a more specific configuration.

### Value setter

The value setter is to be used when editing rows and it is the counterpart of the value getter.
This enables you to customize how the entered value is stored in the row.
A common use case for it is when the data is a nested structure.
Refer to the [cell editing](/components/data-grid/editing/#saving-nested-structures) documentation to see an example using it.

```tsx
function setFullName(params: GridValueSetterParams) {
  const [firstName, lastName] = params.value!.toString().split(' ');
  return { ...params.row, firstName, lastName };
}

const columns: GridColDef[] = [
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'fullName',
    headerName: 'Full name',
    width: 160,
    valueSetter: setFullName,
  },
];
```

### Value formatter

The value formatter allows you to convert the value before displaying it.
Common use cases include converting a JavaScript `Date` object to a date string or a `Number` into a formatted number (e.g. "1,000.50").

In the following demo, a formatter is used to display the tax rate's decimal value (e.g. 0.2) as a percentage (e.g. 20%).

{{"demo": "ValueFormatterGrid.js", "bg": "inline"}}

The value generated is only used for rendering purposes.
Filtering and sorting do not rely on the formatted value.
Use the [`valueParser`](/components/data-grid/columns/#value-parser) to support filtering.

### Value parser

The value parser allows you to convert the user-entered value to another one used for filtering or editing.
Common use cases include parsing date strings to JavaScript `Date` objects or formatted numbers (e.g. "1,000.50") into `Number`.
It can be understood as the inverse of [`valueFormatter`](/components/data-grid/columns/#value-formatter).

In the following demo, the tax rate is displayed as a percentage (e.g. 20%) but a decimal number is used as value (e.g. 0.2).

{{"demo": "ValueParserGrid.js", "bg": "inline"}}

### Render cell

By default, the grid renders the value as a string in the cell.
It resolves the rendered output in the following order:

1. `renderCell() => ReactElement`
2. `valueFormatter() => string`
3. `valueGetter() => string`
4. `row[field]`

The `renderCell` method of the column definitions is similar to `valueFormatter`.
However, it trades to be able to only render in a cell in exchange for allowing to return a React node (instead of a string).

```tsx
const columns: GridColDef[] = [
  {
    field: 'date',
    headerName: 'Year',
    renderCell: (params: GridRenderCellParams<Date>) => (
      <strong>
        {params.value.getFullYear()}
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginLeft: 16 }}
        >
          Open
        </Button>
      </strong>
    ),
  },
];
```

{{"demo": "RenderCellGrid.js", "bg": "inline"}}

**Note**: It is recommended to also set a `valueFormatter` providing a representation for the value to be used when [exporting](/components/data-grid/export/#export-custom-rendered-cells) the data.

> ⚠️ When using `renderCell` with object cell values
> remember to handle [sorting](/components/data-grid/sorting/#custom-comparator).
> Otherwise, sorting won't work.

#### Render edit cell

The `renderCell` render function allows customizing the rendered in "view mode" only.
For the "edit mode", set the `renderEditCell` function to customize the edit component.
Check the [editing page](/components/data-grid/editing) for more details about editing.

#### Expand cell renderer

By default, the grid cuts the content of a cell and renders an ellipsis if the content of the cell does not fit in the cell.
As a workaround, you can create a cell renderer that will allow seeing the full content of the cell in the grid.

{{"demo": "RenderExpandCellGrid.js", "bg": "inline"}}

### Render header

You can customize the look of each header with the `renderHeader` method.
It takes precedence over the `headerName` property.

```tsx
const columns: GridColDef[] = [
  {
    field: 'date',
    width: 150,
    type: 'date',
    renderHeader: (params: GridColumnHeaderParams) => (
      <strong>
        {'Birthday '}
        <span role="img" aria-label="enjoy">
          🎂
        </span>
      </strong>
    ),
  },
];
```

{{"demo": "RenderHeaderGrid.js", "bg": "inline"}}

### Styling header

You can check the [styling header](/components/data-grid/style/#styling-column-headers) section for more information.

### Styling cells

You can check the [styling cells](/components/data-grid/style/#styling-cells) section for more information.

## Column types

To facilitate the configuration of the columns, some column types are predefined.
By default, columns are assumed to hold strings, so the default column string type will be applied. As a result, column sorting will use the string comparator, and the column content will be aligned to the left side of the cell.

The following are the native column types:

- `'string'` (default)
- `'number'`
- `'date'`
- `'dateTime'`
- `'boolean'`
- `'singleSelect'`
- `'actions'`

### Converting types

Default methods, such as filtering and sorting, assume that the type of the values will match the type of the column specified in `type` (e.g. the values of a `number` column will be numbers).
For example, values of column with `type: 'dateTime'` are expecting to be stored as a `Date()` objects.
If for any reason, your data type is not the correct one, you can use `valueGetter` to parse the value to the correct type.

```tsx
{
  field: 'lastLogin',
  type: 'dateTime',
  valueGetter: ({ value }) => value && new Date(value),
}
```

### Special properties

To use most of the column types, you only need to define the `type` property in your column definition.
However, some types require additional properties to be set to make them work correctly:

- If the column type is `'singleSelect'`, you also need to set the `valueOptions` property in the respective column definition. These values are options used for filtering and editing.

  ```tsx
  {
    field: 'country',
    type: 'singleSelect',
    valueOptions: ['United Kingdom', 'Spain', 'Brazil']
  }
  ```

  > ⚠️ When using objects values for `valueOptions` you need to provide `value` and `label` fields for each option: `{ value: string, label: string }`

- If the column type is `'actions'`, you need to provide a `getActions` function that returns an array of actions available for each row (React elements).
  You can add the `showInMenu` prop on the returned React elements to signal the data grid to group these actions inside a row menu.

  ```tsx
  {
    field: 'actions',
    type: 'actions',
    getActions: (params: GridRowParams) => [
      <GridActionsCellItem icon={...} onClick={...} label="Delete" />,
      <GridActionsCellItem icon={...} onClick={...} label="Print" showInMenu />,
    ]
  }
  ```

{{"demo": "ColumnTypesGrid.js", "bg": "inline"}}

## Column visibility

By default, all the columns are visible.
The column's visibility can be switched through the user interface in two ways:

- By opening the column menu and clicking the _Hide_ menu item.
- By clicking the _Columns_ menu and toggling the columns to show or hide.

You can prevent the user from hiding a column through the user interface by setting the `hideable` in `GridColDef` to `false`.

In the following demo, the "username" column cannot be hidden.

{{"demo": "VisibleColumnsBasicExample.js", "bg": "inline"}}

### Initialize the visible columns

To initialize the visible columns without controlling them, provide the model to the `initialState` prop.

```tsx
<DataGrid
  initialState={{
    columns: {
      columnVisibilityModel: {
        // Hide columns status and traderName, the other columns will remain visible
        status: false,
        traderName: false,
      },
    },
  }}
/>
```

{{"demo": "VisibleColumnsModelInitialState.js", "bg": "inline", "defaultCodeOpen": false }}

### Controlled visible columns

Use the `columnVisibilityModel` prop to control the visible columns.
You can use the `onColumnVisibilityModelChange` prop to listen to the changes to the visible columns and update the prop accordingly.

```tsx
<DataGrid
  columnVisibilityModel={{
    // Hide columns status and traderName, the other columns will remain visible
    status: false,
    traderName: false,
  }}
/>
```

> ⚠️The grid does not handle switching between controlled and uncontrolled modes.
>
> This edge case will be supported in v6 after the removal of the legacy `hide` field.

{{"demo": "VisibleColumnsModelControlled.js", "bg": "inline"}}

### Column `hide` property (deprecated)

Before the introduction of the `columnVisibilityModel`, the columns could be hidden by setting the `hide` property in `GridColDef` to `true`.
This method still works but will be removed on the next major release.

{{"demo": "ColumnHiding.js", "bg": "inline"}}

## Custom column types

You can extend the native column types with your own by simply spreading the necessary properties.

The demo below defines a new column type: `usdPrice` that extends the native `number` column type.

```jsx
const usdPrice: GridColTypeDef = {
  type: 'number',
  width: 130,
  valueFormatter: ({ value }) => valueFormatter.format(Number(value)),
  cellClassName: 'font-tabular-nums',
};
```

{{"demo": "CustomColumnTypesGrid.js", "bg": "inline"}}

> ⚠ If an unsupported column type is used the `string` column type will be used instead.

## Column menu

By default, each column header displays a column menu. The column menu allows actions to be performed in the context of the target column, e.g. filtering. To disable the column menu, set the prop `disableColumnMenu={true}`.

{{"demo": "ColumnMenuGrid.js", "bg": "inline"}}

## Column selector

To enable the toolbar you need to add `Toolbar: GridToolbar` to the grid `components` prop.

In addition, the column selector can be shown by using the "Show columns" menu item in the column menu.

The user can choose which columns are visible using the column selector from the toolbar.

To disable the column selector, set the prop `disableColumnSelector={true}`.

{{"demo": "ColumnSelectorGrid.js", "bg": "inline"}}

## Column reorder [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

By default, `DataGridPro` allows all column reordering by dragging the header cells and moving them left or right.

{{"demo": "ColumnOrderingGrid.js", "disableAd": true, "bg": "inline"}}

To disable reordering on all columns, set the prop `disableColumnReorder={true}`.

To disable reordering in a specific column, set the `disableReorder` property to true in the `GridColDef` of the respective column.

{{"demo": "ColumnOrderingDisabledGrid.js", "disableAd": true, "bg": "inline"}}

In addition, column reordering emits the following events that can be imported:

- `columnHeaderDragStart`: emitted when dragging of a header cell starts.
- `columnHeaderDragEnter`: emitted when the cursor enters another header cell while dragging.
- `columnHeaderDragOver`: emitted when dragging a header cell over another header cell.
- `columnHeaderDragEnd`: emitted when dragging of a header cell stops.

## Column pinning [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

Pinned (or frozen, locked, or sticky) columns are columns that are visible at all time while the user scrolls the grid horizontally.
They can be pinned either to the left or right side and cannot be reordered.

To pin a column, there are a few ways:

- Using the `initialState` prop
- [Controlling](/components/data-grid/columns/#controlling-the-pinned-columns) the `pinnedColumns` and `onPinnedColumnsChange` props
- Dedicated buttons in the column menu
- Accessing the [imperative](/components/data-grid/columns/#apiref) API

To set pinned columns via `initialState`, pass an object with the following shape to this prop:

```ts
interface GridPinnedColumns {
  left?: string[]; // Optional field names to pin to the left
  right?: string[]; // Optional field names to pin to the right
}
```

The following demos illustrates how this approach works:

{{"demo": "BasicColumnPinning.js", "disableAd": true, "bg": "inline"}}

**Note:** The column pinning feature can be completely disabled with `disableColumnPinning`.

```tsx
<DataGridPro disableColumnPinning />
```

> You may encounter issues if the sum of the widths of the pinned columns is larger than the width of the grid.
> Make sure that the grid can accommodate properly, at least, these columns.

### Controlling the pinned columns

While the `initialState` prop only works for setting pinned columns during the initialization, the `pinnedColumns` prop allows you to modify which columns are pinned at any time.
The value passed to it follows the same shape from the previous approach.
Use it together with `onPinnedColumnsChange` to know when a column is pinned or unpinned.

{{"demo": "ControlPinnedColumns.js", "disableAd": true, "bg": "inline"}}

### Blocking column unpinning

It may be desirable to not allow a column to be unpinned.
The only thing required to achieve that is to hide the buttons added to the column menu.
This can be done in two ways:

1. Per column, by setting `pinnable` to `false` in each `GridColDef`:

   ```tsx
   <DataGrid columns={[{ field: 'id', pinnable: false }]} /> // Default is `true`.
   ```

2. By providing a custom menu, as demonstrated below:

{{"demo": "DisableColumnPinningButtons.js", "disableAd": true, "bg": "inline"}}

**Note:** Using the `disableColumnMenu` prop also works, however, you disable completely the column menu with this approach.

### Pinning the checkbox selection column

To pin the checkbox column added when using `checkboxSelection`, add `GRID_CHECKBOX_SELECTION_COL_DEF.field` to the list of pinned columns.

{{"demo": "ColumnPinningWithCheckboxSelection.js", "disableAd": true, "bg": "inline"}}

### apiRef

{{"demo": "ColumnPinningApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## 🚧 Column groups

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #195](https://github.com/mui/mui-x/issues/195) if you want to see it land faster.

Grouping columns allows you to have multiple levels of columns in your header and the ability, if needed, to 'open and close' column groups to show and hide additional columns.

## 🚧 Column spanning

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #192](https://github.com/mui/mui-x/issues/192) if you want to see it land faster.

Each cell takes up the width of one column.
You can modify this default behavior with column spanning.
It allows cells to span multiple columns.
This is very close to the "column spanning" in an HTML `<table>`.

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
