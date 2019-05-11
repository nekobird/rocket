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
    console.log("down")
  },
  onDrag: (event, manager) => {
    if (
      event.currentEventData !== false &&
      event.currentEventData.target !== event.downData.target
    ) {
      event.clearLongPress()
    }
  },
  onUp: (event, manager) => {

  },
  onLongPress: (event, manager) => {
    console.log("Long press")
  }
})