export class polyHtmlControllerEventManager {


  private controller: HTMLController

  private eventMap

  constructor(controller: HTMLController) {
    this.controller = controller
  }

  public initialize() {

  }

  private eventHandlerFactory(eventName, actionName) {
    return function (event: Event) {
      this.controller.eventHub(event, actionName)
    }.bind(this)
  }

  private mapListenerToEventHandler() {
    Array.from(this.map).forEach(eventMap => {
      eventMap.target.addEventListener(eventMap.event, eventMap.handler)
    })
  }

  // 2) HANDLE EVENTS

  private eventHandler_click_activate = (event: Event) => {
    this.hub_event(event, 'activate')
  }
  private eventHandler_click_deactivate = (event: Event) => {
    this.hub_event(event, 'deactivate')
  }
  private eventHandler_click_toggle = (event: Event) => {
    this.hub_event(event, 'toggle')
  }

  private eventHandler_click_activateAll = (event: Event) => {
    this.hub_event(event, 'activateAll')
  }
  private eventHandler_click_deactivateAll = (event: Event) => {
    this.hub_event(event, 'deactivateAll')
  }
  private eventHandler_click_toggleAll = (event: Event) => {
    this.hub_event(event, 'toggleAll')
  }

  private eventHandler_clickOutside = (event: Event) => {
    if (
      this.listenTo_clickOutside === true &&
      this.isTransitioning === false
    ) {
      Object.keys(this.groups).forEach(groupName => {
        let group: Group = this.groups[groupName]
        if (
          group.isActive == true &&
          DOMUtil.hasAncestor(<HTMLElement>event.target, group.activeItems) === false
        ) {
          this.onClickOutside(event, group, this)
        }
      })
    }
  }

  private eventHandler_keydown = (event: Event) => {
    if (
      this.listenTo_keydown === true &&
      this.isTransitioning === false
    ) {
      Object.keys(this.groups).forEach(groupName => {
        let group: Group = this.groups[groupName]
        this.onKeydown(event, group, this)
      })
    }
  }

  private startListening(): PolyHTMLController {

    Array.from(this.els_js_activate).forEach(element => {
      element.addEventListener('click', this.eventHandler_click_activate)
    })
    Array.from(this.els_js_deactivate).forEach(element => {
      element.addEventListener('click', this.eventHandler_click_deactivate)
    })
    Array.from(this.els_js_toggle).forEach(element => {
      element.addEventListener('click', this.eventHandler_click_toggle)
    })

    Array.from(this.els_js_activateAll).forEach(element => {
      element.addEventListener('click', this.eventHandler_click_activateAll)
    })
    Array.from(this.els_js_deactivateAll).forEach(element => {
      element.addEventListener('click', this.eventHandler_click_deactivateAll)
    })
    Array.from(this.els_js_toggleAll).forEach(element => {
      element.addEventListener('click', this.eventHandler_click_toggleAll)
    })

    window.addEventListener('click', this.eventHandler_clickOutside)
    window.addEventListener('keydown', this.eventHandler_keydown)
    return this
  }

  public stopListening(): PolyHTMLController {
    Array.from(this.els_js_activate).forEach(element => {
      element.removeEventListener('click', this.eventHandler_click_activate)
    })
    Array.from(this.els_js_deactivate).forEach(element => {
      element.removeEventListener('click', this.eventHandler_click_deactivate)
    })
    Array.from(this.els_js_toggle).forEach(element => {
      element.removeEventListener('click', this.eventHandler_click_toggle)
    })

    Array.from(this.els_js_activateAll).forEach(element => {
      element.removeEventListener('click', this.eventHandler_click_activateAll)
    })
    Array.from(this.els_js_deactivateAll).forEach(element => {
      element.removeEventListener('click', this.eventHandler_click_deactivateAll)
    })
    Array.from(this.els_js_toggleAll).forEach(element => {
      element.removeEventListener('click', this.eventHandler_click_toggleAll)
    })

    window.removeEventListener('click', this.eventHandler_clickOutside)
    window.removeEventListener('keydown', this.eventHandler_keydown)
    return this
  }
}