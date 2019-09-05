import {
  DOMBoxModel,
  DOMText,
  DOMTraverse,
  DOMUtil,
  Num,
  Repeater,
  TextAutoScaler,
  Ticker,
  Util,
} from '../../rocket/rocket';

import * as Rocket from '../../rocket/rocket';

// @ts-ignore
window.Rocket = Rocket;

const element = document.querySelector('.autoScale') as HTMLElement;
const textAutoScale = new TextAutoScaler({
  element,
  validFontSizes: [10, 14, 20, 32],
  fontSizeRange: [10, 32],
  fontSizeIncrement: 1,
  setFontSize: (element, fontSize) => {
    console.log(element)
    console.log('aa');
    element.style.fontSize = `${fontSize}px`;
  },
});

textAutoScale.scaleText();
console.log('start');
const elementStart = document.querySelector('.traverse');
if (elementStart !== null) {
  DOMTraverse.descendFrom(elementStart as HTMLElement, (el) => {
    console.log(el);
  });
}