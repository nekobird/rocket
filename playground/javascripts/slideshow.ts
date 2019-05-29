// @ts-ignore
import jsondata from './data.json';

// Kinematic drag?

import {
  RectHelper,
  DOMUtil,
  Util,
  ViewportModel,
  DragEventManager,
  Repeater,
  Num,
} from '../../rocket/rocket';

const friction = 0.1;
let accelerationX = 0;
let direction = 0;
const kinematicRepeater = new Repeater({
  timeout: false,
  frequency: 1000,
  onRepeat: context => {
    let f = 0
    if (accelerationX > 0) {
      accelerationX += -1 * Math.abs(friction);
    } else {
      accelerationX += Math.abs(friction);
    }
    window.scrollBy(accelerationX, 0);
    if (
      (
        direction === 1
        && accelerationX <=0
      )
      || (
        direction === -1
        && accelerationX >= 0
      )
    ) {
      context.stop();
    }
  },
});

// Fixed Height Slideshow
const manager = new DragEventManager({
  onDown: data => {
    kinematicRepeater.stop();
  },
  onDrag: (data) => {
    window.scrollBy(- data.velocity.x, - data.velocity.y);
  },
  onUp: (data) => {
    accelerationX = data.acceleration.x;
    accelerationX = Num.constrain(accelerationX, [-20, 20]);
    if (accelerationX !== 0) {
      direction = accelerationX > 0 ? 1 : -1;  
      kinematicRepeater.forceStart();
    }
  },
});

manager.initialize();

const data = jsondata;
const gutter = 20;

const maxHeight = () => {
  return 800;
}

const containerElement = <HTMLElement>document.querySelector('.js-slideshow-container');
let containerWidth: number = 0;

const addImage = (url: string) => {
  const img = new Image();
  img.src = url;
  img.draggable = false;

  updateContainerWidth(img);
  const item = document.createElement('DIV');
  item.classList.add('item');
  item.appendChild(img);
  addItemToContainer(item);
}

// Repeater

const loadItems = () => {
  Util.promiseEach<any>(data, datum => {
    return DOMUtil
      .onImageLoad(datum.url)
      .then(() => addImage(datum.url))
  });
}

const updateContainerWidth = (img) => {
  const width = RectHelper.getWidthFromNewHeight(
    { width: img.naturalWidth, height: img.naturalHeight },
    maxHeight()
  );
  containerWidth += width + gutter;
}

const addItemToContainer = item => {
  scaleContainer();
  containerElement.appendChild(item);
}

const scaleContainer = () => {
  containerElement.style.width = `${containerWidth}px`;
}

loadItems();