interface IdentifierFn {
  (element: HTMLElement): boolean
}

type DOMUtilResult = HTMLElement | HTMLElement[] | boolean

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
  static findAncestor(element: HTMLElement, identifierFn: IdentifierFn, isMoreThanOneResults: boolean = true): DOMUtilResult {
    let results: HTMLElement[] = []

    if (identifierFn(element)) {
      results.push(element)
    }

    let currentEl: HTMLElement = element

    while (currentEl.nodeName !== 'HTML') {
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
  static findAncestorWithClass(element: HTMLElement, className: string, isMoreThanOneResults: boolean = true): DOMUtilResult {
    let identifierFn: IdentifierFn = _el => {
      return _el.classList.contains(className)
    }
    return this.findAncestor(element, identifierFn, isMoreThanOneResults)
  }

  // Find ancestor with given ID.
  static findAncestorWithID(element: HTMLElement, ID: string, isMoreThanOneResults: boolean = true): DOMUtilResult {
    let identifierFn: IdentifierFn = _el => {
      return _el.id === ID ? true : false
    }

    return this.findAncestor(element, identifierFn, isMoreThanOneResults)
  }

  static hasAncestor(element: HTMLElement, ancestorEl: HTMLElement): DOMUtilResult {
    let identifierFn: IdentifierFn = _el => {
      return _el === ancestorEl
    }
    return this.findAncestor(element, identifierFn, false)
  }

  // DESCENDANT

  // Find descendant that match the identifierFn.
  static findDescendant(element: HTMLElement, identifierFn: IdentifierFn, isMoreThanOneResults: boolean = true): DOMUtilResult {
    let results: HTMLElement[] = []

    if (identifierFn(element)) {
      results.push(element)
    }

    let inspectDescendant: Function = (inspectEl: HTMLElement) => {
      let children: HTMLCollection = inspectEl.children
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
  static findDescendantWithID(element: HTMLElement, ID: string, isMoreThanOneResults: boolean = true): DOMUtilResult {
    let identifierFn: IdentifierFn = _el => {
      return _el.id === ID
    }
    return this.findDescendant(element, identifierFn, isMoreThanOneResults)
  }

  // Find descendant with given class name.
  static findDescendantWithClass(element: HTMLElement, className: string, isMoreThanOneResults: boolean = true): DOMUtilResult {
    let identifierFn: IdentifierFn = _el => {
      return _el.classList.contains(className)
    }
    return this.findDescendant(element, identifierFn, isMoreThanOneResults)
  }

  static hasDescendant(element: HTMLElement, descendantEl: HTMLElement): DOMUtilResult {
    let identifierFn: IdentifierFn = _el => {
      return _el === descendantEl
    }
    return this.findDescendant(element, identifierFn, false)
  }

  // SIBLING

  static getSiblings(element: HTMLElement): HTMLCollection | false {
    let siblings: HTMLCollection = element.parentElement.children
    return siblings.length > 0 ? siblings : false
  }

  static findSibling(element: HTMLElement, identifierFn: Function, isMoreThanOneResults = true): DOMUtilResult {
    let siblings: HTMLCollection | false = this.getSiblings(element)
    if (siblings === false) {
      return false
    }

    if (siblings.length > 0) {
      let results: HTMLElement[] = []

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

  static findSiblingWithClass(element: HTMLElement, className: string, isMoreThanOneResults: boolean = true): DOMUtilResult {
    let identifierFn: IdentifierFn = _element => {
      return _element.classList.contains(className)
    }
    return this.findSibling(element, identifierFn, isMoreThanOneResults)
  }

  static getOffset(element: HTMLElement): number[] {
    let boundingBox: DOMRect | ClientRect = element.getBoundingClientRect()
    return [
      window.scrollX + boundingBox.left,
      window.scrollY + boundingBox.top
    ]
  }

  static isAnElement(element: HTMLElement): boolean {
    return (
      typeof element === 'object' &&
      typeof element.nodeType === 'number' &&
      element.nodeType === 1
    )
  }

  static isElementNodeName(element: HTMLElement, name: string): boolean {
    return (
      typeof element === 'object' &&
      typeof element.nodeName === 'string' &&
      element.nodeName === name
    )
  }

}