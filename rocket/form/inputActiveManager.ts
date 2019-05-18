import {
  DOMUtil,
} from '../rocket'

export interface InputActiveManagerConfig {
  activeClassName: string,
  containerClassName: string,

  activateOnFocus: boolean,

  beforeActivate: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => Promise<void>,
  afterActivate:  (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => void,

  conditionActivate: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => boolean,

  beforeDeactivate: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => Promise<void>,
  afterDeactivate:  (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => void,

  activate:   (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement, activeClassName: string) => Promise<void>,
  deactivate: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement, activeClassName: string) => Promise<void>,

  onFocus: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement, context: InputActiveManager) => void,
  onBlur:  (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement, context: InputActiveManager) => void,
  onInput: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement, context: InputActiveManager) => void,
}

export const INPUT_FOCUS_MANAGER_CONFIG: InputActiveManagerConfig = {
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
  },

  onFocus: () => {},
  onBlur : () => {},
  onInput: () => {},
}

export class InputActiveManager {

  public inputElements: (HTMLInputElement | HTMLTextAreaElement)[]
  public containerElements?: HTMLElement[]

  public config: InputActiveManagerConfig

  constructor(config?: Partial<InputActiveManagerConfig>) {
    this.config = Object.assign({}, INPUT_FOCUS_MANAGER_CONFIG)
    if (typeof config === 'object') {
      this.setConfig(config)
    }

    this.inputElements = []

    this.getElements()
    this.listen()
    this.initialize()
  }

  private setConfig(config: Partial<InputActiveManagerConfig>) {
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
      const containerElement = DOMUtil.findAncestorWithClass(
        input, this.config.containerClassName, false
      )
      if (containerElement !== false) {
        if (this.config.conditionActivate(<HTMLElement>containerElement, input) === true) {
          if (this.isActive(<HTMLElement>containerElement) === false) {
            this.activate(<HTMLElement>containerElement, input);
          }
        } else {
          if (this.isActive(<HTMLElement>containerElement) === true) {
            this.deactivate(<HTMLElement>containerElement, input);
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

  private getInputActiveManagerElement(input: HTMLInputElement | HTMLTextAreaElement): HTMLElement | false {
    const result = DOMUtil.findAncestorWithClass(
      input, this.config.containerClassName, false
    )
    if (result !== false) {
      return <HTMLElement>result
    }
    return false
  }

  private eventHandlerFocus = event => {
    const containerElement = this.getInputActiveManagerElement(event.target)
    if (containerElement !== false) {
      this.config.onFocus(containerElement, event.target, this)
      if (this.config.activateOnFocus === true) {
        if (this.isActive(<HTMLElement>containerElement) === false) {
          this.activate(containerElement, event.target)
        }
      }
    }
  }

  private eventHandlerBlur = event => {
    const containerElement = this.getInputActiveManagerElement(event.target)
    if (containerElement !== false) {
      this.config.onBlur(containerElement, event.target, this)  
      if (this.config.activateOnFocus === true) {   
        if (
          this.config.conditionActivate(
            <HTMLElement>containerElement, event.target
          ) === false &&
          this.isActive(<HTMLElement>containerElement) === true
        ) {
          this.deactivate(containerElement, event.target)
        }
      }
    } // If container element is valid.
  }

  private eventHandlerInput = event => {
    const containerElement = this.getInputActiveManagerElement(event.target)
    if (containerElement !== false) {
      this.config.onInput(containerElement, event.target, this)
      if (this.config.activateOnFocus === false) {
        if (
          this.config.conditionActivate(
            <HTMLElement>containerElement, event.target
          ) === true &&
          this.isActive(<HTMLElement>containerElement) === false
        ) {
          this.activate(containerElement, event.target)
        } else {
          if (this.isActive(<HTMLElement>containerElement) === true) {
            this.deactivate(containerElement, event.target)
          }
        }
      }
    } // if containerElement is valid
  }

  private isActive(containerElement: HTMLElement): boolean {
    return containerElement.classList.contains(this.config.activeClassName)
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