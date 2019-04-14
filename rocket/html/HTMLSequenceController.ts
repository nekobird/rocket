import {
  DOMUtil,
} from '../Rocket'

interface Config {
  selector_item?: string,

  className_active?: string,
  className_js_previous?: string,
  className_js_next?: string,
  className_js_jump?: string,

  before_activate?: Hook,
  before_deactivate?: Hook,

  after_activate?: Hook,
  after_deactivate?: Hook,

  condition_previous?: ConditionHook,
  condition_next?: ConditionHook,
  condition_jump?: ConditionHook,

  before_action?: Callback,
  after_action?: Callback,
}

type ActionName = 'previous' | 'next' | 'jump'

interface Action {
  name?: ActionName

  groupName: string,
  group?: Group,

  currentItem?: HTMLElement,

  nextItemIndex?: number,
  nextItemId?: string,
  nextItem?: HTMLElement,

  trigger?: HTMLElement,
}

interface Group {
  name: string,

  isActive: boolean,

  activeIndex: number,
  activeItem: HTMLElement,

  items: NodeListOf<HTMLElement>,
}

interface Groups {
  [groupName: string]: Group,
}

interface Hook {
  (
    action: Action,
    context?: HTMLSequenceController,
  ): Promise<any>
}

interface ConditionHook {
  (
    action: Action,
    context?: HTMLSequenceController,
  ): boolean
}

interface Callback {
  (
    action: Action,
    context?: HTMLSequenceController,
  ): Promise<any> | void
}

export class HTMLSequenceController {

  private isReady: boolean = false
  private isTransitioning: boolean = false

  // Selector
  public selector_item: string = '.item'

  // Class names
  public className_active: string = '__active'
  public className_js_previous: string = 'js_previous'
  public className_js_next: string = 'js_next'
  public className_js_jump: string = 'js_jump'

  // Elements
  private els_item: NodeListOf<HTMLElement>
  private els_js_jump: NodeListOf<HTMLElement>
  private els_js_previous: NodeListOf<HTMLElement>
  private els_js_next: NodeListOf<HTMLElement>

  // Groups
  public groups: Groups = {}

  // Conditional Hooks
  public condition_previous: ConditionHook = (action, context) => {
    return true
  }
  public condition_next: ConditionHook = (action, context) => {
    return true
  }
  public condition_jump: ConditionHook = (action, context) => {
    return true
  }

  // Hooks
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

  public before_action: Callback = (action, context) => { }
  public after_action: Callback = (action, context) => { }

  constructor(config: Config) {
    this.config = config
    this.initialize()
  }

  // INITIALIZE

  public initialize(): HTMLSequenceController {
    this
      .initialize_elements()
      .initialize_groupObjects()
      .initialize_activeItems()
      .startListening()
    return this
  }

  private initialize_elements(): HTMLSequenceController {
    this.els_item = document.querySelectorAll(this.selector_item)
    this.els_js_previous = document.querySelectorAll(`.${this.className_js_previous}`)
    this.els_js_next = document.querySelectorAll(`.${this.className_js_next}`)
    this.els_js_jump = document.querySelectorAll(`.${this.className_js_jump}`)
    return this
  }

  private initialize_groupObjects(): HTMLSequenceController {
    // Initialize Groups
    Array.from(this.els_item).forEach(element => {
      const groupName: string = element.dataset.group
      const items: NodeListOf<HTMLElement> = document.querySelectorAll(
        `${this.selector_item}[data-group="${groupName}"]`
      )
      // Initialize group object
      this.groups[groupName] = {
        name: groupName,

        isActive: false,

        activeItem: undefined,
        activeIndex: undefined,

        items: items,
      }
    })
    return this
  }

  private initialize_activeItems(): HTMLSequenceController {
    if (this.groupCount > 0) {
      Object.keys(this.groups).forEach(groupName => {
        const group: Group = this.groups[groupName]

        Array.from(group.items).forEach((item: HTMLElement, index: number) => {
          if (item.classList.contains(this.className_active) === true) {
            if (typeof group.activeItem === 'undefined') {
              group.isActive = true

              group.activeIndex = index
              group.activeItem = item
            } else {
              item.classList.remove(this.className_active)
            }
          }
        })

        if (typeof group.activeItem === 'undefined') {
          group.isActive = true

          group.activeIndex = 0
          group.activeItem = group.items[0]

          group.items[0].classList.add(this.className_active)
        }
      })
      this.isReady = true
    }
    return this
  }

  // PUBLIC

  set config(config: Config) {
    Object.assign(this, config)
  }

  get groupCount(): number {
    return Object.keys(this.groups).length
  }

  public getGroupProperties(groupName: string): Group {
    return this.groups[groupName]
  }

  public previous(groupName: string): Promise<any> {
    return new Promise(resolve => {
      this.hub_action(
        this.composeAction('previous', groupName),
        () => { resolve() }
      )
    })
  }

  public next(groupName: string): Promise<any> {
    return new Promise(resolve => {
      this.hub_action(
        this.composeAction('next', groupName),
        () => { resolve() }
      )
    })
  }

