import {
  Ticker,
} from './ticker';

export interface TickerConfig {
  durationInSeconds: number;

  isForever: boolean;

  timingFunction: (t: number) => number;

  onStart: (ticker: Ticker) => void;

  onTick: (n: number, c: number, ticker: Ticker) => void;

  onComplete: (ticker: Ticker) => void;
}

export const TICKER_DEFAULT_CONFIG: TickerConfig = {
  durationInSeconds: 1,

  isForever: true,

  timingFunction: t => t,

  onStart: () => {},

  onTick: () => {},

  onComplete: () => {},
}