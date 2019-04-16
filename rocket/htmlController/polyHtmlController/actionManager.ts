export class ActionManager {

  public actionIsRunning: boolean = false

  private controller

  constructor() {

  }


  private hub_action(action: Action, callback?: Function): PolyHTMLController {

    let preAction: Promise<void>

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

  private composeActionFromEvent(actionName: ActionName, trigger: HTMLElement): Action {
    const groupName: string = trigger.dataset.group
    let whitelist: string[] = ['activate', 'deactivate', 'toggle']
    if (whitelist.indexOf(actionName) !== -1) {
      return this.composeAction(actionName, groupName, trigger.dataset.target)
    } else {
      return this.composeAction(actionName, groupName)
    }
  }

  private endAction(callback?: Function): ActionManager {
    if (this.isNestedAction === false) {
      this.isTransitioning = false
    }
    if (typeof callback === 'function') { callback() }
    return this
  }

}