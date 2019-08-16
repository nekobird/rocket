import {
  DOMUtil,
} from '../../rocket'

export interface ScrollToData {
  targetX?: number,
  targetY?: number
}

export interface ScrollToFunction {
  (parent: HTMLElement | Window, data: ScrollToData): Promise<void>
}

export interface ScrollHelperConfig {
  parentSelector?: string,
  parentElement?: HTMLElement | Window,

  scrollTo?: ScrollToFunction
}

export const SCROLLHELPER_DEFAULT_CONFIG = {
  parentSelector: undefined, 
  parentElement: document.documentElement,
}

export class ScrollHelper {
  public config: ScrollHelperConfig

  public isScrolling: boolean = false

  constructor(config?) {
    this.config = Object.assign({}, SCROLLHELPER_DEFAULT_CONFIG)

    if (typeof config === 'object') {
      this.setConfig(config)
    }

    this.updateElement()
  }

  public setConfig(config: ScrollHelperConfig): this {
    Object.assign(this.config, config)
    return this
  }

  public updateElement(): this {
    if (typeof this.config.parentSelector === 'string') {
      const parentElement = document.querySelector(this.config.parentSelector)
      if (parentElement !== null) {
        this.config.parentElement = <HTMLElement>parentElement
      }
    }
    return this
  }

  public scrollYToCenterOf(element: HTMLElement, fn: Function) {
  }

}