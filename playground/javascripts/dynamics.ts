import {
  Repeater,
  Ticker,
} from '../../rocket/rocket';

const repeater = new Repeater({
  numberOfRepeatsPerSecond: 60,

  enableTimeout: true,
  timeoutDelayInSeconds: 2,

  onRepeat: context => {
    console.log(context.count);
  },
});

// repeater.start();


const ticker = new Ticker({
  durationInSeconds: 2,
  onTick: n => {
    console.log(n);
  }
});

ticker.start();