import {
  DOMHelper,
  SequenceController,
} from '../../rocket/rocket'

const controller = new SequenceController({
  selectorItems: '.item',

  classNameItemActive: 'item--active',

  classNameJsPrevious: 'js-item-previous',
  classNameJsNext    : 'js-item-next',
  classNameJsJump    : 'js-item-jump',

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
        DOMHelper.getAnimationDuration(action.currentItem)
      )
    })
  }
})