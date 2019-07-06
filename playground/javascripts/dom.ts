import {
  DOMRect,
  DOMScroll,
} from '../../rocket/rocket';

const boxElement = document.querySelector('.box');
const box2Element = document.querySelector('.box__another');

window.addEventListener('scroll', () => {
  console.log(DOMScroll.getScrollTopToElementsCenterFrame(
    [boxElement as HTMLElement, box2Element as HTMLElement]
  ));
});