import {
  Ticker,
} from './ticker';

export interface TickerConfig {
  loopForever: boolean;

  durationInSeconds: number;

  timingFunction: (t: number) => number;

  onTick: (n: number, c: number, ticker: Ticker) => void;

  onStart: (ticker: Ticker) => void;
  onComplete: (ticker: Ticker) => void;
}

export const TICKER_DEFAULT_CONFIG: TickerConfig = {
  loopForever: false,

  durationInSeconds: 1,

  timingFunction: t => t,

  onTick: () => {},

  onStart: () => {},
  onComplete: () => {},
}