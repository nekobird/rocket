[Back](./index.md)

# `Ticker`

- Import
- Properties
- Methods
- Config

Ticker recursively, and continuously, loop the tick function until you tell it to stop or you set it to stop after a certain duration. Unlike `Repeater`, Ticker uses `requestAnimationFrame` and you don't have control over the interval time in between tick.

Ticker is perfect for running smooth and consistent animation or other motion related things that runs on the screen. It is not ideal for repeating a function that does not affect motion on the screen continuously.

## Import

Import **`Ticker`** into your project file.

```typescript
import { Ticker } from '@nekobird/rocket';
```

## Properties

## Methods

### setConfig

### play

### stop

## Config

### durationInSeconds

```
durationInSeconds: number
```

The number of seconds you want the Ticker to run for.

### isForever

```
isForever: boolean
```

If this is set to true, it will ignore `durationInSeconds`, and will continue to tick forever until you manually stop it.

### timingFunction

```
timingFunction: (t: number) => number
```

### onTick

```
onTick: (n: number, c: number, ticker: Ticker) => void
```

### onStart

```
onStart: (ticker: Ticker) => void
```

### onComplete

```
onComplete: (ticker: Ticker) => void
```