// @ts-ignore
import jsondata from './data.json';

import {
  DOMUtil,
  Util,
} from '../../rocket/rocket';

const data = jsondata;
const gutter = 20;

const containerElement = document.querySelector('.js-slideshow-container');

const addImage = (url: string) => {
  const img = new Image();
  img.src = url;
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

const addItemToContainer = item => {
  containerElement.appendChild(item);
}

loadItems();