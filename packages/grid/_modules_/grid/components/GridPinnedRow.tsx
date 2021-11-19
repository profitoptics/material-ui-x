/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { alpha, darken, lighten, styled } from '@mui/material/styles';
import { GridRowModel } from '../models/gridRows';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass, gridClasses } from '../gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../GridComponentProps';
import { GridStateColDef } from '../models/colDef/gridColDef';
import { GridCellIdentifier } from '../hooks/features/focus/gridFocusState';
import { gridColumnsMetaSelector } from '../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../hooks/utils/useGridSelector';

export interface GridPinnedRowProps {
  selected: boolean;
  rowHeight: number;
  containerWidth: number;
  row: GridRowModel;
  firstColumnToRender: number;
  lastColumnToRender: number;
  visibleColumns: GridStateColDef[];
  renderedColumns: GridStateColDef[];
  cellTabIndex: GridCellIdentifier | null;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
}

type OwnerState = Pick<GridPinnedRowProps, 'selected'> & {
  classes?: GridComponentProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { selected, classes } = ownerState;

  const slots = {
    root: ['pinnedRow', selected && 'selected'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const EmptyCell = ({ width, height }) => {
  if (!width || !height) {
    return null;
  }

  const style = { width, height };

  return <div className="MuiDataGrid-cell" style={style} />; // TODO change to .MuiDataGrid-emptyCell or .MuiDataGrid-rowFiller
};

const GridPinnedRowRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PinnedRow',
  overridesResolver: (props, styles) => styles.pinnedRow,
})({});

function GridPinnedRow(props: React.HTMLAttributes<HTMLDivElement> & GridPinnedRowProps) {
  const {
    selected,
    row,
    style: styleProp,
    rowHeight,
    className,
    visibleColumns,
    renderedColumns,
    containerWidth,
    firstColumnToRender,
    lastColumnToRender,
    cellTabIndex,
    onClick,
    onDoubleClick,
    ...other
  } = props;
  const apiRef = useGridApiContext();
  const ariaRowIndex = apiRef.current.getRowsCount() + 1; // 1 for the header row and 1 as it's 1-based
  const rootProps = useGridRootProps();
  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);
  const { hasScrollX, hasScrollY } = apiRef.current.getRootDimensions() ?? {
    hasScrollX: false,
    hasScrollY: false,
  };

  const ownerState = {
    selected,
    classes: rootProps.classes,
  };

  const classes = useUtilityClasses(ownerState);

  const style = {
    position: 'sticky',
    bottom: 0,
    maxHeight: rowHeight,
    minHeight: rowHeight,
    zIndex: 1,
    ...styleProp,
  } as React.CSSProperties;
  if (rootProps.pinnedRowPosition === 'top') {
    style.top = 0;
  } else {
    style.bottom = 0;
  }

  const cells: JSX.Element[] = [];

  for (let i = 0; i < renderedColumns.length; i += 1) {
    const column = renderedColumns[i];
    const indexRelativeToAllColumns = firstColumnToRender + i;

    const isLastColumn = indexRelativeToAllColumns === visibleColumns.length - 1;
    const removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
    const showRightBorder = !isLastColumn
      ? rootProps.showCellRightBorder
      : !removeLastBorderRight && rootProps.disableExtendRowFullWidth;

    const cellParams = apiRef.current.getPinnedCellParams(row, column.field);

    const classNames: string[] = [];

    if (column.cellClassName) {
      classNames.push(
        clsx(
          typeof column.cellClassName === 'function'
            ? column.cellClassName(cellParams)
            : column.cellClassName,
        ),
      );
    }

    let content: React.ReactNode = null;

    if (column.renderCell) {
      content = column.renderCell({ ...cellParams, api: apiRef.current });
      // TODO move to GridCell
      classNames.push(
        clsx(gridClasses['cell--withRenderer'], rootProps.classes?.['cell--withRenderer']),
      );
    }

    if (rootProps.getCellClassName) {
      // TODO move to GridCell
      classNames.push(rootProps.getCellClassName(cellParams));
    }

    const tabIndex = cellTabIndex !== null && cellTabIndex.field === column.field ? 0 : -1;

    const value = row[column.field];
    let formattedValue = row[column.field];
    if (column.valueFormatter) {
      formattedValue = column.valueFormatter({
        field: column.field,
        value,
        api: apiRef.current,
      });
    }

    cells.push(
      <rootProps.components.PinnedCell
        key={i}
        value={value}
        field={column.field}
        width={column.computedWidth}
        height={rowHeight}
        showRightBorder={showRightBorder}
        formattedValue={formattedValue}
        align={column.align || 'left'}
        colIndex={indexRelativeToAllColumns}
        hasFocus={false}
        tabIndex={tabIndex}
        className={clsx(classNames)}
        {...rootProps.componentsProps?.cell}
      >
        {content}
      </rootProps.components.PinnedCell>,
    );
  }

  const emptyCellWidth = containerWidth - columnsMeta.totalWidth;

  return (
    <GridPinnedRowRoot
      role="row"
      className={clsx(classes.root, className)}
      aria-rowindex={ariaRowIndex}
      style={style}
      {...other}
    >
      {cells}
      {emptyCellWidth > 0 && <EmptyCell width={emptyCellWidth} height={rowHeight} />}
    </GridPinnedRowRoot>
  );
}

GridPinnedRow.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  cellTabIndex: PropTypes.object,
  containerWidth: PropTypes.number.isRequired,
  firstColumnToRender: PropTypes.number.isRequired,
  lastColumnToRender: PropTypes.number.isRequired,
  renderedColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
  row: PropTypes.object.isRequired,
  rowHeight: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
} as any;

export { GridPinnedRow };
