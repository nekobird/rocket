import {
  DOMUtil,
} from '../Rocket'

interface Config {
  selector_item?: string,

  className_active?: string,
  className_js_activate?: string,
  className_js_deactivate?: string,
  className_js_toggle?: string,
  className_js_activateAll?: string,
  className_js_deactivateAll?: string,
  className_js_toggleAll?: string,

  condition_activate?: ConditionHook,
  condition_deactivate?: ConditionHook,
  condition_toggle?: ConditionHook,
  condition_activateAll?: ConditionHook,
  condition_deactivateAll?: ConditionHook,
  condition_toggleAll?: ConditionHook,

  before_activate?: Hook,
  before_deactivate?: Hook,
  after_activate?: Hook,
  after_deactivate?: Hook,

  before_action?: Callback,
  after_action?: Callback,
}

interface Hook {
  (
    action: Action,
    context?: HTMLPolyController,
  ): Promise<any>
}

interface ConditionHook {
  (
    action: Action,
    context?: HTMLPolyController,
  ): boolean
}

interface ListenToHook {
  (
    group: Group,
    context: HTMLPolyController
  ): void
}

interface Callback {
  (
    action: Action,
    context?: HTMLPolyController,
  ): Promise<any> | void
}

interface Groups {
  [groupName: string]: Group,
}

interface Group {
  name: string,
  items: NodeListOf<HTMLElement>,
  activeItems?: HTMLElement[],
  isActive: boolean,
}

type ActionName = 'activate' | 'activateAll' | 'deactivate' | 'deactivateAll' | 'toggle' | 'toggleAll'

interface Action {
  name?: ActionName,

  groupName: string,
  group?: Group,

  targetId?: string,
  targetItem?: HTMLElement,

  trigger?: HTMLElement,
}

export class HTMLPolyController {

  private isReady: boolean = false
  private isTransitioning: boolean = false

  public listenTo_clickOutside: boolean = false
  public listenTo_keydown: boolean = false

  // SELECTOR
  public selector_item: string = '.item'

  // CLASS NAME
  public className_active: string = '__active'

  public className_js_activate: string = 'js_activate'
  public className_js_deactivate: string = 'js_deactivate'
  public className_js_toggle: string = 'js_toggle'

  public className_js_activateAll: string = 'js_activateAll'
  public className_js_deactivateAll: string = 'js_deactivateAll'
  public className_js_toggleAll: string = 'js_toggleAll'

  // HTML ELEMENT
  private els_item: NodeListOf<HTMLElement>

  private els_js_activate: NodeListOf<HTMLElement>
  private els_js_deactivate: NodeListOf<HTMLElement>
  private els_js_toggle: NodeListOf<HTMLElement>

  private els_js_activateAll: NodeListOf<HTMLElement>
  private els_js_deactivateAll: NodeListOf<HTMLElement>
  private els_js_toggleAll: NodeListOf<HTMLElement>

  // GROUPS
  private groups: Groups = {}

  // CONDITION HOOK
  public condition_activate: ConditionHook = (action, context) => {
    return true
  }
  public condition_deactivate: ConditionHook = (action, context) => {
    return true
  }
  public condition_toggle: ConditionHook = (action, context) => {
    return true
  }

  public condition_activateAll: ConditionHook = (action, context) => {
    return true
  }
  public condition_deactivateAll: ConditionHook = (action, context) => {
    return true
  }
  public condition_toggleAll: ConditionHook = (action, context) => {
    return true
  }

  // LISTEN TO HOOK
  public onClickOutside: ListenToHook = (group, context) => { }
  public onKeydown: ListenToHook = (group, context) => { }

  // HOOK
  public before_activate: Hook = (action, context) => {
    return new Promise(resolve => {
      resolve()
    })
  }
  public after_activate: Hook = (action, context) => {
    return new Promise(resolve => {
      resolve()
    })
  }

  public before_deactivate: Hook = (action, context) => {
    return new Promise(resolve => {
      resolve()
    })
  }
  public after_deactivate: Hook = (action, context) => {
    return new Promise(resolve => {
      resolve()
    })
  }

