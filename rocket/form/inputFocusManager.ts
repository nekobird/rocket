import {
  DOMUtil,
} from '../rocket'

export interface InputFocusManagerConfig {
  activeClassName?: string,
  containerClassName?: string,

  activateOnFocus?: boolean,

  beforeActivate?: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => Promise<void>,
  afterActivate?: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => void,

  conditionActivate?: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => boolean,

  beforeDeactivate?: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => Promise<void>,
  afterDeactivate?: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => void,

  activate?: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement, activeClassName: string) => Promise<void>,
  deactivate?: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement, activeClassName: string) => Promise<void>,
}

export const INPUT_FOCUS_MANAGER_CONFIG: InputFocusManagerConfig = {
  activeClassName   : 'floating-label-field--focus',
  containerClassName: 'floating-label-field',
  activateOnFocus   : true,

  conditionActivate: (container, input) => {
    if (input.value !== '') {
      return true
    }
    return false
  },

  beforeActivate: (container, input) => { return Promise.resolve() },
  afterActivate : (container, input) => { return Promise.resolve() },

  beforeDeactivate: (container, input) => { return Promise.resolve() },
  afterDeactivate : (container, input) => { return Promise.resolve() },

  activate: (container, input, activeClassName) => {
    container.classList.add(activeClassName)
    return Promise.resolve()
  },
  deactivate: (container, input, activeClassName) => {
    container.classList.remove(activeClassName)
    return Promise.resolve()
  }
}

export class InputFocusManager {

  public inputElements: (HTMLInputElement | HTMLTextAreaElement)[]
  public containerElements: HTMLElement[]

  public config: InputFocusManagerConfig

  constructor(config?: InputFocusManagerConfig) {
    this.config = Object.assign({}, INPUT_FOCUS_MANAGER_CONFIG)

    if (typeof config === 'object') {
      this.setConfig(config)
    }

    this.getElements()
    this.listen()
    this.initialize()
  }

  private setConfig(config: InputFocusManagerConfig) {
    Object.assign(this.config, config)
  }

  private getElements() {
    const containerElements: NodeListOf<HTMLElement> =
      document.querySelectorAll(`.${this.config.containerClassName}`)

    if (containerElements !== null) {
      this.containerElements = Array.from(containerElements)

      this.inputElements = []
      this.containerElements.forEach(container => {
        const input = DOMUtil.findDescendant(
          container,
          element => {
            return (
              element.nodeName === 'INPUT' ||
              element.nodeName === 'TEXTAREA'
            )
          },
          false
        )
        if (input !== false) {
          this.inputElements.push(<HTMLInputElement | HTMLTextAreaElement>input)
        }
      })
    }
  }

  public initialize() {
    this.inputElements.forEach(input => {
      const container = DOMUtil.findAncestorWithClass(
        input, this.config.containerClassName, false
      )
      if (container !== false) {
        if (this.config.conditionActivate(<HTMLElement>container, input) === true) {
          if (this.isActive(<HTMLElement>container) === false) {
            this.activate(<HTMLElement>container, input);
          }
        } else {
          if (this.isActive(<HTMLElement>container) === true) {
            this.deactivate(<HTMLElement>container, input);
          }
        }
      }
    })
  }

  private activate(container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement): Promise<void> {
    return this.config
      .beforeActivate(container, input)
      .then(() => {
        return this.config.activate(container, input, this.config.activeClassName)
      })
      .then(() => {
        return this.config.afterActivate(container, input)
      })
  }

  private deactivate(container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement): Promise<void> {
    return this.config
      .beforeDeactivate(container, input)
      .then(() => {
        return this.config.deactivate(container, input, this.config.activeClassName)
      })
      .then(() => {
        return this.config.afterDeactivate(container, input)
      })
  }

  private getInputFocusManagerElement(input: HTMLInputElement | HTMLTextAreaElement): HTMLElement | false {
    const result = DOMUtil.findAncestorWithClass(
      input, this.config.containerClassName, false
    )
    if (result !== false) {
      return <HTMLElement>result
    }
    return false
  }

  private eventHandlerFocus = event => {
    if (this.config.activateOnFocus === true) {
      const containerElement = this.getInputFocusManagerElement(event.target)
      if (
        containerElement !== false &&
        this.isActive(<HTMLElement>containerElement) === false
      ) {
        this.activate(containerElement, event.target)
      }
    }
  }

  private eventHandlerBlur = event => {
    if (this.config.activateOnFocus === true) {
      const container = this.getInputFocusManagerElement(event.target)
      if (
        container !== false &&
        this.config.conditionActivate(<HTMLElement>container, event.target) === false &&
        this.isActive(<HTMLElement>container) === true
      ) {
        this.deactivate(container, event.target)
      }
    }
  }

  private eventHandlerInput = event => {
    if (this.config.activateOnFocus === false) {
      const container = this.getInputFocusManagerElement(event.target)
      if (container !== false) {
        if (
          this.config.conditionActivate(<HTMLElement>container, event.target) === true &&
          this.isActive(<HTMLElement>container) === false
        ) {
          this.activate(container, event.target)
        } else {
          if (this.isActive(<HTMLElement>container) === true) {
            this.deactivate(container, event.target)
          }
        }
      }
    }
  }

  private isActive(container: HTMLElement): boolean {
    return container.classList.contains(this.config.activeClassName)
  }

  public listen() {
    this.inputElements.forEach(input => {
      input.addEventListener('focus', this.eventHandlerFocus)
    })
    this.inputElements.forEach(input => {
      input.addEventListener('blur', this.eventHandlerBlur)
    })
    this.inputElements.forEach(input => {
      input.addEventListener('input', this.eventHandlerInput)
    })
  }

  public stop() {
    this.inputElements.forEach(input => {
      input.removeEventListener('focus', this.eventHandlerFocus)
    })
    this.inputElements.forEach(input => {
      input.removeEventListener('blur', this.eventHandlerBlur)
    })
    this.inputElements.forEach(input => {
      input.removeEventListener('input', this.eventHandlerInput)
    })
  }
}