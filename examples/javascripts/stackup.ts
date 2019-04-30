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
    console.log(left, top)
    return new Promise(resolve => {
      new Animation({
        duration: 0.2,
        timingFunction: Easings.QuadEaseInEaseOut,
        beforeStart: (context, data) => {
          data.left = DOMHelper.getStyleValue(item, 'left', true)
          data.top  = DOMHelper.getStyleValue(item, 'top', true)
          return Promise.resolve()
        },
        onTick: (n, ic, a, data) => {
          item.style.left = `${left * n}px`
          item.style.top  = `${top * n}px`
        },
      })
      .play()
      .then(() => {
        console.log("done")
        resolve()
      })
      // item.style.left = `${left}px`
      // item.style.top  = `${top}px`
      // resolve()
    })
  },
  afterMove: () => {
    console.log("Done moving")
  }
})