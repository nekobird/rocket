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
        payload: trigger.dataset.target,
      };
    } else if (trigger.dataset.action === 'toggle') {
      return {
        trigger,
        action: 'toggle',
        payload: trigger.dataset.target,
      };
    } else if (trigger.dataset.action === 'activate-all') {
      return {
        trigger,
        action: 'activate-all',
      };
    } else if (trigger.dataset.action === 'deactivate-all') {
      return {
        trigger,
        action: 'deactivate-all',
      };
    } else if (trigger.dataset.action === 'toggle-all') {
      return {
        trigger,
        action: 'toggle-all',
      };
    }
    return false;
  },

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