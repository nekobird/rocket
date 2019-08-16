[Back](../index.md)

# DOMTraverse

A collection of static methods to help you traverse the DOM and do stuff along the way.

## Import

Import **DOMTraverse** into your project file.

```typescript
import { DOMTraverse } from '@nekobird/rocket';
```

## Interfaces

### DOMTraverseInspectFunction

`(element: HTMLElement): true | void`

A function that takes in a HTMLElement and optionally return `true` if you want the inspection to stop.

### DOMTraverseIdentifyElementFunction

`(element: HTMLElement): boolean`

A function that takes in a HTMLElement and returns a `boolean`.
This is used for identifying an element while traversing.

### DOMTraverseExtractFunction

`(child: HTMLElement): T | void`

A function that takes in a HTMLElement and returns something `<T>` that you want to extract
from that element.

### DOMTraverseResult

`HTMLElement | HTMLElement[] | false`

## Methods

### ascendFrom

```
ascendFrom(
  from: HTMLElement,
  inspect: DOMTraverseInspectFunction,
): void
```

This method takes in an element to start traversing from and a `DOMTraverseInspectElementFunction` function.
It will then loop through each parent, passing it to the inspect function, until it returns true or it reached the root, `HTML` element.

#### Example

```typescript
// This will loop through element's ancestor all the way to the root,
// unless the identify function returns true.
DOMTraverse.ascendFrom(from, parent => {
  // Do something with each parent element.
  if (parent.id === 'target_ancestor') {
    // If true is returned, the traversal will stop.
    return true;
  }
});
```

### descendFrom

```
descendFrom(
  from: HTMLElement,
  inspect: DOMTraverseInspectFunction,
): void
```

This method takes in an element to start descending from and a `DOMTraverseInspectElementFunction` function.
It will then loop through each child, passing it to to the identify function, until it returns true or it passed through all the child nodes.

#### Example

```typescript
DOMTraverse.descendFrom(element, child => {
  if (child.id === 'target_child') {
    // Stop traversal when this function returns true.
    return true;
  }
});
```

### findAncestor

```
findAncestor(
  from: HTMLElement,
  identifyElement: DOMTraverseIdentifyElementFunction,
  getAll: boolean = false,
): DOMTraverseResult
```

This method takes in an element that you want to start traversing from and a `DOMTraverseIdentifyElementFunction` function.
It will then loop through each ancestor, passing it to the inspect function, until it returns true or it reached the root `HTML` element.

#### Example

```typescript
DOMTraverse.findAncestor(from, element => {
  if (element === anotherElement) {
    return true;
  }
}, true);
```

### findDescendant

```
findDescendant(
  from: HTMLElement,
  identifyElement: DOMTraverseIdentifyElementFunction,
  getAll: boolean = false,
): DOMTraverseResult
```

This method takes in an element that you want to start traversing from and a `DOMTraverseIdentifyElementFunction` function.
It will then loop through each ancestor, passing it to the inspect function, until it returns true or it reached the root `HTML` element.

#### Example

```typescript
// This will loop through element's ancestor all the way to the root,
// unless the identify function returns true.
DOMTraverse.findAncestor(from, parent => {
  // Do something with each parent element.
  if (parent.id === 'target_ancestor') {
    // If true is returned, the traversal will stop.
    return true;
  }
}, true);
```

### findAncestorWithClass

```
findAncestorWithClass(
  from: HTMLElement,
  classNames: string | string[],
  getAll: boolean = false,
): DOMTraverseResult
```

Find a parent ancestor element with given classnames.

#### Example

```typescript
DOMTraverse.findAncestorWithClass(from, ['class-0', 'class-1'], true);
```

### findDescendantWithClass

```
findDescendantWithClass(
  from: HTMLElement,
  classNames: string | string[],
  getAll: boolean = false,
): DOMTraverseResult
```

Find a parent ancestor element with given classnames.

#### Example

```typescript
DOMTraverse.findDescendantWithClass(from, ['class-0', 'class-1'], true);
```

### findAncestorWithId

```
findAncestorWithId(
  from: HTMLElement,
  id: string,
  getAll: boolean = false,
): DOMTraverseResult
```

### findDescendantWithId

```
findDescendantWithId(
  from: HTMLElement,
  id: string,
  getAll: boolean = false,
): DOMTraverseResult
```

### hasAncestor

```
hasAncestor(
  from: HTMLElement,
  options: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
): DOMTraverseResult
```

### hasDescendant

```
hasDescendant(
  from: HTMLElement,
  options: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
): DOMTraverseResult
```

### getSiblings

```
getSiblings(
  element: HTMLElement,
  isExclusive: boolean = false,
): HTMLElement[] | false
```

### findSibling

### findNextSibling

### findSiblingWithClass

### getChildren

### getNthChild

### removeChildren

### removeChild

### mapDataFromChildren