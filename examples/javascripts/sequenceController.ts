import {
  DOMStyle,
  SequenceController,
} from '../../rocket/rocket';

const controller = new SequenceController({
  itemsSelector: '.item',

  classNameJsPrevious: 'js-item-previous',
  classNameJsNext: 'js-item-next',
  classNameJsJump: 'js-item-jump',

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
        DOMStyle.getAnimationDuration(action.currentItem)
      );
    });
  }
});