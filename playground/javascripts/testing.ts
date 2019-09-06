import {
  DOMTraverse,
  DOMStyle,
} from '../../rocket/rocket';

const box = document.querySelector('.box') as HTMLElement;

if (box !== null) {
  console.log(DOMStyle.getTransitionDurationsInSeconds(box));
}