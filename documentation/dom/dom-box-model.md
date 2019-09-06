[Back]('../index.md')

# DOMBoxModel

## Table of Contents

- [DOMBoxModel](#domboxmodel)
  - [Table of Contents](#table-of-contents)
  - [Import](#import)
  - [Static Methods](#static-methods)
    - [getTotalHorizontalMargins](#gettotalhorizontalmargins)
    - [getTotalVerticalMargins](#gettotalverticalmargins)
    - [getTotalHorizontalBorderWidths](#gettotalhorizontalborderwidths)
    - [getTotalVerticalBorderWidths](#gettotalverticalborderwidths)
    - [getTotalHorizontalPaddings](#gettotalhorizontalpaddings)
    - [getTotalVerticalPaddings](#gettotalverticalpaddings)
    - [getTotalHorizontalInnerSpace](#gettotalhorizontalinnerspace)
    - [getTotalVerticalInnerSpace](#gettotalverticalinnerspace)
    - [getTotalHorizontalOuterSpace](#gettotalhorizontalouterspace)
    - [getTotalVerticalOuterSpace](#gettotalverticalouterspace)
    - [getTotalHorizontalDimension](#gettotalhorizontaldimension)
    - [getTotalVerticalDimension](#gettotalverticaldimension)
    - [getContentWidth](#getcontentwidth)
    - [getContentHeight](#getcontentheight)

## Import

```typescript
import { DOMBoxModel } from '@nekobird/rocket'
```

## Static Methods

### getTotalHorizontalMargins

`getTotalHorizontalMargins(element: HTMLElement): number`

### getTotalVerticalMargins

`getTotalVerticalMargins(element: HTMLElement): number`

### getTotalHorizontalBorderWidths

`getTotalHorizontalBorderWidths(element: HTMLElement): number`

### getTotalVerticalBorderWidths

`getTotalVerticalBorderWidths(element: HTMLElement): number`

### getTotalHorizontalPaddings

`getTotalHorizontalPaddings(element: HTMLElement): number`

### getTotalVerticalPaddings

`getTotalVerticalPaddings(element: HTMLElement): number`

### getTotalHorizontalInnerSpace

`getTotalHorizontalInnerSpace(element: HTMLElement): number`

### getTotalVerticalInnerSpace

`getTotalVerticalInnerSpace(element: HTMLElement): number`

### getTotalHorizontalOuterSpace

`getTotalHorizontalOuterSpace(element: HTMLElement): number`

### getTotalVerticalOuterSpace

`getTotalVerticalOuterSpace(element: HTMLElement): number`

### getTotalHorizontalDimension

```
getTotalHorizontalDimension(
  element: HTMLElement,
  includeTransform: boolean = false,
): number
```

### getTotalVerticalDimension

```
getTotalVerticalDimension(
  element: HTMLElement,
  includeTransform: boolean = false,
): number
```

### getContentWidth

`getContentWidth(element: HTMLElement): number`

### getContentHeight

`getContentHeight(element: HTMLElement): number`
