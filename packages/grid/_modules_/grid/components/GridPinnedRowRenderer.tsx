import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

interface GridPinnedRowRendererProps extends React.HTMLAttributes<HTMLDivElement> {
  getPinnedRow: () => null | JSX.Element;
}

const GridPinnedRowRendererRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'GridPinnedRowRenderer',
  overridesResolver: (props, styles) => styles.pinnedRowRenderer,
})({});

const GridPinnedRowRenderer = React.forwardRef<HTMLDivElement, GridPinnedRowRendererProps>(
  function GridPinnedRowRenderer(props, ref) {
    const { getPinnedRow, children } = props;
    const rootProps = useGridRootProps();

    const pinnedRowPosition = rootProps.pinnedRowPosition ?? 'bottom';

    return (
      <GridPinnedRowRendererRoot ref={ref}>
        {pinnedRowPosition === 'top' ? getPinnedRow() : null}
        {children}
        {pinnedRowPosition === 'bottom' ? getPinnedRow() : null}
      </GridPinnedRowRendererRoot>
    );
  },
);

GridPinnedRowRenderer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  getPinnedRow: PropTypes.func.isRequired,
} as any;

export { GridPinnedRowRenderer };
