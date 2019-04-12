import {
  DOMUtil
} from '../../../rocket/Rocket'

interface Config {
  activeClassName?: string,
  afterActivate?: Hook,
  afterDeactivate?: Hook,
  beforeActivate?: Hook,
  beforeDeactivate?: Hook,
  itemSelector?: string,
  jsActivateClassName?: string,
  jsDeactivateClassName?: string,
}

interface Data {
  currentActiveItem?: HTMLElement,
  nextActiveItem?: HTMLElement | null,
  targetId?: string,
  trigger?: HTMLElement,
}

interface Hook {
  (
    data: Data,
    context: BinarySwitcher
  ): Promise<any>
}

export class BinarySwitcher {

  private isReady: boolean = false
  private isTransitioning: boolean = false
  
  private isActive: boolean = false
  private activeItem: HTMLElement = undefined

  // Selectors
  public itemSelector: string = '.item'

  // Class names
  public activeClassName: string = '__active'
  public jsActivateClassName: string = 'js_activate'
  public jsDeactivateClassName: string = 'js_deactivate'

  // Elements
  public els_item: NodeListOf<HTMLElement> = undefined
  public els_js_activate: NodeListOf<HTMLElement> = undefined
  public els_js_deactivate: NodeListOf<HTMLElement> = undefined

  // Hooks
  public beforeActivate: Hook = (data, context) => {
    return new Promise(resolve => {
      resolve()
    })
  }
  public afterActivate: Hook = (data, context) => {
    return new Promise(resolve => {
      resolve()
    })
  }
  public beforeDeactivate: Hook = (data, context) => {
    return new Promise(resolve => {
      resolve()
    })
  }
  public afterDeactivate: Hook = (data, context) => {
    return new Promise(resolve => {
      resolve()
    })
  }

  constructor(config?: Config) {
    this.config = config
    this.initialize()
  }

  set config(config: Config) {
    Object.assign(this, config)
  }

  activate(data: Data) {
    this.isTransitioning = true
    data.currentActiveItem = this.activeItem
    data.nextActiveItem = document.querySelector(
      `${this.itemSelector}[data-id="${data.targetId}"]`
    )
    if (this.isActive === true) {
      this
        .beforeDeactivate(data, this)
        .then(() => {
          data.currentActiveItem.classList.remove(this.activeClassName)
          this.activeItem = undefined
          this.isActive = false
          return this.afterDeactivate(data, this)
        })
        .then(() => this.beforeActivate(data, this))
        .then(() => {
          data.nextActiveItem.classList.add(this.activeClassName)
          this.activeItem = data.nextActiveItem
          this.isActive = true
          this.isTransitioning = false
          return this.afterActivate(data, this)
        })
    } else {
      this
        .afterActivate(data, this)
        .then(() => {
          data.nextActiveItem.classList.add(this.activeClassName)
          this.activeItem = data.nextActiveItem
          this.isActive = true
          this.isTransitioning = false
          return this.afterActivate(data, this)
        })
    }
  }

  deactivate(data) {
    this.isTransitioning = true
    if (this.isActive === true) {
      data.currentActiveItem = this.activeItem
      data.nextActiveItem = null
      this
        .beforeDeactivate(data, this)
        .then(() => {
          data.currentActiveItem.classList.remove(this.activeClassName)
          this.activeItem = undefined
          this.isActive = false
          this.isTransitioning = false
          return this.afterDeactivate(data, this)
        })
    }
  }

  initialize() {
    this
      .initializeElements()
      .initializeActiveItems()
      .startListening()
    return this
  }

  initializeElements() {
    this.els_item = document.querySelectorAll(this.itemSelector)
    this.els_js_activate = document.querySelectorAll(`.${this.jsActivateClassName}`)
    this.els_js_deactivate = document.querySelectorAll(`.${this.jsDeactivateClassName}`)
    return this
  }

  initializeActiveItems() {
    this.els_item.forEach(element => {
      if (element.classList.contains(this.activeClassName) === true) {
        if (this.isActive === false) {
          this.activeItem = element
          this.isActive = true
        } else {
          element.classList.remove(this.activeClassName)
        }
      }
    })
    return this
  }

  private _click_activate_handler = event => {
    if (
      this.isReady === true &&
      this.isTransitioning === false
    ) {
      const trigger = DOMUtil.findAncestorWithClass(
        event.target, this.jsActivateClassName, false
      )
      if (typeof trigger === 'object') {
        const data = {
          trigger: trigger,
          target_id: trigger.dataset.target
        }
        this.activate(data)
      }
    }
  }
  private _click_deactivate_handler = event => {
    if (
      this.isReady === true &&
      this.isTransitioning === false
    ) {
      const trigger = DOMUtil.findAncestorWithClass(
        event.target, this.jsDeactivateClassName, false
      )
      if (trigger) {
        const data = {
          trigger: trigger,
          target_id: trigger.dataset.target
        }
        this.activate(data)
      }
    }
  }

  private startListening() {
    this.els_js_activate.forEach(element => {
      element.addEventListener('click', this._click_activate_handler)
    })
    this.els_js_deactivate.forEach(element => {
      element.addEventListener('click', this._click_deactivate_handler)
    })
    return this
  }

  private stopListening() {
    this.els_js_activate.forEach(element => {
      element.removeEventListener('click', this._click_activate_handler)
    })
    this.els_js_deactivate.forEach(element => {
      element.removeEventListener('click', this._click_deactivate_handler)
    })
    return this
  }

}