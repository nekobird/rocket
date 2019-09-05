[Back](../index.md)

# DOMTraverse

A collection of static methods to help you traverse the DOM and do stuff along the way.

## Table of Contents

- [DOMTraverse](#domtraverse)
  - [Table of Contents](#table-of-contents)
  - [Import](#import)
  - [Interfaces](#interfaces)
    - [DOMTraverseInspectFunction](#domtraverseinspectfunction)
    - [DOMTraverseIdentifyFunction](#domtraverseidentifyfunction)
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

### DOMTraverseIdentifyFunction

`(element: Element): boolean`

A function that takes in an `Element` and returns a `boolean`.
This is used for identifying an element while traversing.

### DOMTraverseExtractFunction

`(child: Element): T | void`

A function that takes in an `Element` and returns something `<T>` that you want to extract
from that element.

### DOMTraverseResult

`Element | Element[] | null`

Usually `null` is returned when there is no match.

## Methods

### ascendFrom

```
ascendFrom(
  from: Element,
  inspect: DOMTraverseInspectFunction,
  to: Element = document.documentElement,
): void
```

This method takes in an `Element` and a `DOMTraverseInspectElementFunction` function.
It will then loop through each parent from, starting from the given `from` element and passing each parent to the inspect function. It stops traversing if the inspect function returns `true` or it reached the `to` or root element.

**Example**

```typescript
DOMTraverse.ascendFrom(from, element => {
  if (element.dataset.name === 'pikachu') {
    // Do something with parent element.
    iChooseYou(element);

    // Stop traversing.
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

This method takes in an `Element` and a `DOMTraverseInspectElementFunction` function.
It will then loop through each child, starting from the given `from` element and passing each child to the identify function. It stops traversing if the inspect function returns `true` or it passed through all child nodes.

**Example**

```typescript
DOMTraverse.descendFrom(element, element => {
  if (element.dataset.name === 'eevee') {
    // Do something with child element.
    iChooseYou(element);

    // Stop traversing.
    return true;
  }
});
```

### findAncestor

```
findAncestor(
  from: Element,
  identifyElement: DOMTraverseIdentifyFunction,
  getAllMatchingAncestors: boolean = false,
): DOMTraverseResult
```

Similar to `ascendFrom`, but it return elements that when passed into the `identifyElement` function returns `true`. It only returns the first element that matched and stops traversing unless you set the `getAllMatchingAncestors` flag to `true`, then it will continue traversing and return an array of elements that matches.

**Examples**

```typescript
// Returns matchedElement
DOMTraverse.findAncestor(from, element => {
  if (element.dataset.category === 'pokemon') {
    return true;
  }
});

// Returns [matchedElement, anotherMatchedElement ...]
DOMTraverse.findAncestor(from, element => {
  if (element.dataset.category === 'pokemon') {
    return true;
  }
}, true);
```

### findDescendant

```
findDescendant(
  from: Element,
  identifyElement: DOMTraverseIdentifyFunction,
  getAllMatchingDescendants: boolean = false,
): DOMTraverseResult
```

Similar to `descendFrom`, but it return elements that when passed into the `identifyElement` function returns `true`. It only returns the first element that matched and stops traversing unless you set the `getAllMatchingDescendants` flag to `true`, then it will continue traversing and return an array of elements that matches.

**Examples**

```typescript
// Returns matchedElement
DOMTraverse.findDescendant(from, element => {
  if (element.dataset.category === 'digimon') {
    return true;
  }
});

// Returns [matchedElement, anotherMatchedElement ...]
DOMTraverse.findDescendant(from, element => {
  if (element.dataset.category === 'digimon') {
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

**Examples**

```html
<div class="heaven">
  <div class="earth">
    <div class="limbo">
      <div class="hell">From</div>
    </div>
  </div>
</div>
```

```typescript
const from = document.querySelector('.hell');

// Returns div.earth
DOMTraverse.findAncestorWithClass(from, ['earth', 'heaven']);

// Returns [div.earth, div.heaven]
DOMTraverse.findAncestorWithClass(from, ['earth', 'heaven'], true);
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
): Element[] | null
```

### findSibling

```
findSibling(
  element: Element,
  identifyElement: DOMTraverseIdentifyFunction,
  getAllMatchingSiblings = true,
): DOMTraverseResult
```

### findNextSibling

```
findNextSibling(
  element: Element,
  identifyElement: DOMTraverseIdentifyFunction,
): Element | null
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
  identifyElement?: DOMTraverseIdentifyFunction,
): Element[]
```

### getNthChild

```
getNthChild(
  n: number | 'last',
  element: Element,
  identifyElement?: DOMTraverseIdentifyFunction,
): Element | null
```

### removeChildren

`removeChildren(element: Element): number`

### removeChild

```
removeChild(
  element: Element,
  identifyElement: DOMTraverseIdentifyFunction,
): number
```

### mapDataFromChildren

```
mapDataFromChildren<T>(
  element: Element,
  extractFunction: DOMTraverseExtractFunction<T>,
  identifyElement?: DOMTraverseIdentifyFunction,
): T[]
```
