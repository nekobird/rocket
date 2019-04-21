import {
  PolyController,
} from '../../rocket/Rocket'

const controller = new PolyController({
  selectorItems: '.item',
  classNameItemActive: '__active',
  classNameJsActivate: 'js_open',
  classNameJsDeactivate: 'js_close',
  beforeDeactivate: (action, context) => {
    return new Promise(resolve => {
      action.targetItem.classList.remove('__animateIn')
      action.targetItem.classList.add('__animateOut')
      setTimeout(() => { resolve() }, 400)
    })
  },
  afterActivate: (action, context) => {
    return new Promise(resolve => {
      action.targetItem.classList.remove('__animateOut')
      action.targetItem.classList.add('__animateIn')
      setTimeout(() => { resolve() }, 400)
    })
  }
})