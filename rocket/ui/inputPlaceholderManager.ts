import {
  DOMUtil,
} from '../rocket'

export interface InputPlaceholderConfig {
  activeClassName?: string,
  inputPlaceholderClassName?: string,

  activateOnFocus?: boolean,

  beforeActivate?: (inputPlaceholder: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => Promise<void>,
  afterActivate?: (inputPlaceholder: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => void,

  conditionActivate?: (inputPlaceholder: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => boolean,

  beforeDeactivate?: (inputPlaceholder: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => Promise<void>,
  afterDeactivate?: (inputPlaceholder: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => void,

  activate?: (inputPlaceholder: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement, activeClassName: string) => Promise<void>,
  deactivate?: (inputPlaceholder: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement, activeClassName: string) => Promise<void>,
}

export const INPUTPLACEHOLDER_CONFIG: InputPlaceholderConfig = {
  activeClassName          : 'input-placeholder--active',
  inputPlaceholderClassName: 'input-placeholder',
  activateOnFocus          : true,

  conditionActivate: (inputPlaceholder, input) => {
    if (input.value === '') {
      return true
    } else {
      return false
    }
  },

  beforeActivate: (inputPlaceholder, input) => { return Promise.resolve() },
  afterActivate : (inputPlaceholder, input) => { return Promise.resolve() },

  beforeDeactivate: (inputPlaceholder, input) => { return Promise.resolve() },
  afterDeactivate : (inputPlaceholder, input) => { return Promise.resolve() },

  activate: (inputPlaceholder, input, activeClassName) => {
    inputPlaceholder.classList.add(activeClassName)
    return Promise.resolve()
  },
  deactivate: (inputPlaceholder, input, activeClassName) => {
    inputPlaceholder.classList.remove(activeClassName)
    return Promise.resolve()
  }
}

export class InputPlaceholderManager {

  public inputElements: (HTMLInputElement | HTMLTextAreaElement)[]
  public inputPlaceholderElements: HTMLElement[]

  public config: InputPlaceholderConfig

  constructor(config?: InputPlaceholderConfig) {
    this.config = Object.assign({}, INPUTPLACEHOLDER_CONFIG)

    if (typeof config === 'object') {
      this.setConfig(config)
    }

    this.getElements()
    this.listen()
    this.initialize()
  }

  private setConfig(config: InputPlaceholderConfig) {
    Object.assign(this.config, config)
  }

  private getElements() {
    const inputPlaceholderElements: NodeListOf<HTMLElement> =
      document.querySelectorAll(`.${this.config.inputPlaceholderClassName}`)

    if (inputPlaceholderElements !== null) {
      this.inputPlaceholderElements = Array.from(inputPlaceholderElements)

      this.inputElements = []
      this.inputPlaceholderElements.forEach(inputPlaceholder => {
        const input = DOMUtil.findDescendant(
          inputPlaceholder,
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
      const inputPlaceholder = DOMUtil.findAncestorWithClass(
        input, this.config.inputPlaceholderClassName, false
      )
      if (inputPlaceholder !== false) {
        if (this.config.conditionActivate(<HTMLElement>inputPlaceholder, input) === true) {
          this.activate(<HTMLElement>inputPlaceholder, input);
        } else {
          this.deactivate(<HTMLElement>inputPlaceholder, input);
        }
      }
    })
  }

  private activate(inputPlaceholder: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement): Promise<void> {
    return this.config
      .beforeActivate(inputPlaceholder, input)
      .then(() => {
        return this.config.activate(inputPlaceholder, input, this.config.activeClassName)
      })
      .then(() => {
        return this.config.afterActivate(inputPlaceholder, input)
      })
  }

  private deactivate(inputPlaceholder: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement): Promise<void> {
    return this.config
      .beforeDeactivate(inputPlaceholder, input)
      .then(() => {
        return this.config.deactivate(inputPlaceholder, input, this.config.activeClassName)
      })
      .then(() => {
        return this.config.afterDeactivate(inputPlaceholder, input)
      })
  }

  private getInputPlaceholderElement(input: HTMLInputElement | HTMLTextAreaElement): HTMLElement | false {
    const result = DOMUtil.findAncestorWithClass(
      input, this.config.inputPlaceholderClassName, false
    )
    if (result !== false) {
      return <HTMLElement>result
    }
    return false
  }

  private eventHandlerFocus = event => {
    if (this.config.activateOnFocus === true) {
      const inputPlaceholderElement = this.getInputPlaceholderElement(event.target)
      if (inputPlaceholderElement !== false) {
        this.activate(inputPlaceholderElement, event.target)
      }
    }
  }

  private eventHandlerBlur = event => {
    if (this.config.activateOnFocus === true) {
      const inputPlaceholder = this.getInputPlaceholderElement(event.target)
      if (inputPlaceholder !== false) {
        if (
          this.config.conditionActivate(<HTMLElement>inputPlaceholder, event.target) === true
        ) {
          this.deactivate(inputPlaceholder, event.target)
        }
      }
    }
  }

  private eventHandlerInput = event => {
    if (this.config.activateOnFocus === false) {
      const inputPlaceholder = this.getInputPlaceholderElement(event.target)
      if (inputPlaceholder !== false) {
        if (
          this.config.conditionActivate(<HTMLElement>inputPlaceholder, event.target) === true
        ) {
          this.deactivate(inputPlaceholder, event.target)
        } else {
          this.activate(inputPlaceholder, event.target)
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