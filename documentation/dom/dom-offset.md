[Back](../index.md)

# DOMOffset

## Table of Contents

- [DOMOffset](#domoffset)
  - [Table of Contents](#table-of-contents)
  - [Import](#import)
  - [Static Methods](#static-methods)
    - [getElementOffsetFromAnotherElement](#getelementoffsetfromanotherelement)
    - [getElementOffsetFromDocument](#getelementoffsetfromdocument)
    - [getElementOffsetFromView](#getelementoffsetfromview)

## Import

Import **DOMOffset** into your project:

```typescript
import { DOMOffset } from '@nekobird/rocket';
```

## Static Methods

### getElementOffsetFromAnotherElement

```
getElementOffsetFromAnotherElement(
  from: HTMLElement,
  to: HTMLElement,
): FullOffset
```

Get offset from given element to another element, relative to top-left of both elements.

### getElementOffsetFromDocument

```
getElementOffsetFromDocument(
  element: HTMLElement,
): FullOffset
```

### getElementOffsetFromView

```
getElementOffsetFromView(
  element: HTMLElement,
): FullOffset
```
