export interface IdentifierFn {
  (element: HTMLElement): boolean;
}

export interface DataExtractFunction<T> {
  (child: HTMLElement): T | undefined;
}

export type DOMTraverseResult = HTMLElement | HTMLElement[] | false;

export class DOMTraverse {

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

  public static findAncestor(element: HTMLElement, identifierFn: IdentifierFn, getAll: boolean = true): DOMTraverseResult {
    const results: HTMLElement[] = [];

    if (element === null) {
      return false;
    }

    if (identifierFn(element)) {
      results.push(element);
    }

    let currentEl: HTMLElement | null = element;

    while (currentEl === null || currentEl.nodeName !== 'HTML') {
      currentEl = <HTMLElement>currentEl;

      if (identifierFn(currentEl) === true) {
        results.push(currentEl);
      }

      currentEl = currentEl.parentElement;
    }

    if (results.length > 0) {
      return getAll === true ? results : results[0];
    }

    return false;
  }

  public static findAncestorWithClass(parent: HTMLElement, classNames: string | string[], getAll: boolean = true): DOMTraverseResult {
    let identifierFn: IdentifierFn = element => false;

    if (typeof classNames === 'string') {
      identifierFn = element => element.classList.contains(classNames);
    } else if (Array.isArray(classNames) === true) {
      identifierFn = element => {
        let containsClassName: boolean = false;

        classNames.forEach(className => {
          if (element.classList.contains(className) === true) {
            containsClassName = true;
          }
        });
        return containsClassName;
      };
    }

    return this.findAncestor(parent, identifierFn, getAll);
  }

  public static findAncestorWithID(parent: HTMLElement, ID: string, getAll: boolean = true): DOMTraverseResult {
    const identifierFn: IdentifierFn = element => element.id === ID;

    return this.findAncestor(parent, identifierFn, getAll);
  }

  public static hasAncestor(parent: HTMLElement, options: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>): DOMTraverseResult {
    const identifierFn: IdentifierFn = element => {
      if (Array.isArray(options) === true) {
        return (<HTMLElement[]>options).indexOf(element) !== -1;
      } else if (typeof options[Symbol.iterator] === 'function') {
        return Array.from(<NodeListOf<HTMLElement>>options).indexOf(element) !== -1;
      } else {
        return element === options;
      }
    }

    return this.findAncestor(parent, identifierFn, false);
  }

  // DESCENDANT

