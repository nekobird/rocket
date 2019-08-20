[Back](../index.md)

# DOMOffset

## Import

Import **DOMOffset** into your project:

```typescript
import { DOMOffset } from '@nekobird/rocket';
```

## Static Properties

### getElementOffsetFromAnotherElement

```
getElementOffsetFromAnotherElement(
  from: HTMLElement,
  to: HTMLElement
): FullOffset
```

Get offset from given element to another element, relative to top-left of both elements.

### getElementOffsetFromDocument

```
getElementOffsetFromDocument(
  element: HTMLElement
): FullOffset
```

### getElementOffsetFromView Methods

```
getElementOffsetFromView(
  element: HTMLElement
): FullOffset
```
