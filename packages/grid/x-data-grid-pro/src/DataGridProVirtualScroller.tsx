import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { GridVirtualScroller } from '../../_modules_/grid/components/virtualization/GridVirtualScroller';
import { GridVirtualScrollerContent } from '../../_modules_/grid/components/virtualization/GridVirtualScrollerContent';
import { GridVirtualScrollerRenderZone } from '../../_modules_/grid/components/virtualization/GridVirtualScrollerRenderZone';
import { useGridVirtualScroller } from '../../_modules_/grid/hooks/features/virtualization/useGridVirtualScroller';
import { useGridApiContext } from '../../_modules_/grid/hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../_modules_/grid/hooks/utils/useGridRootProps';
import { gridVisibleColumnFieldsSelector } from '../../_modules_/grid/hooks/features/columns/gridColumnsSelector';
import { useGridApiEventHandler } from '../../_modules_/grid/hooks/utils/useGridApiEventHandler';
import { GridEvents } from '../../_modules_/grid/models/events';
import { useGridSelector } from '../../_modules_/grid/hooks/utils/useGridSelector';
import { DataGridProProcessedProps } from '../../_modules_/grid/models/props/DataGridProProps';
import { getDataGridUtilityClass, gridClasses } from '../../_modules_/grid/gridClasses';
import { gridPinnedColumnsSelector } from '../../_modules_/grid/hooks/features/columnPinning/columnPinningSelector';
import {
  gridDetailPanelExpandedRowIdsSelector,
  gridDetailPanelExpandedRowsContentCacheSelector,
  gridDetailPanelExpandedRowsHeightCacheSelector,
} from '../../_modules_/grid/hooks/features/detailPanel/gridDetailPanelSelector';
import { useCurrentPageRows } from '../../_modules_/grid/hooks/utils/useCurrentPageRows';
import {
  GridPinnedColumns,
  GridPinnedPosition,
} from '../../_modules_/grid/models/api/gridColumnPinningApi';
import { gridRowsMetaSelector } from '../../_modules_/grid/hooks/features/rows/gridRowsMetaSelector';
import { GridRowId } from '../../_modules_/grid/models/gridRows';
import { GridPinnedRowRenderer } from "../../_modules_";

export const filterColumns = (pinnedColumns: GridPinnedColumns, columns: string[]) => {
  if (!Array.isArray(pinnedColumns.left) && !Array.isArray(pinnedColumns.right)) {
    return [[], []];
  }

  if (pinnedColumns.left?.length === 0 && pinnedColumns.right?.length === 0) {
    return [[], []];
  }

  const filter = (newPinnedColumns: any[] | undefined, remaningColumns: string[]) => {
    if (!Array.isArray(newPinnedColumns)) {
      return [];
    }
    return newPinnedColumns.filter((field) => remaningColumns.includes(field));
  };

  const leftPinnedColumns = filter(pinnedColumns.left, columns);
  const columnsWithoutLeftPinnedColumns = columns.filter(
    // Filter out from the remaning columns those columns already pinned to the left
    (field) => !leftPinnedColumns.includes(field),
  );
  const rightPinnedColumns = filter(pinnedColumns.right, columnsWithoutLeftPinnedColumns);
  return [leftPinnedColumns, rightPinnedColumns];
};

