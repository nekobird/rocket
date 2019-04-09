export class DOMUtil {

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
  static findAncestor(el, identifierFn, isMoreThanOneResults = true) {
    let results = new Array

    if (identifierFn(el)) {
      results.push(el)
    }

    let currentEl = el

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
  static findAncestorWithClass(el, className, isMoreThanOneResults = true) {
    let identifierFn = element => {
      return element.classList.contains(className)
    }

    return this.findAncestor(el, identifierFn, isMoreThanOneResults)
  }

  // Find ancestor with given ID.
  static findAncestorWithID(el, ID, isMoreThanOneResults = true) {
    let identifierFn = element => {
      return element.id === ID ? true : false
    }

    return this.findAncestor(el, identifierFn, isMoreThanOneResults)
  }

  // Find descendant that match the identifierFn.
  static findDescendant(el, identifierFn, isMoreThanOneResults = true) {
    let results = new Array

    if (identifierFn(el)) {
      results.push(el)
    }

    let inspectDescendant = inspectEl => {
      let childrenEls = inspectEl.children
      if (childrenEls.length > 0) {
        for (let child of childrenEls) {
          if (identifierFn(child)) {
            results.push(child)
            if (isMoreThanOneResults === false) {
              break
            }
          }
          if (child.children.length > 0) {
            inspectDescendant(child)
          }
        }
      }
    }

    inspectDescendant(el)

    if (results.length > 0) {
      return isMoreThanOneResults === true ? results : results[0]
    }
    return false
  }

  // Find descendant with ID.
  static findDescendantWithID(el, ID, isMoreThanOneResults = true) {
    let identifierFn = _el => {
      return _el.id === ID
    }
    return this.findDescendant(el, identifierFn, isMoreThanOneResults)
  }

  // Find descendant with given class name.
  static findDescendantWithClass(el, className, isMoreThanOneResults = true) {
    let identifierFn = _el => {
      return _el.classList.contains(className)
    }
    return this.findDescendant(el, identifierFn, isMoreThanOneResults)
  }

  static findSibling(el, identifierFn, isMoreThanOneResults = true) {
    let results = this.getSiblings(el)

    if (results === false) {
      return false
    }

    let siblingEls = results

    if (siblingEls.length > 0) {
      let results = new Array

      siblingEls.forEach(sibling => {
        if (identifierFn(sibling)) {
          results.push(sibling)
        }
      })

      if (results.length > 0) {
        return isMoreThanOneResults === true ? results : results[0]
      }
    }
    return false
  }

  static findSiblingWithClass(el, className, isMoreThanOneResults = true) {
    let identifierFn = _el => {
      return _el.classList.contains(className)
    }
    return this.findSibling(el, identifierFn, isMoreThanOneResults)
  }

  static hasAncestor(el, ancestorEl) {
    let identifierFn = _el => {
      return _el === ancestorEl
    }
    return this.findAncestor(el, identifierFn, false)
  }

  static hasDescendant(el, descendantEl) {
    let identifierFn = _el => {
      return _el === descendantEl
    }
    return this.findDescendant(el, identifierFn, false)
  }

  static getOffset(el) {
    let boundingBox = el.getBoundingClientRect()
    return [
      window.scrollX + boundingBox.left,
      window.scrollY + boundingBox.top
    ]
  }

  static getSiblings(el) {
    let siblingEls = el.parentElement.children
    return siblingEls.length > 0
  }

  static isAnElement(el) {
    return (
      typeof el === 'object' &&
      typeof el.nodeType === 'number' &&
      el.nodeType === 1
    )
  }

  static isElementNodeName(el, name) {
    return (
      typeof el === 'object' &&
      typeof el.nodeName === 'string' &&
      el.nodeName === name
    )
  }

}