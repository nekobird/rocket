[Back](../index.md)

# `DOMStyle`

A collection of style helper.

## Import

Import **DOMStyle** into your project:

```typescript
import { DOMStyle } from '@nekobird/rocket';
```

## Interfaces

### `StyleList`

`[key: string]: string | number`

### `StyleValue`

`[key: string]: string`

## Static Methods

### `getLineHeight`

`getLineHeight(element: HTMLElement): number`

### `applyStyle`

`applyStyle(element: HTMLElement, styles: StyleList)`

### `copyStylesFrom`

```
copyStylesFrom(
  from: HTMLElement,
  styleProperties: string | string[],
  ...to: HTMLElement[]
): void
```

### `clearStyles`

`clearStyles(element: HTMLElement)`

### `removeStyles`

`removeStyles(element: HTMLElement, styleProperties: string | string[])`

### `getStyleValue`

```
getStyleValue(
  element: HTMLElement,
  styleProperty: string,
  isNumber: boolean = false,
): string | number
```

### `getStyleValues`

```
getStyleValues(
  element: HTMLElement,
  styleProperties: string | string[],
): StyleValue
```

### `getFontSize`

`getFontSize(element: HTMLElement): number`

### `setFontSize`

`setFontSize(element: HTMLElement, fontSize: number): void`

### `getBaseFontSize`

`getBaseFontSize(): number`

### `RemToPx`

`RemToPx(rem: number): number`