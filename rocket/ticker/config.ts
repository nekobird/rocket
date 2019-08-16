import {
  Ticker,
} from './ticker';

export interface TickerConfig {
  durationInSeconds: number;

  isForever: boolean;

  timingFunction: (t: number) => number;

  onTick: (n: number, c: number, ticker: Ticker) => void;

  onStart: (ticker: Ticker) => void;
  onComplete: (ticker: Ticker) => void;
}

export const TICKER_DEFAULT_CONFIG: TickerConfig = {
  durationInSeconds: 1,

  isForever: false,

  timingFunction: t => t,

  onTick: () => {},

  onStart: () => {},
  onComplete: () => {},
}