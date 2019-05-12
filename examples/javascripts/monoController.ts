import {
  DOMHelper,
  MonoController,
} from '../../rocket/rocket'

const controller = new MonoController({
  selectorItems: '.js-item',

  classNameItemActive: 'item--active',

  classNameJsActivate  : 'js-item-activate',
  classNameJsDeactivate: 'js-item-deactivate',
  classNameJsToggle    : 'js-item-toggle',

  beforeDeactivate: (action, context) => {
    return new Promise(resolve => {
      action.currentItem.classList.remove('item--animate-in', 'item--animate-out')
      action.currentItem.classList.add('item--animate-out')
      setTimeout(
        () => resolve(),
        DOMHelper.getAnimationDuration(action.currentItem)
      )
    })
  },
  afterActivate: (action, context) => {
    return new Promise(resolve => {
      action.nextItem.classList.remove('item--animate-in', 'item--animate-out')
      action.nextItem.classList.add('item--animate-in')
      setTimeout(
        () => resolve(),
        DOMHelper.getAnimationDuration(action.nextItem)
      )
    })
  },
  onKeydown: (event, group, context) => {
    if (event.keyCode === 27) {
      context.deactivate(group.name)
    }
  }
})