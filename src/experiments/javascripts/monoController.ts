import {
  MonoController,
} from '../../../rocket/rocket'

let controller = new MonoController({
  selectorItems: '.item',
  classNameItemActive: '__active',
  classNameJsActivate: 'js_activate',
  classNameJsDeactivate: 'js_deactivate',
  beforeDeactivate: (action, context) => {
    return new Promise(resolve => {
      action.currentItem.classList.remove('__animateIn', '__animateOut')
      action.currentItem.classList.add('__animateOut')
      setTimeout(() => { resolve() }, 400)
    })
  },
  afterActivate: (action, context) => {
    return new Promise(resolve => {
      action.nextItem.classList.remove('__animateIn', '__animateOut')
      action.nextItem.classList.add('__animateIn')
      setTimeout(() => { resolve() }, 400)
    })
  }
})