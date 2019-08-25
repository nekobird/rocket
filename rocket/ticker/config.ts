import {
  Ticker,
} from './ticker';

export interface TickerConfig {
  isForever: boolean;

  durationInSeconds: number;

  timingFunction: (t: number) => number;

  onTick: (n: number, c: number, ticker: Ticker) => void;

  onStart: (ticker: Ticker) => void;
  onComplete: (ticker: Ticker) => void;
}

export const TICKER_DEFAULT_CONFIG: TickerConfig = {
  isForever: false,

  durationInSeconds: 1,

  timingFunction: t => t,

  onTick: () => {},

  onStart: () => {},
  onComplete: () => {},
}