[Back](../index.md)

# DOMUtil

A collection of static general DOM helper methods.

## Table of Contents

- [DOMUtil](#domutil)
  - [Table of Contents](#table-of-contents)
  - [Import](#import)
  - [Interfaces](#interfaces)
    - [HTMLElements](#htmlelements)
    - [InputOrTextArea](#inputortextarea)
  - [Static Methods](#static-methods)
    - [isHTMLElement](#ishtmlelement)
    - [isNodeListOfHTMLElement](#isnodelistofhtmlelement)
    - [isHTMLCollection](#ishtmlcollection)
    - [isInputOrTextArea](#isinputortextarea)
    - [toHTMLElementArray](#tohtmlelementarray)
    - [prependChild](#prependchild)

## Import

Import **DOMUtil** into your project file.

```typescript
import { DOMUtil } from '@nekobird/rocket';
```

## Interfaces

### HTMLElements

`NodeListOf<HTMLElement> | HTMLCollection | HTMLElement[]`

### InputOrTextArea

`HTMLTextAreaElement | HTMLInputElement`

## Static Methods

### isHTMLElement

`isHTMLElement(...things: any[]): boolean`

Check if something is a valid `HTMLElement`.

**Example**

```typescript
// Only returns true if everything passed are HTMLElement.
DOMUtil.isHTMLElement(something, anotherThing);
```

### isNodeListOfHTMLElement

`isNodeListOfHTMLElement(...things: any[]): boolean`

Check if something is a valid NodeListOf<HTMLElement>.

**Example**

```typescript
// Only returns true if everything passed are NodeListOf<HTMLElement>.
DOMUtil.isNodeListOfHTMLElement(something, anotherThing);
```

### isHTMLCollection

`isHTMLCollection(...things: any[]): boolean`

### isInputOrTextArea

`isInputOrTextArea(...things: any[]): boolean`

### toHTMLElementArray

`toHTMLElementArray(collection: HTMLElement | HTMLElements): HTMLElement[]`

If you enter things that are not `HTMLElements` or `HTMLElement`, it will return an empty array.

**Example**

```typescript
const collections = document.getElementsByTagName('div');

// returns [div, div...]
const result = DOMUtil.toHTMLElementArray(collections);
```

### prependChild

`prependChild(parent: HTMLElement, child: HTMLElement)`

Prepend an element inside another element.

**Example**

```typescript
const parentElement = document.querySelector('.targetParent');
const child = document.createElement('DIV');
child.textContent = 'Hi';
DOMUtil.prependChild(parentElement, child);
// parentElement
// - child
// - another element
```
