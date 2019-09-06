[Back](../index.md)

# DOMStyle

A collection of helper methods to help you get and set element styles.

## Table of Contents

- [DOMStyle](#domstyle)
  - [Table of Contents](#table-of-contents)
  - [Import](#import)
  - [Interfaces](#interfaces)
    - [StyleObject](#styleobject)
  - [Static Methods](#static-methods)
    - [getLineHeight](#getlineheight)
    - [applyStyle](#applystyle)
    - [copyStylesFrom](#copystylesfrom)
    - [clearStyles](#clearstyles)
    - [removeStyles](#removestyles)
    - [getStyleValue](#getstylevalue)
    - [getStyleValues](#getstylevalues)
    - [getFontSize](#getfontsize)
    - [setFontSize](#setfontsize)
    - [getBaseFontSize](#getbasefontsize)
    - [RemToPx](#remtopx)

## Import

Import **DOMStyle** into your project:

```typescript
import { DOMStyle } from '@nekobird/rocket';
```

## Interfaces

### StyleObject

`[key: string]: string | number`

Is an `object` with a value that is a `string` or `number`.

**Example**

```typescript
const style: StyleObject = {
  'color': 'hsl(340, 100%, 50%)',
  'font-size': 18,
};
```

## Static Methods

### getLineHeight

`getLineHeight(element: HTMLElement): number`

Get `line-height` in `px` of an element.

*This method creates a model div element and may cause browser re-draw.
Use with caution.*

### applyStyle

```
applyStyle(
  element: HTMLElement,
  styleObject: StyleObject,
): void

applyStyle(
  styleObject: StyleObject,
  ...elements: HTMLElement[]
): void
```

Apply styles to element or elements.

**Examples**

```typescript
DOMStyle.applyStyle(element, {
  'background-color': 'pink',
  'font-size': 24,
});

DOMStyle.applyStyle({
  'background-color': 'pink',
  'font-size': 24,
}, element, anotherElement);
```

### copyStylesFrom

```
copyStylesFrom(
  from: HTMLElement,
  properties: string | string[],
  ...to: HTMLElement[]
): void
```

**Example**

```typescript
DOMStyle.copyStylesFrom(element, 'font-size', anotherElement, someOtherElement);
```

### clearStyles

`clearStyles(element: HTMLElement): void`

### removeStyles

`removeStyles(element: HTMLElement, properties: string | string[]): void`

### getStyleValue

```
getStyleValue(
  element: HTMLElement,
  property: string,
  stringOnly: boolean = false,
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
  styleProperties: string | string[],
): StyleValue
```

### getFontSize

`getFontSize(element: HTMLElement): number`

Get the computed `font-size` in `px` from an element.

### setFontSize

`setFontSize(element: HTMLElement, fontSize: number): void`

### getBaseFontSize

`getBaseFontSize(): number`

### RemToPx

`RemToPx(rem: number): number`