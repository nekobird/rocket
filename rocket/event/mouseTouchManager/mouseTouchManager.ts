// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent

export interface MouseTouchManagerConfig {
  onDown?: () => void,
  onMove?: () => void,
  onUp?:   () => void,
}

export interface MouseTouchEventData {
  identifier: string,
  downTargetElement: HTMLElement,
  upTargetElement: HTMLElement,
  downTime: number,
  upTime: number,
  duration: number,
  type: 'MOUSE' | 'TOUCH',
}
export interface ActiveMouseTouchEventData {
  [identifier: string]: MouseTouchEventData
}

export class MouseTouchManager {

  // onDown
  // onDrag
  // onMove
  // OnUp

  public config: MouseTouchManagerConfig

  public activeEvents: MouseTouchEventData[]

  public mouseIsDown: boolean = false

  constructor() {
    this.activeEvents = []
  }

  private getActiveEventDataFromIdentifier(identifier: number | 'mouse'): MouseTouchEventData | false {
    this.activeEvents.forEach(eventData => {
      if (eventData.identifier === identifier) {
        return eventData
      }
    })
    return false
  }

  private composeEventData(eventName: string, event: Touch | MouseEvent) {

  }

  public eventHandlerMouseDown = (event: MouseEvent) => {

  }

  public eventHandlerMouseMove = (event: MouseEvent) => {
    
  }

  public eventHandlerTouchStart = (event: TouchEvent) => {
    Array.from(event.targetTouches).forEach((touch: Touch) => {
      if (typeof this.getActiveEventDataFromIdentifier(touch.identifier) === 'object') {
        let data = this.composeEventData('start', touch)
      }
    })
  }

  public eventHandlerTouchMove = event => {
    Array.from(event.targetTouches).forEach((touch: Touch) => {
      if (typeof this.getActiveEventDataFromIdentifier(touch.identifier) === 'object') {
        let data = this.composeEventData('start', touch)
      }
    })
  }

  public eventHandlerTouchEnd = event => {
    Array.from(event.targetTouches).forEach((touch: Touch) => {
      if (typeof this.getActiveEventDataFromIdentifier(touch.identifier) === 'object') {
        let data = this.composeEventData('start', touch)
      }
    })
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