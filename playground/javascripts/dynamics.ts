import {
  MonoDrag,
  MonoTap,
  Repeater,
  Ticker,
  Vector2,
} from '../../rocket/rocket';

let boxElement = document.querySelector('.box');

if (boxElement !== null) {
  let box = boxElement as HTMLElement;

  const monoDrag = new MonoDrag({
    target: box,

    onDrag: (event, story) => {
      console.log('drag');

      const position = Vector2.subtract(event.position, story.offset);

      const { x, y } = position;

      box.style.transform = `translate(${x}px, ${y}px)`;
    },

    onDragEnd: (event, story) => {
      console.log(story.currentEvent.type);
    }
  });
}

let tapElement = document.querySelector('.tap');

if (tapElement !== null) {
  const monoTap = new MonoTap({
    target: tapElement as HTMLElement,

    preventDefault: false,

    onTap: () => {
      // alert('taperro');
    },

    onDown: event => {
      event.originalEvent.preventDefault();
    },

    onUp: event => {
      // event.originalEvent.preventDefault();
      alert('onUp');
    },
  });
}

// tapElement.addEventListener('click', () => {
//   alert('test');
// });

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