  public before_action: Callback = (action, context) => { }
  public after_action: Callback = (action, context) => { }

  constructor(config: Config) {
    this.config = config
    this.initialize()
  }

  set config(config: Config) {
    Object.assign(this, config)
  }

  get groupCount(): number {
    return Object.keys(this.groups).length
  }

  public getGroupProperties(groupName: string): Group {
    return this.groups[groupName]
  }

  public activate(groupName: string, id: string): HTMLPolyController {
    this.hub_action(this.composeAction('activate', groupName, id))
    return this
  }

  public deactivate(groupName: string, id: string): HTMLPolyController {
    this.hub_action(this.composeAction('deactivate', groupName, id))
    return this
  }

  public toggle(groupName: string, id: string): HTMLPolyController {
    this.hub_action(this.composeAction('toggle', groupName, id))
    return this
  }

  public activateAll(groupName: string): HTMLPolyController {
    this.hub_action(this.composeAction('activateAll', groupName))
    return this
  }

  public deactivateAll(groupName: string): HTMLPolyController {
    this.hub_action(this.composeAction('deactivateAll', groupName))
    return this
  }

  public toggleAll(groupName: string): HTMLPolyController {
    this.hub_action(this.composeAction('toggleAll', groupName))
    return this
  }

  // INITIALIZE
  public initialize(): HTMLPolyController {
    this
      .initialize_elements()
      .initialize_groupObjects()
      .initialize_activeItems()
      .startListening()
    return this
  }

  private initialize_elements(): HTMLPolyController {
    this.els_item = document.querySelectorAll(this.selector_item)

    this.els_js_activate = document.querySelectorAll(`.${this.className_js_activate}`)
    this.els_js_deactivate = document.querySelectorAll(`.${this.className_js_deactivate}`)
    this.els_js_toggle = document.querySelectorAll(`.${this.className_js_toggle}`)

    this.els_js_activateAll = document.querySelectorAll(`.${this.className_js_activateAll}`)
    this.els_js_deactivateAll = document.querySelectorAll(`.${this.className_js_deactivateAll}`)
    this.els_js_toggleAll = document.querySelectorAll(`.${this.className_js_toggleAll}`)
    return this
  }

  private initialize_groupObjects(): HTMLPolyController {
    // Initialize Groups
    Array.from(this.els_item).forEach(item => {
      const groupName: string = item.dataset.group
      const items: NodeListOf<HTMLElement> = document.querySelectorAll(
        `${this.selector_item}[data-group="${groupName}"]`
      )
      // Initialize Group
      this.groups[groupName] = {
        name: groupName,
        items: items,
        activeItems: [],
        isActive: false,
      }
    })
    return this
  }

  private initialize_activeItems(): HTMLPolyController {
    if (this.groupCount > 0) {

      Object.keys(this.groups).forEach(groupName => {
        const group: Group = this.groups[groupName]

        Array.from(group.items).forEach((item, index) => {
          if (item.classList.contains(this.className_active)) {
            group.activeItems.push(item)
            group.isActive = true
          }
        })
      })

      this.isReady = true
    }
    return this
  }

  // ACTION

  private item_activate(action: Action): HTMLPolyController {
    action.targetItem.classList.add(this.className_active)
    action.group.activeItems.push(action.targetItem)
    action.group.isActive = true
    return this
  }

  private item_deactivate(action: Action): HTMLPolyController {
    action.targetItem.classList.remove(this.className_active)
    const index: number = action.group.activeItems.indexOf(action.targetItem)
    action.group.activeItems.slice(index, 1)
    if (action.group.activeItems.length === 0) {
      action.group.isActive = false
    }
    return this
  }

  // 5) HANDLE ACTIONS

  private handleAction_activation(actionName: 'activate' | 'deactivate', action: Action): HTMLPolyController {
    if (this[`condition_${actionName}`](action, this) === true) {
      this[`before_${actionName}`](action, this)
        .then(() => {
          this[`item_${actionName}`](action)
          return this[`after_${actionName}`](action, this)
        })
        .then(() => {
          this.isTransitioning = false
          this.after_action(action, this)
        })
    }
    return this
  }

