import {
  Animation,
  Easings,
  StackUp,
} from '../../rocket/rocket'

const stackup: StackUp = new StackUp({
  selectorContainer: '.container',
  selectorItems    : '.item',
  layout           : 'optimized',
  moveInSequence   : true,
  moveItem: (item, left, top) => {
    return new Promise(resolve => {
      new Animation({
        duration: 0.1,
        timingFunction: Easings.QuadEaseInEaseOut,
        onTick: n => {
          item.style.left = `${left * n}px`
          item.style.top  = `${top}px`
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
    console.log("Done moving")
  }
})