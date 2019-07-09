import {
  DOMRect,
  DOMScroll,
  ViewportModel,
} from '../../rocket/rocket';

const boxElement = document.querySelector('.box');
const box2Element = document.querySelector('.box__another');
const box3Element = document.querySelector('.box3') as HTMLElement;
const box4Element = document.querySelector('.box4') as HTMLElement;
const scrollTrigger = document.querySelector('.scrollTrigger');

scrollTrigger.addEventListener('click', () => {
  const scrollTop = DOMScroll.getScrollTopToElementsCenterFrame([box3Element, box4Element]);
  window.scrollTo(0, scrollTop);
});

window.addEventListener('scroll', () => {
  console.log(DOMScroll.getScrollTopToElementsCenterFrame(
    [boxElement as HTMLElement, box2Element as HTMLElement]
  ));
});

setTimeout(() => {
  ViewportModel.disableScrolling();
  setTimeout(() => {
    ViewportModel.enableScrolling();
  }, 2000);
}, 4000);