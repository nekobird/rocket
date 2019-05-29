import * as Rocket from '../../rocket/rocket'

import {
  DragEventManager,
} from '../../rocket/rocket'

// @ts-ignore
window.rocket = Rocket

new DragEventManager({
  enableLongPress: true,
  longPressWait: 1,

  onDown: (event, manager) => {
    if (event.currentEventData !== false) {
      event.currentEventData.event.preventDefault()
      console.log('down')
    }
  },
  onDrag: (event, manager) => {
    if (event.currentEventData !== false) {
      event.currentEventData.event.preventDefault()
      console.log('down')
    }

    if (
      event.longPressIsCleared === false &&
      event.currentTargetElement !== false &&
      event.currentTargetElement !== event.getTargetElementFromData(event.downData)
    ) {
      event.clearLongPress()
    }
  },
  onUp: (event, manager) => {
    console.log("up")
  },
  onLongPress: (event, manager) => {
    console.log("Long press")
  }
})