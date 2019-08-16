[Back](../index.md)

# Num

A utility library for dealing with numbers.

## Import

Import **Num** into your project file.

```typescript
import { Num } from '@nekobird/rocket';
```

## Static Methods

### average

`average(...numbers): number`

Calculate the average of numbers given in the arguments.
You need to enter at least two numbers or else it will throw an error.

#### Example

```typescript
// Returns 2
Num.average(1, 2, 3);
```

### constrain

`constrain(value: number, range: NumberOrRange): number`

Constrain a number to given range.

#### Example

```typescript
// Returns 3
Num.constrain(4, [1, 3]);

// Returns -2
Num.constrain(-10, [-2, 4]);

// Returns 6
Num.constrain(8, [6, 4]);

// Returns 0
// If you enter a number for range it will
// assume the minimum or maximum is 0.
Num.constrain(-1, 5);
```

### cycle

`cycle(value: number, range: NumberOrRange): number`

Cycle number within given range.

#### Example

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

Get the euclidean distance between two numbers.

#### Example

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

### hypotenuse

`hypotenuse(x: number, y: number): number`

A [more efficient](http://www.johndcook.com/blog/2010/06/02/whats-so-hard-about-finding-a-hypotenuse/) way of calculating hypotenuse (Pythagorean Theorem).

#### Example

```typescript
// Returns 5
Num.hypotenuse(3, 4);
```

### reciprocal

`reciprocal(number: number): number`

Get reciprocal of a number (1/n).
This will throw an error if n is 0.

#### Example

```typescript
// Returns 0.5
Num.reciprocal(1);
```

### roundTo

`roundTo(number: number, to?: number): number`

This will round number to specified decimal point.
If `to` is not defined, it will default to 0 decimal point.

#### Example

```typescript
// Returns 3.14
Num.roundTo(3.1415, 2);
```

### lerp

`lerp(t: number, from: number, to: number): number`

Linear interpolation.

### cubicBezier

`cubicBezier(t: number, p1: number, cp1: number, cp2: number, p2: number): number`

Cubic Bezier interpolation.

### modulate

```
modulate(
  number: number,
  from: NumberOrRange,
  to: NumberOrRange,
  constrain: boolean = true
): number
```

Map a number from one range to another.
The last flag, if set to true, will constrain the number within that target range.

#### Example

```typescript
// Returns 1
Num.modulate(0.5, 1, 2, true);

// Returns 1.5
Num.modulate(0.75, [0.5, 1], [1, 2], true);
```

### random

```
random(
  range: NumberOrRange,
  whole: boolean = false,
  fixed: number = 2
): number
```

Returns a random number, given range.

#### Example

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

### sum

`sum(...numbers: number[]): number`

Sum all the numbers given in the parameter.

#### Example

```typescript
// Returns 10
Num.sum(1, 2, 3, 4);
```

### within

`within(number: number, range: NumberOrRange): boolean`

Returns true if number is within given range.

#### Example

```typescript
// Returns true.
Num.within(5, [2, 6]);
```

### getSign

`getSign(n: number): number`

Similar to `Math.sign()` but returns 1 if 0 is given.

#### Example

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
