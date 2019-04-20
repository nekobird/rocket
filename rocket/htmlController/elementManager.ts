import {
  StringUtil,
} from '../rocket'

import {
  Config,
  HTMLController,
} from './index'

export interface ElementEntries {
  [name: string]: ElementEntry
}

export interface ElementEntry {
  elements: HTMLElement[] | undefined,
  selector: string,
}

export class ElementManager {

  private controller: HTMLController
  public elementEntries: ElementEntries

  constructor(controller: HTMLController) {
    this.controller = controller
    this.elementEntries = {}
  }

  public initialize(): ElementManager {
    this
      .initializeElementEntriesFromConfig()
      .loadElements()
    return this
  }

  public initializeElementEntriesFromConfig(): ElementManager {
    const config: Config = this.controller.config
    const addEntry = (name: string, selector: string) => {
      if (typeof this.elementEntries[name] === 'object') {
        this.elementEntries[name].selector = selector
      } else {
        this.addEntry(name, selector)
      }
    }
    Object.keys(config).forEach(name => {
      if (name.match(/^selector/g) !== null) {
        let elementName: string = StringUtil.lowerCaseFirstLetter(
          name.replace(/^selector/g, '')
        )
        addEntry(elementName, config[name])
      }
    })
    Object.keys(config).forEach(name => {
      if (name.match(/^classNameJs/g) !== null) {
        let elementName: string = StringUtil.lowerCaseFirstLetter(
          name.replace(/^className/g, '')
        )
        addEntry(elementName, `.${config[name]}`)
      }
    })
    return this
  }

  public loadElements(): ElementManager {
    Object.keys(this.elementEntries).forEach(name => {
      const entry: ElementEntry = this.elementEntries[name]
      if (typeof entry.selector === 'string') {
        entry.elements = [...document.querySelectorAll<HTMLElement>(entry.selector)]
      }
    })
    return this
  }

  public addEntry(name: string, selector: string): ElementManager {
    if (typeof this.elementEntries[name] !== 'object') {
      this.elementEntries[name] = {
        elements: undefined,
        selector: selector,
      }
    }
    return this
  }

  public removeEntry(name: string): ElementManager {
    if (typeof this.elementEntries[name] === 'object') {
      delete this.elementEntries[name]
    }
    return this
  }

  public getEntry(name: string): ElementEntry | false {
    if (typeof this.elementEntries[name] === 'object') {
      return this.elementEntries[name]
    }
    return false
  }

  public getElements(name: string): HTMLElement[] | false {
    if (
      typeof this.elementEntries[name] === 'object' &&
      typeof this.elementEntries[name].elements === 'object'
    ) {
      return <HTMLElement[]>this.elementEntries[name].elements
    }
    return false
  }

}