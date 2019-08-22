# Interfaces

## `Size`

```
width: number
height: number
```

## `Offset`

```
left: number
top: number
```

## `FullOffset`

```
left: number
top: number
right: number
bottom: number
```

`FullOffset` is an extension of `Offset`.

## `Rectangle`

```
left: number
top: number
right: number
bottom: number
center: Point
```

`Rectangle` is an extension of `FullOfsset` and `Size`.

# Types

## `RangeArray`

`[number, number]`

An array containing two numbers.
Usually to represent min and max value.

## `NumberOrRange`

`number | RangeArray`

A number or an array containing two numbers.