export interface ElementSelectorMap {
  [name: string]: string
}

export interface ElementMap {
  [name: string]: ElementMapEntry
}

export interface ElementMapEntry {
  selector: string,
  elements: HTMLElement[],
}

export class ElementManager {

  private elementMap: ElementMap

  constructor() {
    this.elementMap = {}
  }

  public mapElementSelector(map: ElementSelectorMap): ElementManager {
    Object.keys(map).forEach(name => {
      if (typeof this.elementMap[name] === 'object') {
        this.elementMap[name].selector = map[name]
      } else {
        this.addElement(name, map[name])
      }
    })
    return this
  }

  public addElement(name: string, selector: string): ElementManager {
    if (typeof this.elementMap[name] !== 'object') {
      this.elementMap[name] = {
        elements: null,
        selector: selector,
      }
    }
    return this
  }

  public removeElement(name: string): ElementManager {
    if (typeof this.elementMap[name] === 'object') {
      delete this.elementMap[name]
    }
    return this
  }

  public getEntry(name: string): ElementMapEntry | false {
    if (typeof this.elementMap[name] === 'object') {
      return this.elementMap[name]
    }
    return false
  }

  public loadElements(): ElementManager {
    Object.keys(this.elementMap).forEach(name => {
      const entry: ElementMapEntry = this.elementMap[name]
      if (typeof entry.selector === 'string') {
        entry.elements = [...document.querySelectorAll<HTMLElement>(entry.selector)]
      }
    })
    return this
  }

}