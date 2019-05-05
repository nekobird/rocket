import {
  DOMUtil,
} from '../../rocket/rocket'

export interface InputPlaceholderConfig {
  activeClassName?: string,
  inputPlaceholderClassName?: string,

  activateOnFocus?: boolean,

  beforeActivate?: (inputPlaceholder: HTMLElement, input: HTMLInputElement) => Promise<void>,
  afterActivate?: (inputPlaceholder: HTMLElement, input: HTMLInputElement) => void,

  beforeDeactivate?: (inputPlaceholder: HTMLElement, input: HTMLInputElement) => Promise<void>,
  afterDeactivate?: (inputPlaceholder: HTMLElement, input: HTMLInputElement) => void,

  activate?: (inputPlaceholder: HTMLElement, input: HTMLInputElement, activeClassName: string) => Promise<void>,
  deactivate?: (inputPlaceholder: HTMLElement, input: HTMLInputElement, activeClassName: string) => Promise<void>,
}

export const INPUTPLACEHOLDER_CONFIG = {
  activeClassName          : 'input-placeholder--active',
  inputPlaceholderClassName: 'input-placeholder',
  activateOnFocus          : true,

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

  public inputElements: HTMLInputElement[]
  public inputPlaceholderElements: HTMLElement[]

  public config: InputPlaceholderConfig

  constructor(config?: InputPlaceholderConfig) {
    this.config = Object.assign({}, INPUTPLACEHOLDER_CONFIG)

    if (typeof config === 'object') {
      this.setConfig(config)
    }

    this.getElements()
    this.listen()
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
          this.inputElements.push(<HTMLInputElement>input)
        }
      })
    }
  }

  public initialize() {
    this.inputElements.forEach(input => {
      if (input.value !== '') {
        input.classList.add(this.config.activeClassName)
      } else {
        input.classList.remove(this.config.activeClassName)
      }
    })
  }

  private activate(inputPlaceholder: HTMLElement, input: HTMLInputElement) {
    this.config
      .beforeActivate(inputPlaceholder, input)
      .then(() => {
        return this.config.activate(inputPlaceholder, input, this.config.activeClassName)
      })
      .then(() => {
        return this.config.afterActivate(inputPlaceholder, input)
      })
  }

  private deactivate(inputPlaceholder: HTMLElement, input: HTMLInputElement) {
    this.config
      .beforeDeactivate(inputPlaceholder, input)
      .then(() => {
        return this.config.deactivate(inputPlaceholder, input, this.config.activeClassName)
      })
      .then(() => {
        return this.config.afterDeactivate(inputPlaceholder, input)
      })
  }

  private getInputPlaceholderElement(input: HTMLInputElement): HTMLElement | false {
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
      const inputPlaceholderElement = this.getInputPlaceholderElement(event.target)
      if (
        inputPlaceholderElement !== false &&
        event.target.value === ''
      ) {
        this.deactivate(inputPlaceholderElement, event.target)
      }
    }
  }

  private eventHandlerInput = event => {
    if (this.config.activateOnFocus === false) {
      const inputPlaceholderElement = this.getInputPlaceholderElement(event.target)
      if (inputPlaceholderElement !== false) {
        if (event.target.value === '') {
          this.deactivate(inputPlaceholderElement, event.target)
        } else {
          this.activate(inputPlaceholderElement, event.target)
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