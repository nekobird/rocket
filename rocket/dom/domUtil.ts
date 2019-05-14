import {
  Point,
  PointHelper,
  DOMHelper,
} from '../rocket'

export interface DOMUtilIdentifierFn {
  (element: HTMLElement): boolean
}

export type DOMUtilResult = HTMLElement | HTMLElement[] | false

export class DOMUtil {

  // ANCESTOR

  // Find ancestor element that match identifierFn.
  //
  // identifierFn
  //   a user defined function that returns true or false.
  //
  // getAll:
  //   true : Returns an array of matching ancestor(s).
  //   false: Only return the first matching one.
  //
  // Returns false if no matching ancestor is found.

  public static findAncestor(element: HTMLElement, identifierFn: DOMUtilIdentifierFn, getAll: boolean = true): DOMUtilResult {
    const results: HTMLElement[] = []

    if (element === null) {
      return false
    }

    if (identifierFn(element)) {
      results.push(element)
    }

    let currentEl: HTMLElement | null = element

    while (currentEl === null || currentEl.nodeName !== 'HTML') {
      currentEl = <HTMLElement>currentEl
      if (identifierFn(currentEl) === true) {
        results.push(currentEl)
      }
      currentEl = currentEl.parentElement
    }

    if (results.length > 0) {
      return getAll === true ? results : results[0]
    }

    return false
  }

  public static findAncestorWithClass(element: HTMLElement, classNames: string | string[], getAll: boolean = true): DOMUtilResult {
    let identifierFn: DOMUtilIdentifierFn

    if (typeof classNames === 'string') {    
      identifierFn = _element => _element.classList.contains(classNames)
    } else if (Array.isArray(classNames) === true) {
      identifierFn = _element => {
        let containsClassName: boolean = false

        classNames.forEach(className => {
          if (_element.classList.contains(className) === true) {
            containsClassName = true
          }
        })

        return containsClassName
      }
    }

    return this.findAncestor(element, identifierFn, getAll)
  }

  public static findAncestorWithID(element: HTMLElement, ID: string, getAll: boolean = true): DOMUtilResult {
    const identifierFn: DOMUtilIdentifierFn = _element => _element.id === ID
    return this.findAncestor(element, identifierFn, getAll)
  }

  public static hasAncestor(element: HTMLElement, options: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>): DOMUtilResult {
    const identifierFn: DOMUtilIdentifierFn = _element => {
      if (Array.isArray(options) === true) {
        return (<HTMLElement[]>options).indexOf(_element) !== -1
      } else if (typeof options[Symbol.iterator] === 'function') {
        return Array.from(<NodeListOf<HTMLElement>>options).indexOf(_element) !== -1
      } else {
        return _element === options
      }
    }

    return this.findAncestor(element, identifierFn, false)
  }

  // DESCENDANT

