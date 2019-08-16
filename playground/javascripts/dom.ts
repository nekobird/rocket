import {
  DOMBoxModel,
  DOMText,
  DOMTraverse,
  DOMUtil,
  Num,
  TextAutoScale,
  Util,
  Repeater,
  Ticker,
} from '../../rocket/rocket';

import * as Rocket from '../../rocket/rocket';

// @ts-ignore
window.Rocket = Rocket;

const element = document.querySelector('.autoScale') as HTMLElement;
const textAutoScale = new TextAutoScale({
  element,
  fontSizeSet: [10, 14, 20, 32],
  fontSizeRange: [10, 32],
  increment: 1,
  setFontSize: (element, fontSize) => {
    console.log(element)
    console.log('aa');
    element.style.fontSize = `${fontSize}px`;
  },
});

textAutoScale.optimizeFromRange();