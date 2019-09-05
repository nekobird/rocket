[Back](../index.md)

# DOMTraverse

A collection of static methods to help you traverse the DOM and do stuff along the way.

## Table of Contents

- [DOMTraverse](#domtraverse)
  - [Table of Contents](#table-of-contents)
  - [Import](#import)
  - [Interfaces](#interfaces)
    - [DOMTraverseInspectFunction](#domtraverseinspectfunction)
    - [DOMTraverseIdentifyElementFunction](#domtraverseidentifyelementfunction)
    - [DOMTraverseExtractFunction](#domtraverseextractfunction)
    - [DOMTraverseResult](#domtraverseresult)
  - [Methods](#methods)
    - [ascendFrom](#ascendfrom)
    - [descendFrom](#descendfrom)
    - [findAncestor](#findancestor)
    - [findDescendant](#finddescendant)
    - [findAncestorWithClass](#findancestorwithclass)
    - [findDescendantWithClass](#finddescendantwithclass)
    - [findAncestorWithId](#findancestorwithid)
    - [findDescendantWithId](#finddescendantwithid)
    - [hasAncestor](#hasancestor)
    - [hasDescendant](#hasdescendant)
    - [getSiblings](#getsiblings)
    - [findSibling](#findsibling)
    - [findNextSibling](#findnextsibling)
    - [findSiblingWithClass](#findsiblingwithclass)
    - [getChildren](#getchildren)
    - [getNthChild](#getnthchild)
    - [removeChildren](#removechildren)
    - [removeChild](#removechild)
    - [mapDataFromChildren](#mapdatafromchildren)

## Import

Import **DOMTraverse** into your project file.

```typescript
import { DOMTraverse } from '@nekobird/rocket';
```

## Interfaces

### DOMTraverseInspectFunction

`(element: Element): true | void`

A function that takes in an `Element` and, optionally, return `true` if you want to stop further traversal.

### DOMTraverseIdentifyElementFunction

`(element: Element): boolean`

A function that takes in an `Element` and returns a `boolean`.
This is used for identifying an element while traversing.

### DOMTraverseExtractFunction

`(child: Element): T | void`

A function that takes in an `Element` and returns something `<T>` that you want to extract
from that element.

### DOMTraverseResult

`Element | Element[] | null`

## Methods

### ascendFrom

```
ascendFrom(
  from: Element,
  inspect: DOMTraverseInspectFunction,
  to: Element = document.documentElement,
): void
```

This method takes in an `Element` to start traversing from and a `DOMTraverseInspectElementFunction` function.
It will then loop through each parent, passing it to the inspect function, until it returns true or it reached the root, `HTML` element.

**Example**

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
  from: Element,
  inspect: DOMTraverseInspectFunction,
): void
```

This method takes in an element to start descending from and a `DOMTraverseInspectElementFunction` function.
It will then loop through each child, passing it to to the identify function, until it returns true or it passed through all the child nodes.

**Example**

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
  from: Element,
  identifyElement: DOMTraverseIdentifyElementFunction,
  getAllMatchingAncestors: boolean = false,
): DOMTraverseResult
```

This method takes in an `Element` that you want to start traversing from and a `DOMTraverseIdentifyElementFunction` function.
It will then loop through each ancestor, passing it to the inspect function, until it returns true or it reached the root `HTML` element.

**Example**

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
  from: Element,
  identifyElement: DOMTraverseIdentifyElementFunction,
  getAllMatchingDescendants: boolean = false,
): DOMTraverseResult
```

This method takes in an `Element` that you want to start traversing from and a `DOMTraverseIdentifyElementFunction` function.
It will then loop through each ancestor, passing it to the inspect function, until it returns true or it reached the root `HTML` element.

**Example**

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
  from: Element,
  classNames: string | string[],
  getAllMatchingAncestors: boolean = false,
): DOMTraverseResult
```

Find a parent ancestor element with given classnames.

**Example**

```typescript
DOMTraverse.findAncestorWithClass(from, ['class-0', 'class-1'], true);
```

### findDescendantWithClass

```
findDescendantWithClass(
  from: Element,
  classNames: string | string[],
  getAllMatchingDescendants: boolean = false,
): DOMTraverseResult
```

Find a parent ancestor element with given classnames.

**Example**

```typescript
DOMTraverse.findDescendantWithClass(from, ['class-0', 'class-1'], true);
```

### findAncestorWithId

```
findAncestorWithId(
  from: Element,
  id: string,
  getAllMatchingAncestors: boolean = false,
): DOMTraverseResult
```

### findDescendantWithId

```
findDescendantWithId(
  from: Element,
  id: string,
  getAllMatchingDescendants: boolean = false,
): DOMTraverseResult
```

### hasAncestor

```
hasAncestor(
  from: Element,
  options: Element | Elements,
): boolean
```

### hasDescendant

```
hasDescendant(
  from: Element,
  options: Element | Elements,
): boolean
```

### getSiblings

```
getSiblings(
  element: Element,
  isExclusive: boolean = false,
): Element[] | false
```

### findSibling

```
findSibling(
  element: Element,
  identifyElement: DOMTraverseIdentifyElementFunction,
  getAllMatchingSiblings = true,
): DOMTraverseResult
```

### findNextSibling

```
findNextSibling(
  element: Element,
  identifyElement: DOMTraverseIdentifyElementFunction,
): Element | false
```

### findSiblingWithClass

```
findSiblingWithClass(
  element: Element,
  classNames: string | string[],
  getAllMatchingSiblings: boolean = false,
): DOMTraverseResult
```

### getChildren

```
getChildren(
  element: Element,
  identifyElement?: DOMTraverseIdentifyElementFunction,
): Element[]
```

### getNthChild

```
getNthChild(
  n: number | 'last',
  element: Element,
  identifyElement?: DOMTraverseIdentifyElementFunction,
): Element | false
```

### removeChildren

`removeChildren(element: Element): number`

### removeChild

```
removeChild(
  element: Element,
  identifyElement: DOMTraverseIdentifyElementFunction,
): number
```

### mapDataFromChildren

```
mapDataFromChildren<T>(
  element: Element,
  extractFunction: DOMTraverseExtractFunction<T>,
  identifyElement?: DOMTraverseIdentifyElementFunction,
): T[]
```