  public static findDescendant(element: HTMLElement, identifierFn: DOMUtilIdentifierFn, getAll: boolean = true): DOMUtilResult {
    const results: HTMLElement[] = []

    if (identifierFn(element) === true) {
      results.push(element)
    }

    const inspectDescendant: Function = (inspectEl: HTMLElement) => {
      const children: HTMLCollection = inspectEl.children
      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          if (identifierFn(<HTMLElement>children[i]) === true) {
            results.push(<HTMLElement>children[i])
            if (getAll === false) {
              break
            }
          }
          if (children[i].children.length > 0) {
            inspectDescendant(children[i])
          }
        }
      }
    }

    inspectDescendant(element)

    if (results.length > 0) {
      return getAll === true ? results : results[0]
    }

    return false
  }

  public static findDescendantWithID(element: HTMLElement, ID: string, getAll: boolean = true): DOMUtilResult {
    const identifierFn: DOMUtilIdentifierFn = _element => {
      return _element.id === ID
    }

    return this.findDescendant(element, identifierFn, getAll)
  }

  public static findDescendantWithClass(element: HTMLElement, classNames: string | string[], getAll: boolean = true): DOMUtilResult {
    let identifierFn: DOMUtilIdentifierFn

    if (typeof classNames === 'string') {    
      identifierFn = _element => {
        return _element.classList.contains(classNames)
      }
    } else if (Array.isArray(classNames) === true) {
      identifierFn = _element => {
        let containsClassName: boolean = false
        classNames.forEach(className => {
          if (_element.classList.contains(className) === true) {
            containsClassName = true
          }
        })
        return containsClassName
      }
    }

    return this.findDescendant(element, identifierFn, getAll)
  }

  public static hasDescendant(element: HTMLElement, options: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>): DOMUtilResult {
    const identifierFn: DOMUtilIdentifierFn = _element => {
      if (Array.isArray(options) === true) {
        return (<HTMLElement[]>options).indexOf(_element) !== -1
      } else if (typeof options[Symbol.iterator] === 'function') {
        return Array.from(<NodeListOf<HTMLElement>>options).indexOf(_element) !== -1
      } else {
        return _element === options
      }
    }
    return this.findDescendant(element, identifierFn, false)
  }

  // SIBLING

  public static getSiblings(element: HTMLElement, isExclusive:boolean = false): HTMLElement[] | false {
    if (element.parentElement !== null) {
      const siblings: HTMLElement[] = <HTMLElement[]>Array.from(element.parentElement.children)
      if (isExclusive === true) {
        siblings.splice(siblings.indexOf(element), 1)
      }
      return siblings.length > 0 ? siblings : false
    }
    return false
  }

  public static findSibling(element: HTMLElement, identifierFn: Function, getAll = true): DOMUtilResult {
    const siblings: HTMLElement[] | false = this.getSiblings(element)
    if (siblings === false) {
      return false
    }
    if (siblings.length > 0) {
      const results: HTMLElement[] = []
      for (let i = 0; i < siblings.length; i++) {
        if (identifierFn(siblings[i]) === true) {
          results.push(siblings[i])
        }
      }
      if (results.length > 0) {
        return getAll === true ? results : results[0]
      }
    }
    return false
  }

  public static findSiblingWithClass(element: HTMLElement, className: string, getAll: boolean = true): DOMUtilResult {
    const identifierFn: DOMUtilIdentifierFn = _element => {
      return _element.classList.contains(className)
    }
    return this.findSibling(element, identifierFn, getAll)
  }

  // Remove

  public static removeElement(element: HTMLElement): void {
    element.parentNode.removeChild(element)
  }

  public static removeChildren(parent: HTMLElement): number {
    let deleteCount: number = 0

    while (parent.firstChild !== null) {
      parent.removeChild(parent.firstChild)
      deleteCount++
    }
    return deleteCount
  }

  public static removeChild(element: HTMLElement, identifierFn: DOMUtilIdentifierFn): number {
    let deleteCount: number = 0

    const inspect: Function = (parent: HTMLElement) => {
      const children: HTMLCollection = parent.children
      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          if (identifierFn(<HTMLElement>children[i]) === true) {
            parent.removeChild(children[i])
            deleteCount++
          } else if (children[i].children.length > 0) {
            inspect(children[i])
          }
        }
      }
    } // inspect

    inspect(element)
    return deleteCount
  }

  public static getChildren(parent: HTMLElement, identifierFn?: DOMUtilIdentifierFn): HTMLElement[] {
    if (typeof identifierFn === 'undefined') {
      return <HTMLElement[]>Array.from(parent.children)
    }

    return <HTMLElement[]>Array.from(parent.children).filter(identifierFn)
  }

  // Helper

  public static isAnHTMLElement(element: HTMLElement): boolean {
    return (
      typeof element === 'object' &&
      typeof element.nodeType === 'number' &&
      element.nodeType === 1
    )
  }

  // Element & Point

  // Point is relative to viewport. (clientX, clientY)
  public static pointIsInElement({x, y}: Point, element: HTMLElement): boolean {
    return document.elementsFromPoint(x, y).indexOf(element) !== -1
  }

  public static findElementFromPoint({x, y}: Point, identifyFn?: DOMUtilIdentifierFn, getAll: boolean = true): HTMLElement | HTMLElement[] | false {
    const elements = document.elementsFromPoint(x, y)
    if (elements.length === 0) {
      return false
    }

    let results: HTMLElement[] = []
    elements.forEach(element => {
      if (identifyFn(<HTMLElement>element) === true) {
        results.push(<HTMLElement>element)
      }
    })

    if (results.length === 0) {
      return false
    } else if (results.length === 1) {
      return results[0]
    }

    if (getAll === true) {
      return results
    } else {
      return results[0]
    }
  }

  // Order
  public static getClosestChildFromPoint(parent: HTMLElement, point: Point, identifyFn?: DOMUtilIdentifierFn, fromCenter: boolean = false): HTMLElement | false {
    if (typeof identifyFn === 'undefined') {
      identifyFn = element => true
    }

    const selectedItems: HTMLElement[] = <HTMLElement[]>Array.from(parent.children).filter(identifyFn)
    if (selectedItems.length === 0)  {
      return false
    }

    const distances: number[] = selectedItems.map(item => {
      return DOMHelper.getDistanceFromPoint(item, point, fromCenter)
    })

    const closesDistanceIndex: number = distances.indexOf(Math.min(...distances))

    return selectedItems[closesDistanceIndex]
  }

  public static getNthChild(n: number | 'last', parent: HTMLElement, identifierFn?: DOMUtilIdentifierFn): HTMLElement | false {
    if (typeof identifierFn === 'undefined') {
      identifierFn = element => true
    }

    const selectedItems: HTMLElement[] = <HTMLElement[]>Array.from(parent.children).filter(identifierFn)

    let result: HTMLElement
    if (n === 'last') {
      result = selectedItems[selectedItems.length - 1]
    } else {
      result = selectedItems[n]
    }

    return (typeof result === 'object') ? result : false
  }
}