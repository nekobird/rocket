import {
  StringUtil,
} from '../../rocket'

import {
  PolyController,
} from './polyController';

import {
  Config,
} from './config'

export interface ElementEntries {
  [name: string]: ElementEntry
}

export interface ElementEntry {
  elements: HTMLElement[],
  selector: string,
}

export class ElementManager {

  private controller: PolyController
  public elementEntries: ElementEntries

  constructor(controller: PolyController) {
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
    const addElement = (name: string, selector: string) => {
      if (typeof this.elementEntries[name] === 'object') {
        this.elementEntries[name].selector = selector
      } else {
        this.addElement(name, selector)
      }
    }
    Object.keys(config).forEach(name => {
      if (name.match(/^selector/g) !== null) {
        let elementName: string = StringUtil.lowerCaseFirstLetter(
          name.replace(/^selector/g, '')
        )
        addElement(elementName, config[name])
      }
    })
    Object.keys(config).forEach(name => {
      if (name.match(/^classNameJs/g) !== null) {
        let elementName: string = StringUtil.lowerCaseFirstLetter(
          name.replace(/^className/g, '')
        )
        addElement(elementName, `.${config[name]}`)
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

  public addElement(name: string, selector: string): ElementManager {
    if (typeof this.elementEntries[name] !== 'object') {
      this.elementEntries[name] = {
        elements: undefined,
        selector: selector,
      }
    }
    return this
  }

  public removeElement(name: string): ElementManager {
    if (typeof this.elementEntries[name] === 'object') {
      delete this.elementEntries[name]
    }
    return this
  }

  public getElementEntry(name: string): ElementEntry | false {
    if (typeof this.elementEntries[name] === 'object') {
      return this.elementEntries[name]
    }
    return false
  }

  public getElements(name: string): HTMLElement[] | false {
    if (typeof this.elementEntries[name] === 'object') {
      return this.elementEntries[name].elements
    }
    return false
  }

}