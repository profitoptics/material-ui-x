---
title: Data Grid - Localization
---

# Data Grid - Localization

<p class="description">The Data Grid allows to support users from different locales, with formatting, RTL, and localized strings.</p>

The default locale of MUI is English (United States). If you want to use other locales, follow the instructions below.

## Translation keys

You can use the `localeText` prop to pass in your own text and translations.
You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/grid/_modules_/grid/constants/localeTextConstants.ts) in the GitHub repository.
In the following example, the labels of the density selector are customized.

{{"demo": "CustomLocaleTextGrid.js", "bg": "inline"}}

## Locale text

The default locale of MUI is English (United States).

You can use the theme to configure the locale text:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid, bgBG } from '@mui/x-data-grid';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  bgBG,
);

<ThemeProvider theme={theme}>
  <DataGrid />
</ThemeProvider>;
```

Note that `createTheme` accepts any number of arguments.
If you are already using the [translations of the core components](/guides/localization/#locale-text), you can add `bgBG` as a new argument.
The same import works for `DataGridPro` as it's an extension of `DataGrid`.

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid, bgBG } from '@mui/x-data-grid';
import { bgBG as coreBgBG } from '@mui/material/locale';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  bgBG,
  coreBgBG,
);

<ThemeProvider theme={theme}>
  <DataGrid />
</ThemeProvider>;
```

If you want to pass language translations directly to the grid without using `createTheme` and `ThemeProvider`, you can directly load the language translations from the `@mui/x-data-grid` or `@mui/x-data-grid-pro` package.

```jsx
import { DataGrid, nlNL } from '@mui/x-data-grid';

<DataGrid localeText={nlNL.components.MuiDataGrid.defaultProps.localeText} />;
```

### Supported locales

| Locale                  | BCP 47 language tag | Import name |
| :---------------------- | :------------------ | :---------- |
| Arabic (Sudan)          | ar-SD               | `arSD`      |
| Bulgarian               | bg-BG               | `bgBG`      |
| Czech                   | cs-CZ               | `csCZ`      |
| Danish                  | da-DK               | `daDK`      |
| Dutch                   | nl-NL               | `nlNL`      |
| English (United States) | en-US               | `enUS`      |
| Finnish                 | fi-FI               | `fiFI`      |
| French                  | fr-FR               | `frFR`      |
| German                  | de-DE               | `deDE`      |
| Greek                   | el-GR               | `elGR`      |
| Hebrew                  | he-IL               | `heIL`      |
| Italian                 | it-IT               | `itIT`      |
| Japanese                | ja-JP               | `jaJP`      |
| Korean                  | ko-KR               | `koKR`      |
| Persian                 | fa-IR               | `faIR`      |
| Polish                  | pl-PL               | `plPL`      |
| Portuguese (Brazil)     | pt-BR               | `ptBR`      |
| Russian                 | ru-RU               | `ruRU`      |
| Slovak                  | sk-SK               | `skSK`      |
| Spanish (Spain)         | es-ES               | `esES`      |
| Turkish                 | tr-TR               | `trTR`      |
| Ukraine                 | uk-UA               | `ukUA`      |
| Simplified Chinese      | zh-CN               | `zhCN`      |

You can [find the source](https://github.com/mui/mui-x/tree/HEAD/packages/grid/_modules_/grid/locales) in the GitHub repository.

To create your own translation or to customize the English text, copy this file to your project, make any changes needed and import the locale from there.
Note that these translations of the Data grid component depend on the [Localization strategy](/guides/localization/) of the whole library.

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
