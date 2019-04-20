import {
  PolyController,
} from '../../../rocket/Rocket'

let polyCon = new PolyController({
  selectorItems: '.polyItem',
  classNameItemActive: '__active',
  classNameJsActivate: 'js_open',
  classNameJsDeactivate: 'js_close',
  beforeAction: (action, context) => {
    return new Promise(resolve => {
      // CloseAll?
      if (
        action.name === 'activate' &&
        context.itemIsActive('a', 'one')
      ) {
        context
          .deactivateAll('a')
          .then(() => {
            resolve()
          })
      } else {
        resolve()
      }
    })
  },
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