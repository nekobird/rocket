[Back](../index.md)

# DOMUtil

A collection of static general DOM helper methods.

## Table of Contents

- [DOMUtil](#domutil)
  - [Table of Contents](#table-of-contents)
  - [Import](#import)
  - [Interfaces](#interfaces)
    - [Elements](#elements)
    - [HTMLElements](#htmlelements)
    - [InputOrTextArea](#inputortextarea)
  - [Static Methods](#static-methods)
    - [isElement](#iselement)
    - [isNodeListOfElement](#isnodelistofelement)
    - [isHTMLElement](#ishtmlelement)
    - [isNodeListOfHTMLElement](#isnodelistofhtmlelement)
    - [isHTMLCollection](#ishtmlcollection)
    - [toElementArray](#toelementarray)
    - [toHTMLElementArray](#tohtmlelementarray)
    - [isInputOrTextArea](#isinputortextarea)
    - [prependChild](#prependchild)

## Import

Import **DOMUtil** into your project file.

```typescript
import { DOMUtil } from '@nekobird/rocket';
```

## Interfaces

### Elements

`NodeListOf<Element> | Element[] | HTMLElements`

### HTMLElements

`NodeListOf<HTMLElement> | HTMLCollection | HTMLElement[]`

### InputOrTextArea

`HTMLTextAreaElement | HTMLInputElement`

## Static Methods

### isElement

`isElement(...things: any[]): boolean`

Check if things are an instance of `Element`.

**Example**

```typescript
// Only returns true if everything passed are an instance of Element.
DOMUtil.isHTMLElement(something, anotherThing);
```

### isNodeListOfElement

`isNodeListOfElement(...things: any[]): boolean`

Check if things are an instance of `NodeListOf<Element>`.

**Example**

```typescript
// Only returns true if everything passed are an instance of NodeListOf<Element>.
DOMUtil.isNodeListOfElement(something, anotherThing);
```

### isHTMLElement

`isHTMLElement(...things: any[]): boolean`

Check if things are an instance of `HTMLElement`.

**Example**

```typescript
// Only returns true if everything passed are an instance of HTMLElement.
DOMUtil.isHTMLElement(something, anotherThing);
```

### isNodeListOfHTMLElement

`isNodeListOfHTMLElement(...things: any[]): boolean`

Check if things are an instance of `NodeListOf<HTMLElement>`.

**Example**

```typescript
// Only returns true if everything passed are an instance of NodeListOf<HTMLElement>.
DOMUtil.isNodeListOfHTMLElement(something, anotherThing);
```

### isHTMLCollection

`isHTMLCollection(...things: any[]): boolean`

Check if things are an instance of `HTMLCollection`.

### toElementArray

`toElementArray(elements: Element | Elements): Element[]`

If you enter things that are not `Element` or `Elements`, it will return an empty array.

**Example**

```typescript
const elements = document.querySelector('.stuff');

// returns [element, element...]
const result = DOMUtil.toElementArray(elements);
```

### toHTMLElementArray

`toHTMLElementArray(collection: HTMLElement | HTMLElements): HTMLElement[]`

If you enter things that are not `HTMLElement` or `HTMLElements`, it will return an empty array.

**Example**

```typescript
const collections = document.getElementsByTagName('div');

// returns [div, div...]
const result = DOMUtil.toHTMLElementArray(collections);
```

### isInputOrTextArea

`isInputOrTextArea(...things: any[]): boolean`

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
