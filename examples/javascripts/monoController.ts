import {
  DOMStyle,
  MonoController,
} from '../../rocket/rocket';

const controller = new MonoController({
  itemsSelector: '.js-item',

  classNameJsActivate: 'js-item-activate',
  classNameJsDeactivate: 'js-item-deactivate',
  classNameJsToggle: 'js-item-toggle',

  itemIsActive: item => item.classList.contains('item--active'),
  activateItem: item => item.classList.add('item--active'),
  deactivateItem: item => item.classList.remove('item--active'),

  beforeDeactivate: action => {
    return new Promise(resolve => {
      action.currentItem.classList.remove('item--animate-in', 'item--animate-out');
      action.currentItem.classList.add('item--animate-out');
      setTimeout(
        () => resolve(),
        DOMStyle.getAnimationDuration(action.currentItem)
      );
    });
  },
  afterActivate: action => {
    return new Promise(resolve => {
      action.nextItem.classList.remove('item--animate-in', 'item--animate-out');
      action.nextItem.classList.add('item--animate-in');
      setTimeout(
        () => resolve(),
        DOMStyle.getAnimationDuration(action.nextItem)
      );
    });
  },
  onKeydown: (event, context) => {
    if (event.keyCode === 27) {
      context.deactivate();
    }
  }
});