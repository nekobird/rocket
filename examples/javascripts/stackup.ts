import {
  Animation,
  Easings,
  StackUp,
  DOMHelper,
  Num,
} from '../../rocket/rocket'

const stackup: StackUp = new StackUp({
  selectorContainer: '.container',
  selectorItems    : '.item',
  layout           : 'ordinal',
  moveInSequence   : true,
  moveItem: (item, left, top) => {
    return new Promise(resolve => {
      new Animation({
        duration: 0.2,
        timingFunction: Easings.QuadEaseInEaseOut,
        beforeStart: (context, data) => {
          data.left = DOMHelper.getStyleValue(item, 'left', true)
          data.top  = DOMHelper.getStyleValue(item, 'top' , true)
          return Promise.resolve()
        },
        onTick: (n, ic, a, data) => {
          item.style.left = `${Num.modulate(n, 1, [data.left, left], true)}px`
          item.style.top  = `${Num.modulate(n, 1, [data.top, top], true)}px`
        },
      })
      .play()
      .then(() => {
        resolve()
      })
      // item.style.left = `${left}px`
      // item.style.top  = `${top}px`
      // resolve()
    })
  },
  afterMove: () => {
  }
})

stackup.initialize()