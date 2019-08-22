[Back](./index.md)

# `Ticker`

Ticker recursively, and continuously, loop the tick function until you tell it to stop or you set it to stop after a certain duration. Unlike `Repeater`, Ticker uses `requestAnimationFrame` and you don't have control over the interval time in between tick.

Ticker is perfect for running smooth and consistent animation or other motion related things that runs on the screen. It is not ideal for repeating a function that does not affect motion on the screen continuously.

## Import

Import **`Ticker`** into your project file.

```typescript
import { Ticker } from '@nekobird/rocket';
```