type OwnerState = {
  classes: DataGridProProcessedProps['classes'];
  leftPinnedColumns: GridPinnedColumns['left'];
  rightPinnedColumns: GridPinnedColumns['right'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes, leftPinnedColumns, rightPinnedColumns } = ownerState;

  const slots = {
    leftPinnedColumns: [
      'pinnedColumns',
      leftPinnedColumns && leftPinnedColumns.length > 0 && 'pinnedColumns--left',
    ],
    rightPinnedColumns: [
      'pinnedColumns',
      rightPinnedColumns && rightPinnedColumns.length > 0 && 'pinnedColumns--right',
    ],
    detailPanels: ['detailPanels'],
    detailPanel: ['detailPanel'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface VirtualScrollerPinnedColumnsProps {
  side: GridPinnedPosition;
}

// Inspired by https://github.com/material-components/material-components-ios/blob/bca36107405594d5b7b16265a5b0ed698f85a5ee/components/Elevation/src/UIColor%2BMaterialElevation.m#L61
const getOverlayAlpha = (elevation: number) => {
  let alphaValue: number;
  if (elevation < 1) {
    alphaValue = 5.11916 * elevation ** 2;
  } else {
    alphaValue = 4.5 * Math.log(elevation + 1) + 2;
  }
  return alphaValue / 100;
};

const VirtualScrollerDetailPanels = styled('div', {
  name: 'MuiDataGrid',
  slot: 'DetailPanels',
  overridesResolver: (props, styles) => styles.detailPanels,
})({});

const VirtualScrollerDetailPanel = styled(Box, {
  name: 'MuiDataGrid',
  slot: 'DetailPanel',
  overridesResolver: (props, styles) => styles.detailPanel,
})(({ theme }) => ({
  zIndex: 2,
  width: '100%',
  position: 'absolute',
  backgroundColor: theme.palette.background.default,
}));

const VirtualScrollerPinnedColumns = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PinnedColumns',
  overridesResolver: (props, styles) => [
    { [`&.${gridClasses['pinnedColumns--left']}`]: styles['pinnedColumns--left'] },
    { [`&.${gridClasses['pinnedColumns--right']}`]: styles['pinnedColumns--right'] },
    styles.pinnedColumns,
  ],
})<{ ownerState: VirtualScrollerPinnedColumnsProps }>(({ theme, ownerState }) => ({
  position: 'sticky',
  overflow: 'hidden',
  zIndex: 1,
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.default,
  ...(theme.palette.mode === 'dark' && {
    backgroundImage: `linear-gradient(${alpha('#fff', getOverlayAlpha(2))}, ${alpha(
      '#fff',
      getOverlayAlpha(2),
    )})`,
  }),
  ...(ownerState.side === GridPinnedPosition.left && { left: 0, float: 'left' }),
  ...(ownerState.side === GridPinnedPosition.right && { right: 0, float: 'right' }),
}));

interface DataGridProVirtualScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  disableVirtualization?: boolean;
}

const DataGridProVirtualScroller = React.forwardRef<
  HTMLDivElement,
  DataGridProVirtualScrollerProps
