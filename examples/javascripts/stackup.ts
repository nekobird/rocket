import {
  StackUp
} from '../../rocket/rocket'

const stackup: StackUp = new StackUp({
  selectorContainer: '.container',
  selectorItems    : '.item',
  layout           : 'optimized',
  moveInSequence   : true,
  moveItem: (item, left, top) => {
    return new Promise(resolve => {
      item.style.left = `${left}px`
      item.style.top  = `${top}px`
      resolve()
    })
  },
  afterMove: () => {
    console.log("Done moving")
  }
})