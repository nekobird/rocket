// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent

export interface MouseTouchManagerConfig {

}

export class MouseTouchManager {

  // onDown
  // onDrag
  // onMove
  // OnUp

  public config: MouseTouchManagerConfig

  constructor() {

  }

  public eventHandlerTouchStart = () => {

  }

  public listen() {
    window.addEventListener('touchstart', this.eventHandlerTouchStart)
    window.addEventListener('touchmove',  this.eventHandlerTouchStart)
    window.addEventListener('touchend',   this.eventHandlerTouchStart)
    window.addEventListener('click', this.eventHandlerTouchStart)
    window.addEventListener('touchmove',  this.eventHandlerTouchStart)
    window.addEventListener('touchend',   this.eventHandlerTouchStart)
  }

}