[Back](./index.md)

# Interfaces

Set of interfaces and types used throughout the library.

## Table of Contents

- [Interfaces](#interfaces)
  - [Table of Contents](#table-of-contents)
  - [Interfaces](#interfaces-1)
    - [Size](#size)
    - [Offset](#offset)
    - [FullOffset](#fulloffset)
    - [Rectangle](#rectangle)
  - [Types](#types)
    - [RangeArray](#rangearray)
    - [NumberOrRange](#numberorrange)

## Interfaces

### Size

```
width: number
height: number
```

### Offset

```
left: number
top: number
```

### FullOffset

```
left: number
top: number
right: number
bottom: number
```

`FullOffset` is an extension of `Offset`.

### Rectangle

```
left: number
top: number
right: number
bottom: number
center: Point
```

`Rectangle` is an extension of `FullOfsset` and `Size`.

## Types

### RangeArray

`[number, number]`

An array containing two numbers.
Usually to represent **min** and **max** value.

**Examples**

```typescript
const a: RangeArray = [0, 1];

const b: RangeArray = [20, 100];
```

### NumberOrRange

`number | RangeArray`

A number or an array containing two numbers.

**Examples**

```typescript
const a: NumberOrRange = 1;

const b: NumberOrRange = [20, 100];
```