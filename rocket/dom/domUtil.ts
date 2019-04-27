export interface DOMUtilIdentifierFn {
  (element: HTMLElement): boolean
}

export type DOMUtilResult = HTMLElement | HTMLElement[] | boolean

export class DOMUtil {

  // ANCESTOR
  // Find ancestor element that match identifierFn.
  //
  // identifierFn
  //   a user defined function that returns true or false.
  //
  // isMoreThanOneResults:
  //   true : Returns an array of matching ancestor(s).
  //   false: Only return the first matching one.
  //
  // Returns false if no matching ancestor is found.

  public static findAncestor(
    element: HTMLElement, identifierFn: DOMUtilIdentifierFn, isMoreThanOneResults: boolean = true
  ): DOMUtilResult {
    const results: HTMLElement[] = []

    if (element === null) { return false }

    if (identifierFn(element)) {
      results.push(element)
    }

    let currentEl: HTMLElement | null = element

    while (currentEl === null || currentEl.nodeName !== 'HTML') {
      currentEl = <HTMLElement>currentEl
      if (identifierFn(currentEl)) {
        results.push(currentEl)
      }
      currentEl = currentEl.parentElement
    }

    if (results.length > 0) {
      return isMoreThanOneResults === true ? results : results[0]
    }
    return false
  }

  // Find ancestor with given class name.
  public static findAncestorWithClass(
    element: HTMLElement, className: string, isMoreThanOneResults: boolean = true
  ): DOMUtilResult {
    const identifierFn: DOMUtilIdentifierFn = _element => {
      return _element.classList.contains(className)
    }
    return this.findAncestor(element, identifierFn, isMoreThanOneResults)
  }

  // Find ancestor with given ID.
  public static findAncestorWithID(
    element: HTMLElement, ID: string, isMoreThanOneResults: boolean = true
  ): DOMUtilResult {
    const identifierFn: DOMUtilIdentifierFn = _element => {
      return _element.id === ID
    }
    return this.findAncestor(element, identifierFn, isMoreThanOneResults)
  }

  public static hasAncestor(
    element: HTMLElement, ancestors: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>
  ): DOMUtilResult {
    const identifierFn: DOMUtilIdentifierFn = _element => {
      if (typeof ancestors[Symbol.iterator] === 'function') {
        return [...<NodeListOf<HTMLElement>>ancestors].indexOf(_element) !== -1
      } else {
        return _element === ancestors
      }
    }
    return this.findAncestor(element, identifierFn, false)
  }

  // DESCENDANT

  // Find descendant that match the identifierFn.
  public static findDescendant(
    element: HTMLElement, identifierFn: DOMUtilIdentifierFn, isMoreThanOneResults: boolean = true
  ): DOMUtilResult {
    const results: HTMLElement[] = []
    if (identifierFn(element)) {
      results.push(element)
    }
    const inspectDescendant: Function = (inspectEl: HTMLElement) => {
      const children: HTMLCollection = inspectEl.children
      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          if (identifierFn(<HTMLElement>children[i])) {
            results.push(<HTMLElement>children[i])
            if (isMoreThanOneResults === false) {
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
      return isMoreThanOneResults === true ? results : results[0]
    }
    return false
  }

  // Find descendant with ID.
  public static findDescendantWithID(
    element: HTMLElement, ID: string, isMoreThanOneResults: boolean = true
  ): DOMUtilResult {
    const identifierFn: DOMUtilIdentifierFn = _element => {
      return _element.id === ID
    }
    return this.findDescendant(element, identifierFn, isMoreThanOneResults)
  }

  // Find descendant with given class name.
  public static findDescendantWithClass(
    element: HTMLElement, className: string, isMoreThanOneResults: boolean = true
  ): DOMUtilResult {
    const identifierFn: DOMUtilIdentifierFn = _element => {
      return _element.classList.contains(className)
    }
    return this.findDescendant(element, identifierFn, isMoreThanOneResults)
  }

  public static hasDescendant(
    element: HTMLElement, descendants: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>
  ): DOMUtilResult {
    const identifierFn: DOMUtilIdentifierFn = _element => {
      if (typeof descendants[Symbol.iterator] === 'function') {
        return [...<NodeListOf<HTMLElement>>descendants].indexOf(_element) !== -1
      } else {
        return _element === descendants
      }
    }
    return this.findDescendant(element, identifierFn, false)
  }

  // SIBLING

  public static getSiblings(element: HTMLElement): HTMLCollection | false {
    if (element.parentElement !== null) {
      const siblings: HTMLCollection = element.parentElement.children
      return siblings.length > 0 ? siblings : false
    }
    return false
  }

  public static findSibling(
    element: HTMLElement, identifierFn: Function, isMoreThanOneResults = true
  ): DOMUtilResult {
    const siblings: HTMLCollection | false = this.getSiblings(element)
    if (siblings === false) {
      return false
    }

    if (siblings.length > 0) {
      const results: HTMLElement[] = []

      for (let i = 0; i < siblings.length; i++) {
        if (identifierFn(siblings[i])) {
          results.push(<HTMLElement>siblings[i])
        }
      }

      if (results.length > 0) {
        return isMoreThanOneResults === true ? results : results[0]
      }
    }
    return false
  }

  public static findSiblingWithClass(
    element: HTMLElement, className: string, isMoreThanOneResults: boolean = true
  ): DOMUtilResult {
    const identifierFn: DOMUtilIdentifierFn = _element => {
      return _element.classList.contains(className)
    }
    return this.findSibling(element, identifierFn, isMoreThanOneResults)
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
          }
          if (children[i].children.length > 0) {
            inspect(children[i])
          }
        }
      }
    } // inspect
    inspect(element)
    return deleteCount
  }

  public static getOffset(element: HTMLElement): [number, number] {
    const boundingBox: DOMRect | ClientRect = element.getBoundingClientRect()
    return [
      window.scrollX + boundingBox.left,
      window.scrollY + boundingBox.top
    ]
  }

  public static isAnElement(element: HTMLElement): boolean {
    return (
      typeof element === 'object' &&
      typeof element.nodeType === 'number' &&
      element.nodeType === 1
    )
  }

  public static isElementNodeName(element: HTMLElement, name: string): boolean {
    return (
      typeof element === 'object' &&
      typeof element.nodeName === 'string' &&
      element.nodeName === name
    )
  }

}