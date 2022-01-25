import * as React from 'react';
import clsx from 'clsx';
import { alpha, createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { GridRenderCellParams } from '@mui/x-data-grid';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        width: '100%',
        paddingRight: 8,
        fontVariantNumeric: 'tabular-nums',
      },
      good: {
        backgroundColor: alpha(theme.palette.success.main, 0.3),
      },
      bad: {
        backgroundColor: alpha(theme.palette.error.main, 0.3),
      },
    }),
  { defaultTheme },
);

interface TotalPriceProps {
  value: number;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const TotalPrice = React.memo(function TotalPrice(props: TotalPriceProps) {
  const { value } = props;
  const classes = useStyles();
  return (
    <div
      className={clsx(classes.root, {
        [classes.good]: value > 1000000,
        [classes.bad]: value < 1000000,
      })}
    >
      {currencyFormatter.format(value)}
    </div>
  );
});

export function renderTotalPrice(params: GridRenderCellParams) {
  return <TotalPrice value={params.value as any} />;
}
