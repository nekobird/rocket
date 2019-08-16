import { DOMText, TextScaleModel } from '../../rocket/rocket';

const items = document.querySelectorAll('.scale-text');

items.forEach(item => {
  const model = new TextScaleModel(<HTMLElement>item, {
    fontSizeSet: [3, 8, 12, 20, 24, 30],
    fontSizeRange: [4, 24],
    increment: 1,
  });
  model.optimizeFromRange();
});

const lastLineElement = document.querySelector('.last-line');
console.log(DOMText.getLastLine(<HTMLElement>lastLineElement));
