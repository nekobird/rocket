import {
  SequenceController,
} from '../../rocket/rocket'

const controller = new SequenceController({
  selectorItems: '.item',
  classNameItemActive: '__active',
  classNameJsPrevious: 'js_previous',
  classNameJsNext: 'js_next',
  classNameJsJump: 'js_jump',
  beforeAction: (action, context) => {
    return new Promise(resolve => {
      context.next('b')
        .then(() => {
          resolve()
        })
    })

  },
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

const controllerBlock = new SequenceController({
  selectorItems: '.block',
  classNameItemActive: '__active',
  classNameJsPrevious: 'block_js_previous',
  classNameJsNext: 'block_js_next',
  classNameJsJump: 'block_js_jump',
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