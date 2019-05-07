import {
  DOMUtil,
} from '../rocket'

export interface InputFocusManagerConfig {
  activeClassName?: string,
  inputContainerClassName?: string,

  activateOnFocus?: boolean,

  beforeActivate?: (inputContainer: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => Promise<void>,
  afterActivate?: (inputContainer: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => void,

  conditionActivate?: (inputContainer: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => boolean,

  beforeDeactivate?: (inputContainer: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => Promise<void>,
  afterDeactivate?: (inputContainer: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => void,

  activate?: (inputContainer: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement, activeClassName: string) => Promise<void>,
  deactivate?: (inputContainer: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement, activeClassName: string) => Promise<void>,
}

export const INPUT_FOCUS_MANAGER_CONFIG: InputFocusManagerConfig = {
  activeClassName          : 'floating-label-field--focus',
  inputContainerClassName  : 'floating-label-field',
  activateOnFocus          : true,

  conditionActivate: (inputContainer, input) => {
    if (input.value === '') {
      return true
    } else {
      return false
    }
  },

  beforeActivate: (inputContainer, input) => { return Promise.resolve() },
  afterActivate : (inputContainer, input) => { return Promise.resolve() },

  beforeDeactivate: (inputContainer, input) => { return Promise.resolve() },
  afterDeactivate : (inputContainer, input) => { return Promise.resolve() },

  activate: (inputContainer, input, activeClassName) => {
    inputContainer.classList.add(activeClassName)
    return Promise.resolve()
  },
  deactivate: (inputContainer, input, activeClassName) => {
    inputContainer.classList.remove(activeClassName)
    return Promise.resolve()
  }
}

export class InputFocusManager {

  public inputElements: (HTMLInputElement | HTMLTextAreaElement)[]
  public inputContainerElements: HTMLElement[]

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
    const inputContainerElements: NodeListOf<HTMLElement> =
      document.querySelectorAll(`.${this.config.inputContainerClassName}`)

    if (inputContainerElements !== null) {
      this.inputContainerElements = Array.from(inputContainerElements)

      this.inputElements = []
      this.inputContainerElements.forEach(inputContainer => {
        const input = DOMUtil.findDescendant(
          inputContainer,
          element => {
            return (element.nodeName === 'INPUT')
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
      const inputContainer = DOMUtil.findAncestorWithClass(
        input, this.config.inputContainerClassName, false
      )
      if (inputContainer !== false) {
        if (this.config.conditionActivate(<HTMLElement>inputContainer, input) === true) {
          this.activate(<HTMLElement>inputContainer, input);
        } else {
          this.deactivate(<HTMLElement>inputContainer, input);
        }
      }
    })
  }

  private activate(inputContainer: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement): Promise<void> {
    return this.config
      .beforeActivate(inputContainer, input)
      .then(() => {
        return this.config.activate(inputContainer, input, this.config.activeClassName)
      })
      .then(() => {
        return this.config.afterActivate(inputContainer, input)
      })
  }

  private deactivate(inputContainer: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement): Promise<void> {
    return this.config
      .beforeDeactivate(inputContainer, input)
      .then(() => {
        return this.config.deactivate(inputContainer, input, this.config.activeClassName)
      })
      .then(() => {
        return this.config.afterDeactivate(inputContainer, input)
      })
  }

  private getInputFocusManagerElement(input: HTMLInputElement | HTMLTextAreaElement): HTMLElement | false {
    const result = DOMUtil.findAncestorWithClass(
      input, this.config.inputContainerClassName, false
    )
    if (result !== false) {
      return <HTMLElement>result
    }
    return false
  }

  private eventHandlerFocus = event => {
    if (this.config.activateOnFocus === true) {
      const inputContainerElement = this.getInputFocusManagerElement(event.target)
      if (inputContainerElement !== false) {
        this.activate(inputContainerElement, event.target)
      }
    }
  }

  private eventHandlerBlur = event => {
    if (this.config.activateOnFocus === true) {
      const inputContainer = this.getInputFocusManagerElement(event.target)
      if (inputContainer !== false) {
        if (
          this.config.conditionActivate(<HTMLElement>inputContainer, event.target) === true
        ) {
          this.deactivate(inputContainer, event.target)
        }
      }
    }
  }

  private eventHandlerInput = event => {
    if (this.config.activateOnFocus === false) {
      const inputContainer = this.getInputFocusManagerElement(event.target)
      if (inputContainer !== false) {
        if (
          this.config.conditionActivate(<HTMLElement>inputContainer, event.target) === true
        ) {
          this.deactivate(inputContainer, event.target)
        } else {
          this.activate(inputContainer, event.target)
        }
      }
    }
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