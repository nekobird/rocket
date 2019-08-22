[Back to index](./index.md)

# `Animation`

A generalized animation class with comprehensive callbacks, promises, and hooks
to give you full control and freedom to tween anything you want.

## Import

Import **Animation** into your project file.

```typescript
import { Animation } from '@nekobird/Animation';
```

## Config Properties

### timeUnit

Define the time unit for all the time related config properties. Namely: `delay`, `iterationDelay`, `duration`.

| Accepts | Description  | Default |
| ------- | ------------ | ------- |
| 's'     | Seconds      | Default |
| 'ms'    | Milliseconds |         |

### alternate

Accepts a `boolean`. If it is set to true, it will
alternate **direction** after each iteration.

### delay

Accepts `number`. This defines the 

### iterationDelay

### duration


### direction

This sets the starting direction of the animation.

| Accepts | Description  | Default |
| ------- | ------------ | ------- |
| 1       | From 0 to 1  | Default | 
| -1      | From 1 to 0  |         |

## Properties

