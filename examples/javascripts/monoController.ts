import {
  DOMStyle,
  MonoController,
} from '../../rocket/rocket';

const items: HTMLElement[] = Array.from(document.querySelectorAll('.js-item'))

const controller = new MonoController();
controller.setConfig({
  items,

  isTrigger: element => element.classList.contains('js-item-trigger'),
  mapTriggerToAction: trigger => {
    if (trigger.dataset.action === 'activate') {
      return {
        trigger,
        action: 'activate',
        payload: trigger.dataset.target,
      };
    } else if (trigger.dataset.action === 'deactivate') {
      return {
        trigger,
        action: 'deactivate',
      };
    } else if (trigger.dataset.action === 'toggle') {
      return {
        trigger,
        action: 'toggle',
        payload: trigger.dataset.target,
      };
    }
    return false;
  },

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
controller.initialize();