>(function DataGridProVirtualScroller(props, ref) {
  const { className, disableVirtualization, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const currentPage = useCurrentPageRows(apiRef, rootProps);
  const visibleColumnFields = useGridSelector(apiRef, gridVisibleColumnFieldsSelector);
  const expandedRowIds = useGridSelector(apiRef, gridDetailPanelExpandedRowIdsSelector);
  const detailPanelsContent = useGridSelector(
    apiRef,
    gridDetailPanelExpandedRowsContentCacheSelector,
  );
  const detailPanelsHeights = useGridSelector(
    apiRef,
    gridDetailPanelExpandedRowsHeightCacheSelector,
  );
  const leftColumns = React.useRef<HTMLDivElement>(null);
  const rightColumns = React.useRef<HTMLDivElement>(null);
  const [shouldExtendContent, setShouldExtendContent] = React.useState(false);

  const handleRenderZonePositioning = React.useCallback(({ top }) => {
    if (leftColumns.current) {
      leftColumns.current!.style.transform = `translate3d(0px, ${top}px, 0px)`;
    }
    if (rightColumns.current) {
      rightColumns.current!.style.transform = `translate3d(0px, ${top}px, 0px)`;
    }
  }, []);

  const getRowProps = (id: GridRowId) => {
    if (!expandedRowIds.includes(id)) {
      return null;
    }
    const height = detailPanelsHeights[id];
    return { style: { marginBottom: height } };
  };

  const pinnedColumns = useGridSelector(apiRef, gridPinnedColumnsSelector);
  const [leftPinnedColumns, rightPinnedColumns] = filterColumns(pinnedColumns, visibleColumnFields);

  const ownerState = { classes: rootProps.classes, leftPinnedColumns, rightPinnedColumns };
  const classes = useUtilityClasses(ownerState);

  const {
    renderContext,
    getRows,
    getRootProps,
    getContentProps,
    getRenderZoneProps,
    updateRenderZonePosition,
    getPinnedRow
  } = useGridVirtualScroller({
    ref,
    renderZoneMinColumnIndex: leftPinnedColumns.length,
    renderZoneMaxColumnIndex: visibleColumnFields.length - rightPinnedColumns.length,
    onRenderZonePositioning: handleRenderZonePositioning,
    getRowProps,
    ...props,
  });

  const refreshRenderZonePosition = React.useCallback(() => {
    if (renderContext) {
      updateRenderZonePosition(renderContext);
    }
  }, [renderContext, updateRenderZonePosition]);

  useGridApiEventHandler(apiRef, GridEvents.columnWidthChange, refreshRenderZonePosition);
  useGridApiEventHandler(apiRef, GridEvents.columnOrderChange, refreshRenderZonePosition);

  React.useEffect(() => {
    refreshRenderZonePosition();
  }, [refreshRenderZonePosition]);

  const handleContentSizeChange = React.useCallback(() => {
    if (!apiRef.current.windowRef?.current) {
      return;
    }
    setShouldExtendContent(
      apiRef.current.windowRef.current.scrollHeight <=
      apiRef.current.windowRef.current.clientHeight,
    );
  }, [apiRef]);

  useGridApiEventHandler(
    apiRef,
    GridEvents.virtualScrollerContentSizeChange,
    handleContentSizeChange,
  );

  const leftRenderContext =
    renderContext && leftPinnedColumns.length > 0
      ? {
        ...renderContext,
        firstColumnIndex: 0,
        lastColumnIndex: leftPinnedColumns.length,
      }
      : null;

  const rightRenderContext =
    renderContext && rightPinnedColumns.length > 0
      ? {
        ...renderContext,
        firstColumnIndex: visibleColumnFields.length - rightPinnedColumns.length,
        lastColumnIndex: visibleColumnFields.length,
      }
      : null;

  const contentStyle = {
    minHeight: shouldExtendContent ? '100%' : 'auto',
  };

  const pinnedColumnsStyle = {
    minHeight: shouldExtendContent ? '100%' : 'auto',
  };

  const rowsLookup = React.useMemo(() => {
    if (rootProps.getDetailPanelContent == null) {
      return null;
    }

    return currentPage.rows.reduce((acc, { id }, index) => {
      acc[id] = index;
      return acc;
    }, {} as Record<GridRowId, number>);
  }, [currentPage.rows, rootProps.getDetailPanelContent]);

  const getDetailPanels = () => {
    const panels: React.ReactNode[] = [];

    if (rootProps.getDetailPanelContent == null) {
      return panels;
    }

    const rowsMeta = gridRowsMetaSelector(apiRef.current.state);
    const uniqueExpandedRowIds = [...new Set([...expandedRowIds]).values()];

    for (let i = 0; i < uniqueExpandedRowIds.length; i += 1) {
      const id = uniqueExpandedRowIds[i];
      const content = detailPanelsContent[id];

      // Check if the id exists in the current page
      const exists = rowsLookup![id] !== undefined;

      if (React.isValidElement(content) && exists) {
        const height = detailPanelsHeights[id];
        const rowIndex = rowsLookup![id];
        const top = rowsMeta.positions[rowIndex] + apiRef.current.unstable_getRowHeight(id);

        panels.push(
          <VirtualScrollerDetailPanel
            key={i}
            style={{ top, height }}
            className={classes.detailPanel}
          >
            {content}
          </VirtualScrollerDetailPanel>,
        );
      }
    }

    return panels;
  };

  const detailPanels = getDetailPanels();

  return (
    <GridVirtualScroller {...getRootProps(other)}>
      <GridPinnedRowRenderer getPinnedRow={getPinnedRow}>
        <GridVirtualScrollerContent {...getContentProps({ style: contentStyle })}>
          {leftRenderContext && (
            <VirtualScrollerPinnedColumns
              ref={leftColumns}
              className={classes.leftPinnedColumns}
              ownerState={{ side: GridPinnedPosition.left }}
              style={pinnedColumnsStyle}
            >
              {getRows({
                renderContext: leftRenderContext,
                minFirstColumn: leftRenderContext.firstColumnIndex,
                maxLastColumn: leftRenderContext.lastColumnIndex,
                availableSpace: 0,
              })}
            </VirtualScrollerPinnedColumns>
          )}
          {rightRenderContext && (
            <VirtualScrollerPinnedColumns
              ref={rightColumns}
              ownerState={{ side: GridPinnedPosition.right }}
              className={classes.rightPinnedColumns}
              style={pinnedColumnsStyle}
            >
              {getRows({
                renderContext: rightRenderContext,
                minFirstColumn: rightRenderContext.firstColumnIndex,
                maxLastColumn: rightRenderContext.lastColumnIndex,
                availableSpace: 0,
              })}
            </VirtualScrollerPinnedColumns>
          )}
          <GridVirtualScrollerRenderZone {...getRenderZoneProps()}>
            {getRows({ renderContext })}
          </GridVirtualScrollerRenderZone>
          {detailPanels.length > 0 && (
            <VirtualScrollerDetailPanels className={classes.detailPanels}>
              {detailPanels}
            </VirtualScrollerDetailPanels>
          )}
        </GridVirtualScrollerContent>
      </GridPinnedRowRenderer>
    </GridVirtualScroller>
  );
});

export { DataGridProVirtualScroller };
