import {
  DOMUtil,
} from '../../rocket/rocket'

export interface InputPlaceholderConfig {
  activeClassName?: string,
  inputPlaceholderClassName?: string,
}

export const INPUTPLACEHOLDER_CONFIG = {
  activeClassName: '__active',
  inputPlaceholderClassName: 'inputPlaceholder',
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

  }

  private eventHandlerFocus = event => {
    const result = DOMUtil.findAncestorWithClass(
      event.target,
      this.config.inputPlaceholderClassName,
      false
    )
    if (
      result !== false &&
      event.target.value !== ''
    ) {
      (<HTMLElement>result).classList.add(this.config.activeClassName)
    }
  }

  private eventHandlerBlur = event => {
    const result = DOMUtil.findAncestorWithClass(
      event.target,
      this.config.inputPlaceholderClassName,
      false
    )
    if (
      result !== false &&
      event.target.value === ''
    ) {
      (<HTMLElement>result).classList.remove(this.config.activeClassName)
    }
  }

  private eventHandlerInput = event => {
    const result = DOMUtil.findAncestorWithClass(
      event.target,
      this.config.inputPlaceholderClassName,
      false
    )
    if (
      result !== false
    ) {
      if (event.target.value === '') {
        (<HTMLElement>result).classList.remove(this.config.activeClassName)
      } else {
        (<HTMLElement>result).classList.add(this.config.activeClassName)
      }
    }
  }

  private listen() {
    this.inputElements.forEach(input => {
      input.addEventListener('focus', this.eventHandlerFocus)
    })
    this.inputElements.forEach(input => {
      input.addEventListener('input', this.eventHandlerInput)
    })
    this.inputElements.forEach(input => {
      input.addEventListener('blur', this.eventHandlerBlur)
    })
  }
}

new InputPlaceholderManager({
  activeClassName: '__focus',
  inputPlaceholderClassName: 'inputPlaceholder'
})