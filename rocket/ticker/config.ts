import {
  Ticker,
} from './ticker';

export interface TickerConfig {
  loopForever: boolean;
  durationInSeconds: number;

  timingFunction: (t: number) => number;

  onStart: (ticker: Ticker) => void;
  onTick: (tick: [number, number, number], ticker: Ticker) => void;
  onComplete: (ticker: Ticker) => void;
}

export const TICKER_DEFAULT_CONFIG: TickerConfig = {
  loopForever: false,
  durationInSeconds: 1,

  timingFunction: t => t,

  onStart: () => {},
  onTick: () => {},
  onComplete: () => {},
}