  public static findDescendant(element: HTMLElement, identifierFn: IdentifierFn, getAll: boolean = true): DOMTraverseResult {
    const results: HTMLElement[] = [];

    if (identifierFn(element) === true) {
      results.push(element);
    }

    const inspectDescendant: Function = (inspectEl: HTMLElement) => {
      const children: HTMLCollection = inspectEl.children;

      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          if (identifierFn(<HTMLElement>children[i]) === true) {
            results.push(<HTMLElement>children[i]);
            if (getAll === false) {
              break;
            }
          }
          if (children[i].children.length > 0) {
            inspectDescendant(children[i]);
          }
        }
      }
    }

    inspectDescendant(element);

    if (results.length > 0) {
      return getAll === true ? results : results[0];
    }

    return false;
  }

  public static findDescendantWithID(parent: HTMLElement, ID: string, getAll: boolean = true): DOMTraverseResult {
    const identifierFn: IdentifierFn = element => element.id === ID;
    return this.findDescendant(parent, identifierFn, getAll);
  }

  public static findDescendantWithClass(parent: HTMLElement, classNames: string | string[], getAll: boolean = true): DOMTraverseResult {
    let identifierFn: IdentifierFn = element => false;

    if (typeof classNames === 'string') {
      identifierFn = element => element.classList.contains(classNames);
    } else if (Array.isArray(classNames) === true) {
      identifierFn = element => {
        let containsClassName: boolean = false;

        classNames.forEach(className => {
          if (element.classList.contains(className) === true) {
            containsClassName = true;
          }
        });
        return containsClassName;
      };
    }

    return this.findDescendant(parent, identifierFn, getAll);
  }

  public static hasDescendant(element: HTMLElement, options: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>): DOMTraverseResult {
    const identifierFn: IdentifierFn = _element => {
      if (Array.isArray(options) === true) {
        return (<HTMLElement[]>options).indexOf(_element) !== -1;
      } else if (typeof options[Symbol.iterator] === 'function') {
        return Array.from(<NodeListOf<HTMLElement>>options).indexOf(_element) !== -1;
      } else {
        return _element === options;
      }
    }

    return this.findDescendant(element, identifierFn, false);
  }

  // SIBLING

  public static getSiblings(element: HTMLElement, isExclusive:boolean = false): HTMLElement[] | false {
    if (element.parentElement !== null) {
      const siblings: HTMLElement[] = <HTMLElement[]>Array.from(element.parentElement.children);
      if (isExclusive === true) {
        siblings.splice(siblings.indexOf(element), 1);
      }
      return siblings.length > 0 ? siblings : false;
    }
    return false;
  }

  public static findSibling(element: HTMLElement, identifierFn: Function, getAll = true): DOMTraverseResult {
    const siblings: HTMLElement[] | false = this.getSiblings(element);
    if (siblings === false) {
      return false;
    }
    if (siblings.length > 0) {
      const results: HTMLElement[] = [];
      for (let i = 0; i < siblings.length; i++) {
        if (identifierFn(siblings[i]) === true) {
          results.push(siblings[i]);
        }
      }
      if (results.length > 0) {
        return getAll === true ? results : results[0];
      }
    }
    return false;
  }

  public static findSiblingWithClass(element: HTMLElement, className: string, getAll: boolean = true): DOMTraverseResult {
    const identifierFn: IdentifierFn = _element => {
      return _element.classList.contains(className);
    };
    return this.findSibling(element, identifierFn, getAll);
  }

  // Remove

  public static removeElement(element: HTMLElement): void {
    if (element.parentNode !== null) {
      element.parentNode.removeChild(element);
    }
  }

  public static removeChildren(parent: HTMLElement): number {
    let deleteCount: number = 0;

    while (parent.firstChild !== null) {
      parent.removeChild(parent.firstChild);
      deleteCount++;
    }

    return deleteCount;
  }

  public static findNextSibling(element: HTMLElement, identifierFn: IdentifierFn): HTMLElement | false {
    let nextSibling: HTMLElement | null = element;
    while (nextSibling !== null) {
      if (
        element !== null
        && identifierFn(element) === true
      ) {
        return element;
      } else {
        nextSibling = <HTMLElement | null>element.nextElementSibling;
      }
    }
    return false;
  }

  public static removeChild(element: HTMLElement, identifierFn: IdentifierFn): number {
    let deleteCount: number = 0;

    const inspect: Function = (parent: HTMLElement) => {
      const children: HTMLCollection = parent.children;
      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          if (identifierFn(<HTMLElement>children[i]) === true) {
            parent.removeChild(children[i]);
            deleteCount++;
          } else if (children[i].children.length > 0) {
            inspect(children[i]);
          }
        }
      }
    }; // inspect

    inspect(element);
    return deleteCount;
  }

  public static getChildren(parent: HTMLElement, identifierFn?: IdentifierFn): HTMLElement[] {
    const children = <HTMLElement[]>Array.from(parent.children);

    if (typeof identifierFn === 'undefined') {
      return children;
    }

    return children.filter(element => identifierFn(<HTMLElement>element));
  }

  // @helper

  public static isAnHTMLElement(element: HTMLElement | Element): boolean {
    return (
      typeof element === 'object'
      && typeof element.nodeType === 'number'
      && element.nodeType === 1
    );
  }

  public static getNthChild(n: number | 'last', parent: HTMLElement, identifierFn?: IdentifierFn): HTMLElement | false {
    if (typeof identifierFn === 'undefined') {
      identifierFn = element => true;
    }

    const children: HTMLElement[] = <HTMLElement[]>Array.from(parent.children);
    const selectedChildren: HTMLElement[] = children.filter(identifierFn);

    let result: HTMLElement;
    if (n === 'last') {
      result = selectedChildren[selectedChildren.length - 1];
    } else {
      result = selectedChildren[n];
    }

    return (typeof result === 'object') ? result : false;
  }

  public static mapDataFromChildren<T>(parent: HTMLElement, dataExtractFn: DataExtractFunction<T>, identifierFn?: IdentifierFn): T[] {
    if (typeof identifierFn === 'undefined') {
      identifierFn = element => true;
    }

    const children: HTMLElement[] = <HTMLElement[]>Array.from(parent.children);
    const selectedChildren: HTMLElement[] = children.filter(identifierFn);

    if (selectedChildren.length === 0) {
      return [];
    }

    if (selectedChildren.length === 1) {
      const datum: T = <T>dataExtractFn(selectedChildren[0]);
      return (typeof datum !== 'undefined') ? [datum] : [];
    }

    const results: T[] = [];
    selectedChildren.forEach(child => {
      const datum: T = <T>dataExtractFn(child);

      if (typeof datum !== 'undefined') {
        results.push(datum);
      }
    });

    return results;
  }
}
