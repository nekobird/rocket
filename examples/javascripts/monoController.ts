import {
  MonoController,
} from '../../rocket/rocket'

const controller = new MonoController({
  selectorItems: '.js-item',

  classNameItemActive: '.js-item--active',
  classNameJsActivate: 'js-item-activate',
  classNameJsDeactivate: 'js-item-deactivate',
  classNameJsToggle: 'js-item-toggle',

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
  },
  onKeydown: (event, group, context) => {
    if (event.keyCode === 27) {
      context.deactivate(group.name)
    }
  }
})

const trigger_0 = document.getElementById('deactivate_a_one')
trigger_0.addEventListener('click', event => {
  controller.deactivate('a', 'one')
})