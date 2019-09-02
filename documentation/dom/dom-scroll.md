[Back](../index.md)

# DOMScroll

A collection of scroll helpers.

## Import

Import **`DOMScroll`** into your project:

```typescript
import { DOMScroll } from '@nekobird/rocket';
```

## Static Properties

### scrollLeft

`scrollLeft: number`

This is a `readonly` property that returns the current document scroll left location from the viewport.

### scrollTop

`scrollTop: number`

This is a `readonly` property that returns the current document scroll top location from the viewport.

## Static Methods

### getScrollLeftToElement

`getScrollLeftToElement(...elements: HTMLElement[]): number`

### getScrollTopToElement

`getScrollTopToElement(...elements: HTMLElement[]): number`

### getScrollLeftToElementsCenterFrame

`getScrollLeftToElementsCenterFrame(...elements: HTMLElement[]): number`

### getScrollTopToElementsCenterFrame

`getScrollTopToElementsCenterFrame(...elements: HTMLElement[]): number`

### getScrollToElementsCenterFrame

`getScrollToElementsCenterFrame(...elements: HTMLElement[]): Offset`