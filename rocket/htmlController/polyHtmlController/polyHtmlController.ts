import {
  DOMUtil,
} from '../../rocket'

import {
  Groups
} from './interfaces/index'

export class PolyHTMLController {

  private isReady: boolean = false
  private isTransitioning: boolean = false
  private isNestedAction: boolean = false

  // GROUPS
  private groups: Groups = {}

  // PUBLIC

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
  public onClickOutside: ListenToHook = (event, group, context) => { }
  public onKeydown: ListenToHook = (event, group, context) => { }

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

  public before_action: BeforeActionCallback = (action, context) => { return Promise.resolve() }
  public after_action: AfterActionCallback = (action, context) => { }

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

  public itemIsActive(groupName: string, id: string): boolean {
    const item: HTMLElement = document.querySelector(
      `${this.selector_item}[data-group="${groupName}"][data-id="${id}"]`
    )
    if (item !== null && item instanceof HTMLElement) {
      return item.classList.contains(this.className_active)
    }
    return false
  }

  public groupIsActive(groupName: string): boolean {
    const group: Group = this.groups[groupName]
    if (typeof group !== 'undefined') {
      return group.isActive
    }
    return false
  }

  public getGroupProperties(groupName: string): Group {
    return this.groups[groupName]
  }

  // ACTION

  public activate(groupName: string, id: string): Promise<any> {
    return new Promise(resolve => {
      this.hub_action(
        this.composeAction('activate', groupName, id),
        () => { resolve() }
      )
    })
  }

  public deactivate(groupName: string, id: string): Promise<any> {
    return new Promise(resolve => {
      this.hub_action(
        this.composeAction('deactivate', groupName, id),
        () => { resolve() }
      )
    })
  }

  public toggle(groupName: string, id: string): Promise<any> {
    return new Promise(resolve => {
      this.hub_action(
        this.composeAction('toggle', groupName, id),
        () => { resolve() }
      )
    })
  }

  public activateAll(groupName: string): Promise<any> {
    return new Promise(resolve => {
      this.hub_action(
        this.composeAction('activateAll', groupName),
        () => { resolve() }
      )
    })
  }

  public deactivateAll(groupName: string): Promise<any> {
    return new Promise(resolve => {
      this.hub_action(
        this.composeAction('deactivateAll', groupName),
        () => { resolve() }
      )
    })
  }

  public toggleAll(groupName: string): Promise<any> {
    return new Promise(resolve => {
      this.hub_action(
        this.composeAction('toggleAll', groupName),
        () => { resolve() }
      )
    })
  }

  // INITIALIZE
  public initialize(): PolyHTMLController {
    this
      .initialize_elements()
      .initialize_groupObjects()
      .initialize_activeItems()
      .startListening()
    return this
  }

  private initialize_elements(): PolyHTMLController {
    this.els_item = document.querySelectorAll(this.selector_item)

    this.els_js_activate = document.querySelectorAll(`.${this.className_js_activate}`)
    this.els_js_deactivate = document.querySelectorAll(`.${this.className_js_deactivate}`)
    this.els_js_toggle = document.querySelectorAll(`.${this.className_js_toggle}`)

    this.els_js_activateAll = document.querySelectorAll(`.${this.className_js_activateAll}`)
    this.els_js_deactivateAll = document.querySelectorAll(`.${this.className_js_deactivateAll}`)
    this.els_js_toggleAll = document.querySelectorAll(`.${this.className_js_toggleAll}`)
    return this
  }

  private initialize_groupObjects(): PolyHTMLController {
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

  private initialize_activeItems(): PolyHTMLController {
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

  private item_activate(action: Action): PolyHTMLController {
    action.targetItem.classList.add(this.className_active)
    action.group.activeItems.push(action.targetItem)
    action.group.isActive = true
    return this
  }

  private item_deactivate(action: Action): PolyHTMLController {
    action.targetItem.classList.remove(this.className_active)
    const index: number = action.group.activeItems.indexOf(action.targetItem)
    action.group.activeItems.slice(index, 1)
    if (action.group.activeItems.length === 0) {
      action.group.isActive = false
    }
    return this
  }

  // 5) HANDLE ACTIONS

  private handleAction_activation(actionName: 'activate' | 'deactivate', action: Action, callback?: Function): PolyHTMLController {
    if (this[`condition_${actionName}`](action, this) === true) {
      this[`before_${actionName}`](action, this)
        .then(() => {
          this[`item_${actionName}`](action)
          return this[`after_${actionName}`](action, this)
        })
        .then(() => {
          this.endAction(callback)
          if (this.isNestedAction === false) {
            this.after_action(action, this)
          }
        })
    } else {
      this.endAction(callback)
    }
    return this
  }

  private handleAction_toggle(action: Action, callback?: Function): PolyHTMLController {
    if (this.condition_toggle(action, this) === true) {
      if (action.targetItem.classList.contains(this.className_active) === true) {
        this.handleAction_activation('deactivate', action, callback)
      } else {
        this.handleAction_activation('activate', action, callback)
      }
    } else {
      this.endAction(callback)
    }
    return this
  }

  private handleAction_activationAll(action: Action, callback?: Function): PolyHTMLController {
    if (
      this[`condition_${action.name}`](action, this) === true &&
      action.group.items.length > 0
    ) {
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
            this.handleAction_activation('activate', individualAction, callback)
          }
        } else if (action.name === 'deactivateAll') {
          if (item.classList.contains(this.className_active) === true) {
            this.handleAction_activation('deactivate', individualAction, callback)
          }
        } else if (action.name === 'toggleAll') {
          this.handleAction_toggle(individualAction, callback)
        }
      }
    } else {
      this.endAction(callback)
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

  private endAction(callback?: Function): PolyHTMLController {
    if (this.isNestedAction === false) {
      this.isTransitioning = false
    }
    if (typeof callback === 'function') { callback() }
    return this
  }

  // 4) DIRECT ACTIONS INTO A SINGLE HUB TO DISTRIBUTE

  private hub_action(action: Action, callback?: Function): PolyHTMLController {

    let preAction: Promise<any>

    if (this.isNestedAction === false) {
      preAction = new Promise(resolve => {
        this.isNestedAction = true
        this.before_action(action, this)
          .then(() => {
            this.isNestedAction = false
            resolve()
          })
      })
    } else {
      preAction = Promise.resolve()
    }

    preAction
      .then(() => {
        if (
          action.name === 'activate' ||
          action.name === 'deactivate'
        ) {
          this.handleAction_activation(action.name, action, callback)
        } else if (action.name === 'toggle') {
          this.handleAction_toggle(action, callback)
        } else {
          this.handleAction_activationAll(action, callback)
        }
      })
      .catch(() => {
        this.endAction(callback)
      })
    return this
  }

  // 3) DIRECT EVENTS INTO A CENTRAL HUB

  private hub_event(event: Event, actionName: ActionName): PolyHTMLController {
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
        this.hub_actioDOMUtil
        this.composeActionFromTrigger(actionName, trigger)
        )
      } else {
        this.endAction()
      }
    }
    return this
  }

} DOMUtil