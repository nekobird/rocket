import {
  DOMStyle,
  PolyController,
} from '../../rocket/rocket';

const controller = new PolyController();
controller.setConfig({
  itemsSelector: '.item',
  deactivateAllOnOutsideAction: false,

  classNameJsActivate: 'js-item-open',
  classNameJsDeactivate: 'js-item-close',
  classNameJsToggle: 'js-item-toggle',

  classNameJsActivateAll: 'js-item-open-all',
  classNameJsDeactivateAll: 'js-item-close-all',
  classNameJsToggleAll: 'js-item-toggle-all',

  itemIsActive: item => item.classList.contains('item--active'),
  activateItem: item => item.classList.add('item--active'),
  deactivateItem: item => item.classList.remove('item--active'),

  beforeDeactivate: action => {
    return new Promise(resolve => {
      action.targetItem.classList.remove('item--animate-in');
      action.targetItem.classList.add('item--animate-out');
      setTimeout(
        () => resolve(),
        DOMStyle.getAnimationDuration(action.targetItem)
      );
    });
  },
  afterActivate: action => {
    return new Promise(resolve => {
      action.targetItem.classList.remove('item--animate-out');
      action.targetItem.classList.add('item--animate-in');
      setTimeout(
        () => resolve(),
        DOMStyle.getAnimationDuration(action.targetItem)
      );
    });
  }
});
controller.initialize();