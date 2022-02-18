---
title: React Data Grid component
githubLabel: 'component: data grid'
packageName: '@mui/x-data-grid'
waiAria: https://www.w3.org/TR/wai-aria-practices-1.1/#grid
---

# Data Grid

<p class="description">A fast and extendable react data table and react data grid. It's a feature-rich component available in MIT or Commercial versions.</p>

{{"component": "modules/components/ComponentLinkHeader.js"}}

The component leverages the power of React and TypeScript, to provide the best UX while manipulating an unlimited set of data. It comes with an intuitive API for real-time updates, accessibility, as well as theming and custom templates, all with blazing fast performance.

## Overview

> Visit the [installation guide](/components/data-grid/getting-started/#installation) to learn how to install the correct package version and dependencies.

Data tables display information in a grid-like format of rows and columns.
They organize information in a way that’s easy to scan so that users can look for patterns and insights.

The data grid comes in two different versions:

### MIT version

The first version is meant to simplify the [Table demo](/components/tables/#sorting-amp-selecting) with a clean abstraction.
This abstraction also set constraints that allow the component to implement new features.

```js
import { DataGrid } from '@mui/x-data-grid';
```

{{"demo": "DataGridDemo.js", "defaultCodeOpen": false, "bg": "inline"}}

### Commercial version [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

The following grid displays 31 columns and 100,000 rows - over 3 million cells in total.

```js
import { DataGridPro } from '@mui/x-data-grid-pro';
```

{{"demo": "DataGridProDemo.js", "defaultCodeOpen": false, "disableAd": true, "bg": "inline"}}

### MIT vs. commercial

> Please check the [Licenses section](/components/data-grid/getting-started/#licenses) for more details between the different versions.

## Features

- Built with and exclusively for React ⚛️
- High performance 🚀
- [Filtering](/components/data-grid/filtering/) and [multi-filtering](/components/data-grid/filtering/#multi-filtering) <span class="plan-pro"></span>
- [Pagination](/components/data-grid/pagination/)
- [Row & Cell editing](/components/data-grid/editing/)
- [Sorting](/components/data-grid/sorting) and [multi-sorting](/components/data-grid/sorting/#multi-sorting) <span class="plan-pro"></span>
- [Selection](/components/data-grid/selection/)
- [Column virtualization](/components/data-grid/virtualization/#column-virtualization) and [rows virtualization](/components/data-grid/virtualization/#row-virtualization) <span class="plan-pro"></span>
- [Row grouping](/components/data-grid/group-pivot/#row-grouping) <span class="plan-premium"></span>
- [Tree data](/components/data-grid/group-pivot/#tree-data) <span class="plan-pro"></span>
- [Master detail](/components/data-grid/group-pivot/#master-detail) <span class="plan-pro"></span>
- [Resizable columns](/components/data-grid/columns/#column-resizing) <span class="plan-pro"></span>
- [100% customizable](/components/data-grid/style/)
- Server-side data
- [Column hiding](/components/data-grid/columns/#hiding)
- [Column pinning](/components/data-grid/columns/#column-pinning) <span class="pro"></span>
- [Accessible](/components/data-grid/accessibility/)
- [Localization](/components/data-grid/localization/)

### 🚧 Upcoming features

While development of the data grid component is moving fast, there are still many additional features that we plan to implement. Some of them:

- Headless (hooks only)
- [Excel export](/components/data-grid/export/) <span class="plan-premium"></span>
- [Range selection](/components/data-grid/selection/#range-selection) <span class="plan-premium"></span>
- [Pivot, Aggregation](/components/data-grid/group-pivot/) <span class="plan-premium"></span>

You can find more details on, the [feature comparison](/components/data-grid/getting-started/#feature-comparison), our living quarterly [roadmap](https://github.com/mui/mui-x/projects/1) as well as on the open [GitHub issues](https://github.com/mui/mui-x/issues?q=is%3Aopen+label%3A%22component%3A+DataGrid%22+label%3Aenhancement).

## Resources

Here are some resources you might be interested in to learn more about the grid:

- The storybook used for [internal development](https://material-ui-x.netlify.app/storybook/)
- The [source on GitHub](https://github.com/mui/mui-x/tree/master/packages/grid)
- The [Material Design specification](https://material.io/design/components/data-tables.html) specification
- The accessibility [WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices/#grid)
- The [Sketch](https://mui.com/store/items/sketch-react/) and [Figma](https://mui.com/store/items/figma-react/) design assets

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
