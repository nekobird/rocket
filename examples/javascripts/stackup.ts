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
            const x: number = Num.modulate(n, 1, data.left - data.currentLeft, true)
            const y: number = Num.modulate(n, 1, data.top  - data.currentTop , true)
            data.item.style.transform = `translateX(${x}px) translateY(${y}px)`
          },
          onComplete: () => {
            data.item.style.transform = ``
            data.item.style.left = `${data.left}px`
            data.item.style.top  = `${data.top}px`
          }
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
      item.style.left = `500px`
      item.style.top = `1000px`
      item.classList.add('item')
      item.appendChild(img)
      containerElement.appendChild(item)
      return stackup.append(item)
    })
}

const appendItems = () => {
  const items = []
  const promises = []
  images.forEach(url => {
    const promise = DOMHelper
      .onImageLoad(url)
      .then(() => {
        const img: HTMLImageElement = <HTMLImageElement>document.createElement('IMG')
        img.setAttribute('src', url)
        const item: HTMLElement = document.createElement('DIV')
        item.style.left = `500px`
        item.style.top = `1000px`
        item.classList.add('item')
        item.appendChild(img)
        containerElement.appendChild(item)
        items.push(item)
        return Promise.resolve()
      })
    promises.push(promise)
  })
  Promise
    .all(promises)
    .then(() => {
      stackup.append(items)
    })
}
const images = [
  'https://images.unsplash.com/photo-1556624651-1f527cdf6508?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1556624651-70ad2f7e8364?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1556624651-1f527cdf6508?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1556624651-70ad2f7e8364?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1556624651-1f527cdf6508?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1556624651-70ad2f7e8364?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1556624651-1f527cdf6508?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1556624651-70ad2f7e8364?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
]

// Util.promiseEach(images, appendItem)

appendItems()