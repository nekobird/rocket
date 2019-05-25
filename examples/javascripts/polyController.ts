import {
  DOMStyle,
  PolyController,
} from '../../rocket/rocket';

const items: HTMLElement[] = Array.from(document.querySelectorAll('.js-item'))

const controller = new PolyController();
controller.setConfig({
  items,

  deactivateAllOnOutsideAction: false,

  isTrigger: element => element.classList.contains('js-item-trigger'),

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