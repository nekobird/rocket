[Back](./index.md)

# Repeater

Repeater

## Import

Import **Repeater** into your project file.

```typescript
import { Repeater } from '@nekobird/rocket';
```

## Config

### enableTimeout

`enableTimeout: boolean`

If this is set to `true`.

### timeoutDelayInSeconds

`timeoutDelayInSeconds: number`

### numberOfRepeatsPerSecond

`numberOfRepeatsPerSecond: number`

### condition

`condition: (context: Repeater) => boolean`

### onStart

`onStart: (context: Repeater) => void`

### onRepeat

`onRepeat: (context: Repeater) => void`

### onEnd

`onEnd: (context: Repeater) => void`

## Properties

## Methods

### setConfig

`setConfig(config?: Partial<RepeaterConfig>): this`

### start

### stop