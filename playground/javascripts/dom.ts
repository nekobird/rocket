import {
  DOMRect,
  DOMScroll,
} from '../../rocket/rocket';

const boxElement = document.querySelector('.box');

window.addEventListener('scroll', () => {
  const rect = DOMRect.getRectFromElements(boxElement as HTMLElement);
  console.log(rect);
});