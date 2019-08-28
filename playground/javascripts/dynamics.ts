import {
  Repeater,
  Ticker,
  MonoDrag,
  Vector2,
} from '../../rocket/rocket';

let boxElement = document.querySelector('.box');

if (boxElement !== null) {
  let box = boxElement as HTMLElement;

  const monoDrag = new MonoDrag({
    target: box,

    onDrag: (event, story) => {
      console.log('drag');

      const position = Vector2.subtract(event.position, story.offset)

      const { x, y } = position;

      box.style.transform = `translate(${x}px, ${y}px)`;
    }
  });
}

// const repeater = new Repeater({
//   numberOfRepeatsPerSecond: 60,

//   enableTimeout: true,
//   timeoutDelayInSeconds: 2,

//   onRepeat: context => {
//     console.log(context.count);
//   },
// });

// // repeater.start();


// const ticker = new Ticker({
//   durationInSeconds: 2,
//   onTick: n => {
//     console.log(n);
//   }
// });

// ticker.start();