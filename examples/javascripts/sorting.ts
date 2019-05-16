import {
  DOMHelper,
  Sortable,
} from '../../rocket/rocket'


const sortableContainer: HTMLElement = document.querySelector('.sortableContainer')
const sortableItems: NodeListOf<HTMLElement> = document.querySelectorAll('.sortableItem')
const sortable = new Sortable({
  activateOnLongPress: true,
  container: sortableContainer,
  items: Array.from(sortableItems),
  moveItem: (item, to, context) => {
    const paddingLeft: number = <number>DOMHelper.getStyleValue(context.config.container, 'paddingLeft', true)
    item.style.transform = `translateX(${paddingLeft}px) translateY(${to.y}px)`
  }
}).initialize()
