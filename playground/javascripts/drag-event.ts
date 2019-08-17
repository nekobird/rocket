import {
  DOMTraverse,
  MonoDrag,
} from '../../rocket/rocket';

const boxElement = document.querySelector('.box') as HTMLElement;

if (boxElement !== null) {
  const monoDrag = new MonoDrag({
    target: boxElement as HTMLElement,

    keepHistory: true,

    preventDefault: true,

    condition: (dragEvent) => {
      // if (dragEvent.)
      return true;
    },

    onDragStart: (dragEvent, monoDrag) => {
    
    },

    onDrag: (dragEvent, monoDrag) => {
      const position = dragEvent.position.clone().subtract(dragEvent.offset);
      boxElement.style.transform = `translateX(${position.x}px) translateY(${position.y}px)`;
    },

    onDragStop: (dragEvent, monoDrag) => {
      console.log(dragEvent.acceleration);
      if (dragEvent.acceleration.y > 10) {
        boxElement.style.backgroundColor = 'red';
      }
    },

    onDragCancel: (dragEvent, monoDrag) => {
    },
  });
}