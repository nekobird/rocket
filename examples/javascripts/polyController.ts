import {
  DOMHelper,
  PolyController,
} from '../../rocket/rocket'

const controller = new PolyController({
  selectorItems: '.item',

  deactivateAllOnOutsideAction: false,

  classNameItemActive: 'item--active',

  classNameJsActivate  : 'js-item-open',
  classNameJsDeactivate: 'js-item-close',
  classNameJsToggle    : 'js-item-toggle',

  classNameJsActivateAll  : 'js-item-open-all',
  classNameJsDeactivateAll: 'js-item-close-all',
  classNameJsToggleAll    : 'js-item-toggle-all',

  beforeDeactivate: (action, context) => {
    return new Promise(resolve => {
      action.targetItem.classList.remove('item--animate-in')
      action.targetItem.classList.add('item--animate-out')
      setTimeout(
        () => resolve(),
        DOMHelper.getAnimationDuration(action.targetItem)
      )
    })
  },
  afterActivate: (action, context) => {
    return new Promise(resolve => {
      action.targetItem.classList.remove('item--animate-out')
      action.targetItem.classList.add('item--animate-in')
      setTimeout(
        () => resolve(),
        DOMHelper.getAnimationDuration(action.targetItem)
      )
    })
  }
})