  public jump(groupName: string, id: string): Promise<any> {
    return new Promise(resolve => {
      this.hub_action(
        this.composeAction('next', groupName, id),
        () => { resolve() }
      )
    })
  }

  // 5) COMPLETE ACTION

  private completeAction(action: Action, callback?: Function): HTMLSequenceController {
    if (
      action.group.activeItem !== action.nextItem &&
      this[`condition_${action.name}`](action, this) === true
    ) {
      this
        .before_deactivate(action, this)
        .then(() => { return this.item_deactivate(action) })
        .then(() => { return this.after_deactivate(action, this) })
        .then(() => { return this.before_activate(action, this) })
        .then(() => {
          this.item_activate(action)
          return this.after_activate(action, this)
        })
        .then(() => {
          this.isTransitioning = false
          this.after_action(action, this)
          if (typeof callback === 'function') {
            callback()
          }
        })
        .catch(error => {
          this.isTransitioning = false
        })
    } else {
      this.isTransitioning = false
    }
    return this
  }

  private item_deactivate(action: Action): HTMLSequenceController {
    Array.from(action.group.items).forEach(item => {
      item.classList.remove(this.className_active)
    })
    action.group.activeItem = undefined
    action.group.activeIndex = undefined
    action.group.isActive = false
    return this
  }

  private item_activate(action: Action): HTMLSequenceController {
    action.nextItem.classList.add(this.className_active)
    action.group.activeItem = action.nextItem
    action.group.activeIndex = action.nextItemIndex
    action.group.isActive = true
    return this
  }

  // SET ACTION TO TARGET

  private setActionTarget_previous(action: Action): Action {
    let index: number
    if (action.group.activeIndex - 1 >= 0) {
      index = action.group.activeIndex - 1
    } else {
      index = action.group.items.length - 1
    }
    action.nextItem = action.group.items[index]
    action.nextItemIndex = index
    return action
  }

  private setActionTarget_next(action: Action): Action {
    let index: number
    if (action.group.activeIndex + 1 >= action.group.items.length) {
      index = 0
    } else {
      index = action.group.activeIndex + 1
    }
    action.nextItem = action.group.items[index]
    action.nextItemIndex = index
    return action
  }

  private setActionTarget_jump(action: Action): Action {
    action.nextItem = document.querySelector(
      `${this.selector_item}[data-group="${action.groupName}"][data-id="${action.nextItemId}"]`
    )
    action.nextItemIndex = Array.from(action.group.items).indexOf(action.nextItem)
    return action
  }

  // COMPOSE ACTIONS

  private createAction(actionName: ActionName, groupName: string): Action {
    return {
      name: actionName,
      groupName: groupName,
      group: this.groups[groupName],
      currentItem: this.groups[groupName].activeItem
    }
  }

  private composeAction(actionName: ActionName, groupName: string, id?: string): Action {
    let action: Action = this.createAction(actionName, groupName)
    if (typeof id === 'string') {
      action.nextItemId = id
    }
    return action
  }

  private composeActionFromTrigger(actionName: ActionName, trigger: HTMLElement): Action {
    const groupName: string = trigger.dataset.group
    const action: Action = this.createAction(actionName, groupName)
    if (typeof trigger.dataset.target === 'string') {
      action.nextItemId = trigger.dataset.target
    }
    action.trigger = trigger
    return action
  }

  // 4) ACTION HUB

  private hub_action(action: Action, callback?: Function): HTMLSequenceController {
    // Update action
    this[`setActionTarget_${action.name}`](action)
    Promise
      .resolve(this.before_action(action, this))
      .then(() => {
        this.completeAction(action, callback)
      })
      .catch(() => {
        this.isTransitioning = false
      })
    return this
  }

  // 3) EVENT HUB

  private hub_event(event: Event, actionName: ActionName): HTMLSequenceController {
    if (
      this.isReady === true &&
      this.isTransitioning === false
    ) {
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
      } else {
        this.isTransitioning = false
      }
    }
    return this
  }

  // 2) EVENT HANDLERS

  private eventHandler_click_next = (event: Event) => {
    this.hub_event(event, 'next')
  }
  private eventHandler_click_previous = (event: Event) => {
    this.hub_event(event, 'previous')
  }
  private eventHandler_click_jump = (event: Event) => {
    this.hub_event(event, 'jump')
  }

  // 1) LISTEN

  private startListening(): HTMLSequenceController {
    Array.from(this.els_js_next).forEach(element => {
      element.addEventListener('click', this.eventHandler_click_next)
    })
    Array.from(this.els_js_previous).forEach(element => {
      element.addEventListener('click', this.eventHandler_click_previous)
    })
    Array.from(this.els_js_jump).forEach(element => {
      element.addEventListener('click', this.eventHandler_click_jump)
    })
    return this
  }

  public stopListening(): HTMLSequenceController {
    Array.from(this.els_js_next).forEach(element => {
      element.removeEventListener('click', this.eventHandler_click_next)
    })
    Array.from(this.els_js_previous).forEach(element => {
      element.removeEventListener('click', this.eventHandler_click_previous)
    })
    Array.from(this.els_js_jump).forEach(element => {
      element.removeEventListener('click', this.eventHandler_click_jump)
    })
    return this
  }

}