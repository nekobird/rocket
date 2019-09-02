[Back](../index.md)

# `DOMText`

A collection of static helper that helps you with text and text-boxes.

## Import

Import **`DOMText`** into your project file.

```typescript
import { DOMText } from '@nekobird/rocket';
```

## Static Methods

### getTextBoxHeightFromElement

```
getTextBoxHeightFromElement(
  element: HTMLElement,
  text?: string,
  styleOverride?: StyleObject
): number
```

**Warning**: This may impact performance, since it creates an element into the DOM as a model to calculate the text-box height.

#### Example

```typescript
// Returns the 'text-box height' of the element
// if you would want to set the element flush to the text content.
DOMText.getTextBoxHeightFromElement(element);
```

### getTextBoxWidthFromElement

```
getTextBoxWidthFromElement(
  element: HTMLElement,
  text?: string,
  styleOverride?: StyleObject
): number
```

**Warning**: This may impact performance, since it creates an element into the DOM as a model to calculate the text-box width.

#### Example

```typescript
// Returns the 'text-box height' of the element
// if you would want to set the element flush to the text content.
DOMText.getTextBoxWidthFromElement(element);
```
