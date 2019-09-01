[Back](../index.md)

# DOMStyle

A collection of helper methods to help you get and set styles.

## Import

Import **DOMStyle** into your project:

```typescript
import { DOMStyle } from '@nekobird/rocket';
```

## Interfaces

### StyleObject

`[key: string]: string | number`

Is an `object` with a value that is `string` or `number`.

#### Example

```typescript
const styleObject: StyleObject = {
  'backgroundColor': 'pink',
  'lineHeight': 1.5,
}
```

### StyleValue

`[key: string]: string`

## Static Methods

### getLineHeight

`getLineHeight(element: HTMLElement): number`

Get computed `line-height` in `px` of given element.

### applyStyle

`applyStyle(element: HTMLElement, styles: StyleObject): void`

### copyStylesFrom

```
copyStylesFrom(
  from: HTMLElement,
  properties: string | string[],
  ...to: HTMLElement[]
): void
```

#### Example

```typescript
DOMStyle.copyStylesFrom(element, 'font-size', anotherElement, someOtherElement);
```

### clearStyles

`clearStyles(element: HTMLElement): void`

### removeStyles

`removeStyles(element: HTMLElement, properties: string | string[]): void`

### `getStyleValue`

```
getStyleValue(
  element: HTMLElement,
  property: string,
  stringOnly: boolean = false
): string | number
```

This will return specified style property value from an element.
It will automatically return a `number` if the property contains one.
You can override this default behaviour and only return a `string`
by setting `stringOnly` flag to `true`.

### getStyleValues

```
getStyleValues(
  element: HTMLElement,
  styleProperties: string | string[]
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