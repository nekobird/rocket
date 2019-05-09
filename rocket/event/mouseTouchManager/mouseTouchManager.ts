// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent

export interface MouseTouchManagerConfig {

}

export interface MouseTouchEventData {
  downElement: HTMLElement,
  upElement: HTMLElement,
  downTime: number,
  upTime: number,
  duration: number,
}

export class MouseTouchManager {

  // onDown
  // onDrag
  // onMove
  // OnUp

  public config: MouseTouchManagerConfig

  constructor() {

  }


  public eventHandlerTouchStart = event => {
    
  }

  public eventHandlerTouchMove = event => {

  }

  public eventHandlerTouchEnd = event => {

  }

  public listen() {
    window.addEventListener('touchstart', this.eventHandlerTouchStart)
    window.addEventListener('touchmove',  this.eventHandlerTouchStart)
    window.addEventListener('touchend',   this.eventHandlerTouchStart)

    window.addEventListener('mousedown', this.eventHandlerTouchStart)
    window.addEventListener('mousemove', this.eventHandlerTouchStart)
    window.addEventListener('mouseup',   this.eventHandlerTouchStart)
  }
}