  private handleAction_toggle(action: Action): HTMLPolyController {
    if (this.condition_toggle(action, this) === true) {
      if (action.targetItem.classList.contains(this.className_active) === true) {
        this.handleAction_activation('deactivate', action)
      } else {
        this.handleAction_activation('activate', action)
      }
    }
    return this
  }

  private handleAction_activationAll(action: Action): HTMLPolyController {
    if (this[`condition_${action.name}`](action, this) === true) {
      for (let i: number = 0; i < action.group.items.length; i++) {
        let item = action.group.items[i]
        // Action Creation
        let individualAction: Action = Object.assign({
          targetId: item.dataset.id,
          targetItem: item,
        }, action)
        // Handle Action
        if (action.name === 'activateAll') {
          if (item.classList.contains(this.className_active) === false) {
            this.handleAction_activation('activate', individualAction)
          }
        } else if (action.name === 'deactivateAll') {
          if (item.classList.contains(this.className_active) === true) {
            this.handleAction_activation('deactivate', individualAction)
          }
        } else if (action.name === 'toggleAll') {
          this.handleAction_toggle(individualAction)
        }
      }
    }
    return this
  }

  // HELPER METHODS FOR CREATING AND COMPOSING ACTIONS

  private createAction(actionName: ActionName, groupName: string): Action {
    return {
      name: actionName,
      groupName: groupName,
      group: this.groups[groupName],
    }
  }

  private composeAction(actionName: ActionName, groupName: string, id?: string): Action {
    let action: Action = this.createAction(actionName, groupName)
    if (typeof id === 'string') {
      action.targetId = id
      action.targetItem = document.querySelector(
        `${this.selector_item}[data-group="${groupName}"][data-id="${id}"]`
      )
    }
    return action
  }

  private composeActionFromTrigger(actionName: ActionName, trigger: HTMLElement): Action {
    const groupName: string = trigger.dataset.group
    let whitelist: string[] = ['activate', 'deactivate', 'toggle']
    if (whitelist.indexOf(actionName) !== -1) {
      return this.composeAction(actionName, groupName, trigger.dataset.target)
    } else {
      return this.composeAction(actionName, groupName)
    }
  }

  // 4) DIRECT ACTIONS INTO A SINGLE HUB TO DISTRIBUTE

  private hub_action(action: Action): HTMLPolyController {
    Promise
      .resolve(
        this.before_action(action, this)
      )
      .then(() => {
        if (
          action.name === 'activate' ||
          action.name === 'deactivate'
        ) {
          this.handleAction_activation(action.name, action)
        } else if (action.name === 'toggle') {
          this.handleAction_toggle(action)
        } else {
          this.handleAction_activationAll(action)
        }
      })
    return this
  }

  // 3) DIRECT EVENTS INTO A CENTRAL HUB

  private hub_event(event: Event, actionName: ActionName): HTMLPolyController {
    if (this.isReady === true) {
      this.isTransitioning = true
      const trigger = DOMUtil.findAncestorWithClass(
        <HTMLElement>event.target,
        this[`className_js_${actionName}`],
        false
      )
      if (
        typeof trigger !== 'undefined' &&
        trigger instanceof HTMLElement
      ) {
        this.hub_action(
          this.composeActionFromTrigger(actionName, trigger)
        )
      }
    }
    return this
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
    if (this.listenTo_clickOutside === true) {
      Object.keys(this.groups).forEach(groupName => {
        let group: Group = this.groups[groupName]
        if (
          group.isActive == true &&
          DOMUtil.hasAncestor(<HTMLElement>event.target, group.activeItems) === false
        ) {
          this.onClickOutside(group, this)
        }
      })
    }
  }

  private eventHandler_keydown = (event: Event) => {
    if (this.listenTo_keydown === true) {
      Object.keys(this.groups).forEach(groupName => {
        let group: Group = this.groups[groupName]
        this.onKeydown(group, this)
      })
    }
  }

  // 1) LISTEN TO EVENTS

  private startListening(): HTMLPolyController {
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

  public stopListening(): HTMLPolyController {
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