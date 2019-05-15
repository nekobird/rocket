import {
  DOMHelper,
  Sortable,
} from '../../rocket/rocket'

const sortable = new Sortable({
  activateOnLongPress: false,
  moveItem: (item, to, context) => {
    const paddingLeft: number = <number>DOMHelper.getStyleValue(context.config.itemContainer, 'paddingLeft', true)
    item.style.transform = `translateX(${paddingLeft}px) translateY(${to.y}px)`
  }
}).initialize()
