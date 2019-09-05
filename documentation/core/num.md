[Back](../index.md)

# Num

Num provides useful helper methods for dealing with numbers.

## Table of Contents

- [Num](#num)
  - [Table of Contents](#table-of-contents)
  - [Import](#import)
  - [Static Methods](#static-methods)
    - [average](#average)
    - [clamp](#clamp)
    - [countDigits](#countdigits)
    - [cubicBezier](#cubicbezier)
    - [cycle](#cycle)
    - [getEuclideanDistance](#geteuclideandistance)
    - [getSign](#getsign)
    - [hypotenuse](#hypotenuse)
    - [lerp](#lerp)
    - [random](#random)
    - [reciprocal](#reciprocal)
    - [roundTo](#roundto)
    - [sum](#sum)
    - [transform](#transform)
    - [within](#within)


## Import

Import **Num** into your project file.

```typescript
import { Num } from '@nekobird/rocket';
```

## Static Methods

### average

`average(...values: number[]): number`

Calculate the average of the arguments.
You need to enter at least two numbers or else it will throw an error.

**Examples**

```typescript
// Returns 2
Num.average(1, 2, 3);

// Returns 5
Num.average(...[4, 5, 6]);
```

### clamp

```
clamp(value: number, min: number, max: number): number
clamp(value: number, range: NumberOrRange): number
```

Constrain a number to a range.

**Examples**

```typescript
// Returns 3
Num.clamp(4, [1, 3]);

// Returns -2
Num.clamp(-10, [-2, 4]);

// Returns 6
Num.clamp(8, [6, 4]);

// Returns 0
// If you enter a number for range it will
// assume the minimum or maximum is 0.
Num.clamp(-1, 5);
```

### countDigits

`countDigits(value: number): number`

Count the number of digits of given number.

**Examples**

```typescript
// Returns 5
Num.countDigits(12345);

// Returns 6
Num.countDigits(123.123);
```

### cubicBezier

`cubicBezier(t: number, p1: number, cp1: number, cp2: number, p2: number): number`

Cubic Bezier interpolation.

### cycle

```
cycle(
  value: number,
  range: NumberOrRange,
): number
```

Cycle number within given range.

**Examples**

```typescript
// Returns 1
Num.cycle(2, 1);

// Returns 2
Num.cycle(-1, [0, 3])

// Returns 4
Num.cycle(2, [3, 5]);
```

### getEuclideanDistance

`getEuclideanDistance(a: number, b: number): number`

Calculate the euclidean distance between two numbers.

**Examples**

```typescript
// Returns 4
Num.getEuclideanDistance(1, 5);

// Returns 8
Num.getEuclideanDistance(-3, 5);

// Returns 8
Num.getEuclideanDistance(5, -3);

// Returns 2
Num.getEuclideanDistance(-3, -5);
```

### getSign

`getSign(value: number): number`

Similar to `Math.sign()` but returns **1** if **0** is given.

**Examples**

```typescript
// Returns 1
Num.getSign(42);

// Returns -1
Num.getSign(-42);

// Returns 1
Num.getSign(0);

// Returns 1
Num.getSign(-0);
```

### hypotenuse

`hypotenuse(x: number, y: number): number`

A [more efficient way](http://www.johndcook.com/blog/2010/06/02/whats-so-hard-about-finding-a-hypotenuse/) of calculating hypotenuse (Pythagorean Theorem).

**Examples**

```typescript
// Using Pythagorean Triples for examples.

// Returns 5
Num.hypotenuse(3, 4);

// Returns 10
Num.hypotenuse(6, 8);
```

### lerp

`lerp(t: number, from: number, to: number): number`

Linear interpolation.

**Examples**

```typescript
// Returns 50
Num.lerp(0.5, 0, 100);

// Returns 150
Num.lerp(1.5, 0, 100);
```

### random

```
random(
  range: NumberOrRange,
  whole: boolean = false,
  fixed: number = 2,
): number
```

Returns a random number, given range.

**Examples**

```typescript
// Returns a random integer between 0 - 10.
Num.random(10);

// If you enter 1 as range:
// Returns a random decimal up to the fixed number.
Num.random(1);

// Returns 1 or 0 if second parameter is set to true.
Num.random(1, true);

// Returns a random decimal up to 4 decimal points.
// whole flag must be set to false.
// Example: 0.5563
Num.random(1, false, 4);
```

### reciprocal

`reciprocal(value: number): number`

Get reciprocal of a number `1 / n`.
This will throw an error if `value` given is 0.

**Example**

```typescript
// Returns 0.5
Num.reciprocal(1);
```

### roundTo

`roundTo(value: number, to: number = 0): number`

This will round number to specified decimal point.
If `to` is not defined, it will default to 0 decimal point.

**Example**

```typescript
// Returns 3.14
Num.roundTo(3.1415, 2);
```

### sum

`sum(...values: number[]): number`

Sum all the arguments (Assuming they are all numbers).

**Examples**

```typescript
// Returns 6
Num.sum(4, 2, 0);

// Returns 10
Num.sum(1, 2, 3, 4)
```

### transform

```
transform(
  value: number,
  from: NumberOrRange,
  to: NumberOrRange,
  clamp: boolean = true,
): number
```

Map a number from one range to another.
The last flag, if set to `true`, will clamp the number within the target range.

**Examples**

```typescript
// Returns 1
Num.transform(0.5, 1, 2);

// Returns 1.5
Num.transform(0.75, [0.5, 1], [1, 2]);
```

### within

```
within(
  value: number,
  min: number,
  max: number,
  isExclusive?: boolean,
): boolean

within(
  value: number,
  range: NumberOrRange,
  isExclusive?: boolean,
): boolean
```

Check to see if a number is within a given range.

**Examples**

```typescript
// Returns true
Num.within(0.5, 1);
Num.within(1, 1.5, 2);
Num.within(2, [1, 2]);

// Returns false
Num.within(0, 1, true);
Num.within(1, 1, 2, true);
Num.within(1, [1, 2], true);
```
