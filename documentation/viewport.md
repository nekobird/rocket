[Back](./index.md)

# Viewport

Viewport is the visible viewing region of your document.
This static class helps you get useful, accurate, and reliable viewport information.

## Import

Import **`Viewport`** into your project file.

```typescript
import { Viewport } from '@nekobird/rocket';
```

## Static Methods

### setScrollToggleElement

`setScrollToggleElement(element: HTMLElement): void`

### disableScrolling

`disableScrolling(isLocked: boolean = false, forceHideScrollbar: boolean = false): void`

### enableScrolling

`enableScrolling(unlock: boolean = false): void`

### scrollTo

`scrollTo(left: number, top: number): void`

## Static Properties

### scrollingIsEnabled

`scrollingIsEnabled: boolean`

Check to see if scrolling is enabled.

### scrollingIsDisabled

`scrollingIsDisabled: boolean`

Check to see if scrolling is disabled.

### scrollingIsLocked

`scrollingIsLocked: boolean`

Check to see if scrolling is locked.

### hasHorizontalScrollBar

`hasHorizontalScrollBar: boolean`

Check to see if horizontal scroll bar is present.

### hasVerticalScrollBar

`hasVerticalScrollBar: boolean`

### centerPoint

`centerPoint: Point`

### centerX

`centerX: number`

### centerY

`centerY: number`

### width

`width: number`

### height

`height: number`

### diagonal

`diagonal: number`
