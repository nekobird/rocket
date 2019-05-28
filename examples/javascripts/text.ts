import {
  TextScaleModel,
} from '../../rocket/rocket';


const items = document.querySelectorAll('.scale-text');

items.forEach(item => {
  const model = new TextScaleModel(<HTMLElement>item, {
    maxFontSize: 24,
    minFontSize: 14,
  });
  model.initialize();
  model.optimize();
});
