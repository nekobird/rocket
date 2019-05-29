// @ts-ignore
import jsondata from './data.json';

import {
  RectHelper,
  DOMUtil,
  Util,
  ViewportModel,
} from '../../rocket/rocket';

// Fixed Height Slideshow

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

  updateContainerWidth(img);
  const item = document.createElement('DIV');
  item.classList.add('item');
  item.appendChild(img);
  addItemToContainer(item);
}

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