import {
  Animation,
  DOMTraverse,
  Num,
} from '../../rocket/rocket';

const demoOneTrack = document.querySelector('.demoOne__track') as HTMLElement;
const demoOneCircle = document.querySelector('.demoOne__circle') as HTMLElement;
const demoOneLog = document.querySelector('.demoOne__log') as HTMLElement;

const addLog = (message: string) => {
  const div = document.createElement('DIV');
  div.classList.add('demoOne__logMessage');
  div.textContent = `${Date.now()}: ${message}`;
  demoOneLog.appendChild(div);
};

const demoOne = new Animation({
  beforeStartWithDelay: () => addLog('Animation: beforeStartWithDelay'),
  beforeStart: () => addLog('Animation: beforeStart'),
  onStart: () => addLog('Animation: onStart'),
  onPause: () => addLog('Animation: onPause'),
  beforeSubsequentIteration: () => addLog('Animation: beforeSubsequentIteration'),
  onIterationStart: () => addLog('Animation: onIterationStart'),
  onIterationComplete: () => addLog('Animation: onIterationComplete'),
  onContinue: () => addLog('Animation: onContinue'),
  onEnd: () => addLog('Animation: onEnd'),
  onComplete: () => addLog('Animation: onComplete.'),
  numberOfIterations: 'infinite',
  // numberOfIterations: 2,
  // delay: 1,
  // iterationDelay: 1,
  // timingFunction: Easings.CubicEaseIn,
  duration: 4,
  // alternate: true,
  onTick: t => {
    const trackWidth = demoOneTrack.offsetWidth;
    const circleWidth = demoOneCircle.offsetWidth;
    const left = Num.modulate(t, 1, [0, trackWidth - circleWidth], true);
    demoOneCircle.style.transform = `translateX(${left}px)`;
  },
});

window.addEventListener('click', event => {
  const jump = DOMTraverse.findAncestorWithClass(event.target as HTMLElement, 'js-demoOne-jumpTo');
  if (DOMTraverse.findAncestorWithClass(event.target as HTMLElement, 'js-demoOne-play') !== false) {
    demoOne.play();
  } else if (
    DOMTraverse.findAncestorWithClass(event.target as HTMLElement, 'js-demoOne-pause') !== false
  ) {
    demoOne.pause();
  } else if (
    DOMTraverse.findAncestorWithClass(event.target as HTMLElement, 'js-demoOne-stop') !== false
  ) {
    demoOne.stop();
  } else if (
    jump !== false
  ) {
    demoOne.jumpTo(parseFloat((jump as HTMLElement).dataset.jump));
  }
  console.log(demoOne.isActive);
});
