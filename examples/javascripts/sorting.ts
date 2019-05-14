import {
  DOMHelper,
  DOMUtil,
  DragEventManager,
  Point,
} from '../../rocket/rocket'

let itemContainer: HTMLElement
let items: HTMLElement[]

const result: HTMLElement = document.querySelector('.items')
if (result !== null) {
  itemContainer = result
}

const results: NodeListOf<HTMLElement> = document.querySelectorAll('.item')
if (results !== null) {
  items = Array.from(results)
} else {
  items = []
}

let isDragActive: boolean = false
let activeItem: HTMLElement

let hasMoved: boolean = false
let initialX: number
let initialY: number
let dummyElement: HTMLElement = document.createElement('DIV')

let popElement = () => {
  let height = activeItem.offsetHeight
  let width  = activeItem.offsetWidth
  activeItem.style.position = 'absolute'
  activeItem.style.left = `0`
  activeItem.style.top  = `0`
  activeItem.style.width  = `${width}px`
  activeItem.style.height = `${height}px`
}


let unpopElement = () => {
  activeItem.removeAttribute('style')
}

let createDummy = () => {
  dummyElement.classList.add('item', 'item--dummy')
  dummyElement.style.backgroundColor = `red`
  dummyElement.style.position = `relative`
  dummyElement.style.height = `${activeItem.offsetHeight}px`
  dummyElement.style.width = `${activeItem.offsetWidth}px`
  dummyElement.style.zIndex = '0'
}

let getLastChild = () => {
  return DOMUtil.getNthChild('last', itemContainer, item => {
    return (
      item.classList.contains('item') === true &&
      item.classList.contains('item--active') === false &&
      item.classList.contains('item--dummy') === false
    )
  })
}

let insertDummyBefore = (item, point) => {
  const lastChild = getLastChild()
  if (
    lastChild !== false &&
    lastChild === item &&
    DOMHelper.elementIsBelowPoint(lastChild, point, lastChild.offsetHeight / 2) === true
  ) {
    itemContainer.appendChild(dummyElement)
  } else {
    itemContainer.insertBefore(dummyElement, item)
  }
}

let move = (item, data) => {
  if (hasMoved === false) {
    popElement()
  }
  hasMoved = true
  const point: Point = {x: data.clientX, y: data.clientY}
  let offset = DOMHelper.getOffsetFromPoint(itemContainer, point)
  let x = offset.x - initialX
  let y = offset.y - initialY

  item.style.transform = `translateX(${x}px) translateY(${y}px)`
  const el = DOMUtil.getClosestChildFromPoint(itemContainer, point, item => {
    return (
      item.classList.contains('item') === true &&
      item.classList.contains('item--active') === false
    )
  })
  if (el !== false) {
    createDummy()
    insertDummyBefore(el, point)
  }
}

let updateInitialPosition = data => {
  const offset = DOMHelper.getOffsetFromPoint(activeItem, {x: data.clientX, y: data.clientY})
  initialX = offset.x
  initialY = offset.y
}

let reset = () => {
  isDragActive = false
  activeItem = undefined
}

const manager: DragEventManager = new DragEventManager({
  enableLongPress: true,
  longPressWait: 0.5,
  onDown: (event, manager) => {
    const currentData = event.currentEventData
    if (currentData !== false) {
      const target = DOMUtil.findAncestorWithClass(currentData.target, 'item', false)
    }
  },
  onDrag: (event, manager) => {
    const currentData = event.currentEventData
    if (currentData !== false) {
      const target = DOMUtil.findAncestorWithClass(currentData.target, 'item', false)
      if (isDragActive === true) {
        move(activeItem, currentData)
      }
    } 
  },
  onUp: (event, manager) => {
    activeItem.classList.remove('item--active')
    unpopElement()
    itemContainer.replaceChild(activeItem, dummyElement)
    reset()
  },
  onLongPress: (event, manager) => {
    const currentData = event.downData
    const target = DOMUtil.findAncestorWithClass(currentData.target, 'item', false)
    if (target !== false) {
      isDragActive = true
      activeItem = <HTMLElement>target
      activeItem.classList.add('item--active')
      updateInitialPosition(currentData)
    }
  }
})