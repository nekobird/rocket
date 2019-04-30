import {
  Animation,
  DOMHelper,
  Easings,
  Num,
  StackUp,
  Util,
} from '../../rocket/rocket'

const stackup: StackUp = new StackUp({
  selectorContainer: '.container',
  selectorItems    : '.item',
  layout           : 'optimized',
  moveInSequence   : false,
  scaleContainerInitial: (container, data) => {
    if (data.requireScale === true) {
      return new Animation({
        duration: 0.2,
        timingFunction: Easings.QuadEaseInEaseOut,
        onTick: (n, ic, a) => {
          container.style.width  = `${Num.modulate(n, 1, [data.currentWidth , data.width ], true)}px`
          container.style.height = `${Num.modulate(n, 1, [data.currentHeight, data.height], true)}px`
        },
      }).play()
    } else {
      return Promise.resolve()
    }
  },
  moveItem: (data) => {
    if (data.requireMove === true) {
      return new Animation({
          duration: 0.4,
          timingFunction: Easings.QuadEaseInEaseOut,
          onTick: (n, ic, a) => {
            data.item.style.left = `${Num.modulate(n, 1, [data.currentLeft, data.left], true)}px`
            data.item.style.top  = `${Num.modulate(n, 1, [data.currentTop , data.top ], true)}px`
          },
        }).play()
    } else {
      return Promise.resolve()
    }
  }
})

stackup.initialize()

const containerElement = document.querySelector('.container')

const appendItem = (src: string) => {
  return DOMHelper
    .onImageLoad(src)
    .then(() => {
      const img: HTMLImageElement = <HTMLImageElement>document.createElement('IMG')
      img.setAttribute('src', src)
      const item: HTMLElement = document.createElement('DIV')
      item.classList.add('item')
      item.appendChild(img)
      containerElement.appendChild(item)
      return stackup.append(item)
    })
}

const images = [
  'https://images.unsplash.com/photo-1556624651-1f527cdf6508?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1556624651-70ad2f7e8364?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
]

Util.promiseEach(images, appendItem)