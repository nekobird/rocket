[Back](../index.md)

# `DOMUtil`

A collection of static general DOM helper methods.

## Import

Import **DOMUtil** into your project file.

```typescript
import { DOMUtil } from '@nekobird/rocket';
```

## Interfaces

### HTMLElements

`NodeListOf<HTMLElement> | HTMLCollection | HTMLElement[]`

## Static Methods

### isHTMLElement

`isHTMLElement(...things): boolean`

Check if something is a valid `HTMLElement`.

#### Example

```typescript
// Only returns true if everything passed are HTMLElement.
DOMUtil.isHTMLElement(something, anotherThing);
```

### isNodeListOfHTMLElement

`isNodeListOfHTMLElement(...things): boolean`

Check if something is a valid NodeListOf<HTMLElement>.

#### Example

```typescript
// Only returns true if everything passed are NodeListOf<HTMLElement>.
DOMUtil.isNodeListOfHTMLElement(something, anotherThing);
```

### isHTMLCollection

`isHTMLCollection(...things): boolean`

### toHTMLElementArray

`toHTMLElementArray(collection: HTMLElement | HTMLElements): HTMLElement[]`

If you enter things that are not `HTMLElements` or `HTMLElement`, it will return an empty array.

#### Example

```typescript
const collections = document.getElementsByTagName('div');

// returns [div, div...]
const result = DOMUtil.toHTMLElementArray(collections);
```

### prependChild

`prependChild(parent: HTMLElement, child: HTMLElement)`

Prepend an element inside another element.

#### Example

```typescript
const parentElement = document.querySelector('.targetParent');
const child = document.createElement('DIV');
child.textContent = 'Hi';
DOMUtil.prependChild(parentElement, child);
// parentElement
// - child
// - another element
```
