[Back](../index.md)

# Util

A collection of general static utility methods.

## Import

Import **Util** into your project file.

```typescript
import { Util } from '@nekobird/rocket';
```

## Static Methods

### isPromise

`isPromise(...things): boolean`

Check to see if the given arguments are all a promise object.

#### Example

```typescript
// Returns true if each of the arguments is a promise object.
Util.isPromise(a, b, c);
```

### promiseEach

`promiseEach<A>(array: A[], func: (value: A) => Promise<void>): Promise<void>`

Takes in an array of values and a function that returns a promise. 
It will then loop through the array and pass each value to the function.
Finally, it will chain the promise objects returned by the function.

### promiseChain

`promiseChain(...funcs: (() => Promise<void>)[]): Promise<void>`

This will chain the promise object returned by each function in the arguments.

### cycleArrayNext

`cycleArrayNext<A>(array: A[]): Function`

Enter an array of specified type and this returns a cycle array next function.
Each time you call the returned function it will cycle through the array starting from the first item.

#### Example

```typescript
const func = Util.cycleArrayNext<number>([1, 2, 3]);

// Returns 1
func();

// Returns 2
func();

// Returns 3
func();

// Returns 1
func();
```

### cycleArray

`cycleArray<A>(array: A[], offset: number): A`

Cycles through the array from the given offset number.
The offset number represents a cycled index of the array.

#### Example

```typescript
// Returns 1
Num.cycleArray([1, 2, 3], 0);

// Returns 2
Num.cycleArray([1, 2, 3], 4);

// Returns 3
Num.cycleArray([1, 2, 3], -1);

// Returns 2
Num.cycleArray([1, 2, 3], -5);
```

### randomChoice

`randomChoice<A>(...choices: A[]): A`

Returns a random choice of given arguments of type `A`.

#### Example

```typescript
// Randomly returns 1, 2, or 3
Util.randomChoice<number>(1, 2, 3);

// I hope it returns a cat.
const choices = ['cat', 'dog', 'turtle'];
Util.randomChoice<string>(...choices);
```

### debounce

`debounce(func: Function, delayInSeconds: number): Function`

Returns a debounce function.
Delay is in seconds.

Debouncing is often used to improve browsers performance, but it has many other uses too.

A debounce function is a function that only fires after a certain amount of time have passed. Usually, this function is bound to an event that fires multiple times really fast.
If the time between those events is smaller than the debounce delay, the function won't fire until the firing stops the delay time elapsed.
This is useful for detecting or only do something only once event firing has stopped.

#### Example

```typescript
// Alert is called after the user is done resizing.
const resizeDebounce = Util.debounce(() => alert('Done resizing!'), 0.2);
window.addEventListener('resize', resizeDebounce);
```

### throttle

`throttle(func: Function, thresholdInSeconds: number): Function`

Returns a throttle function.
Threshold is in seconds.

Throttling works by restricting the given function call only at a given time (`threshold`) apart from each other.

An example where this could be useful is when an event bound to a function fires too fast and you want to slow down and control the rate at which the function is being called.