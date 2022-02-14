/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { ownerDocument, capitalize } from '@mui/material/utils';
import { getDataGridUtilityClass } from '../../gridClasses';
import { GridAlignment, GridCellValue, GridEvents } from '../../models';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

export interface GridPinnedCellProps {
  align: GridAlignment;
  className?: string;
  colIndex: number;
  field: string;
  formattedValue?: GridCellValue;
  hasFocus?: boolean;
  height: number;
  showRightBorder?: boolean;
  value?: GridCellValue;
  width: number;
  children: React.ReactNode;
  tabIndex: 0 | -1;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onDragEnter?: React.DragEventHandler<HTMLDivElement>;
  onDragOver?: React.DragEventHandler<HTMLDivElement>;
  [x: string]: any; // TODO it should not accept unspecified props
}

// Based on https://stackoverflow.com/a/59518678
let cachedSupportsPreventScroll: boolean;
function doesSupportPreventScroll(): boolean {
  if (cachedSupportsPreventScroll === undefined) {
    document.createElement('div').focus({
      get preventScroll() {
        cachedSupportsPreventScroll = true;
        return false;
      },
    });
  }
  return cachedSupportsPreventScroll;
}

type OwnerState = Pick<GridPinnedCellProps, 'align' | 'showRightBorder'> & {
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { align, showRightBorder, classes } = ownerState;

  const slots = {
    root: ['cell', `cell--text${capitalize(align)}`, showRightBorder && 'withBorder'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridPinnedCell(props: GridPinnedCellProps) {
  const {
    align,
    children,
    colIndex,
    field,
    formattedValue,
    hasFocus,
    height,
    tabIndex,
    value,
    width,
    className,
    showRightBorder,
    extendRowFullWidth,
    row,
    onClick,
    onDoubleClick,
    onMouseDown,
    onMouseUp,
    onKeyDown,
    onDragEnter,
    onDragOver,
    ...other
  } = props;

  const valueToRender = formattedValue == null ? value : formattedValue;
  const cellRef = React.useRef<HTMLDivElement>(null);
  const apiRef = useGridApiContext();

  const rootProps = useGridRootProps();
  const ownerState = { align, showRightBorder, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const publishMouseUp = React.useCallback(
    (eventName: string) => (event: React.MouseEvent<HTMLDivElement>) => {
      // TODO: PO: Fix rowId does not exist
      // const params = apiRef.current.getCellParams(rowId, field || '');
      // apiRef.current.publishEvent(eventName, params, event);

      if (onMouseUp) {
        onMouseUp(event);
      }
    },
    // [apiRef, field, onMouseUp],
    [onMouseUp],
  );

  const publish = React.useCallback(
    (eventName: string, propHandler: any) => (event: React.SyntheticEvent<HTMLDivElement>) => {
      // Ignore portal
      // The target is not an element when triggered by a Select inside the cell
      // See https://github.com/mui-org/material-ui/issues/10534
      if (
        (event.target as any).nodeType === 1 &&
        !event.currentTarget.contains(event.target as Element)
      ) {
        return;
      }

      // The row might have been deleted during the click
      // TODO: PO: Fix rowId does not exist
      // if (!apiRef.current.getRow(rowId)) {
      //   return;
      // }
      //
      // const params = apiRef.current.getCellParams(rowId!, field || '');
      // apiRef.current.publishEvent(eventName, params, event);

      if (propHandler) {
        propHandler(event);
      }
    },
    // [apiRef, field],
    [],
  );

  const style = {
    minWidth: width,
    maxWidth: width,
    minHeight: height,
    maxHeight: height,
    lineHeight: `${height - 1}px`,
  };

  React.useLayoutEffect(() => {
    if (!hasFocus) {
      return;
    }

    const doc = ownerDocument(apiRef.current.rootElementRef!.current as HTMLElement)!;

    if (cellRef.current && !cellRef.current.contains(doc.activeElement!)) {
      const focusableElement = cellRef.current!.querySelector<HTMLElement>('[tabindex="0"]');
      const elementToFocus = focusableElement || cellRef.current;

      if (doesSupportPreventScroll()) {
        elementToFocus.focus({ preventScroll: true });
      } else {
        const scrollPosition = apiRef.current.getScrollPosition();
        elementToFocus.focus();
        apiRef.current.scroll(scrollPosition);
      }
    }
  });

  return (
    <div
      ref={cellRef}
      className={clsx(className, classes.root)}
      role="cell"
      data-field={field}
      data-colindex={colIndex}
      aria-colindex={colIndex + 1}
      style={style}
      tabIndex={tabIndex}
      onClick={publish(GridEvents.cellClick, onClick)}
      onDoubleClick={publish(GridEvents.cellDoubleClick, onDoubleClick)}
      onMouseDown={publish(GridEvents.cellMouseDown, onMouseDown)}
      onMouseUp={publishMouseUp(GridEvents.cellMouseUp)}
      onKeyDown={publish(GridEvents.cellKeyDown, onKeyDown)}
      onDragEnter={publish(GridEvents.cellDragEnter, onDragEnter)}
      onDragOver={publish(GridEvents.cellDragOver, onDragOver)}
      {...other}
    >
      {children != null ? children : valueToRender?.toString()}
    </div>
  );
}

GridPinnedCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  align: PropTypes.oneOf(['center', 'left', 'right']).isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  colIndex: PropTypes.number.isRequired,
  field: PropTypes.string.isRequired,
  formattedValue: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),
  hasFocus: PropTypes.bool,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragOver: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  showRightBorder: PropTypes.bool,
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),
  width: PropTypes.number.isRequired,
} as any;

export { GridPinnedCell };
