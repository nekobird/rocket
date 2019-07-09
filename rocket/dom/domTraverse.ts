export interface DOMTraverseInspectFunction {
  (element: HTMLElement): void | false;
}

export interface DOMTraverseIdentifyElementFunction {
  (element: HTMLElement): boolean;
}

export interface DOMTraverseExtractFunction<T> {
  (child: HTMLElement): T | undefined;
}

export type DOMTraverseResult = HTMLElement | HTMLElement[] | false;

export class DOMTraverse {

  public static ascendFrom(element: HTMLElement, inspect: DOMTraverseInspectFunction): void {
    let currentEl: HTMLElement | null = element;
    while (currentEl !== null && currentEl.nodeName !== 'HTML') {
      currentEl = currentEl as HTMLElement;
      if (currentEl !== null) {
        if (inspect(currentEl) !== false) break;
        currentEl = currentEl.parentElement;
      }
    }
  }

  public static descendFrom(element: HTMLElement, inspect: DOMTraverseInspectFunction): void {
    const descent: Function = (currentElement: HTMLElement) => {
      const children = currentElement.children;
      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          if (inspect(children[i] as HTMLElement) === false) break;
          if (children[i].children.length > 0) descent(children[i]);
        }
      }
    };
    descent(element);
  }

  // @ancestor

  // Find ancestor element that match identifyElement.
  //
  // identifyElement
  //   a user defined function that returns true or false.
  //
  // getAll:
  //   true : Returns an array of matching ancestor(s).
  //   false: Only return the first matching one.
  //
  // Returns false if no matching ancestor is found.
  public static findAncestor(
    element: HTMLElement,
    identifyElement: DOMTraverseIdentifyElementFunction,
    getAll: boolean = false
  ): DOMTraverseResult {

    const results: HTMLElement[] = [];

    if (element === null) return false;

    if (identifyElement(element)) results.push(element);

    let currentEl: HTMLElement | null = element;
    if (element === null) return false;

    while (currentEl !== null && currentEl.nodeName !== 'HTML') {
      currentEl = currentEl as HTMLElement;
      if (currentEl !== null) {
        if (identifyElement(currentEl) === true) results.push(currentEl);
        currentEl = currentEl.parentElement;
      }
    }

    if (results.length > 0)
      return getAll === true ? results : results[0];

    return false;
  }

  public static findAncestorWithClass(
    parent: HTMLElement,
    classNames: string | string[],
    getAll: boolean = false
  ): DOMTraverseResult {

    let identifyElement: DOMTraverseIdentifyElementFunction = element => false;

    if (typeof classNames === 'string') {
      identifyElement = element => element.classList.contains(classNames);
    } else if (Array.isArray(classNames) === true) {
      identifyElement = element => {
        let containsClassName: boolean = false;
        classNames.forEach(className => {
          if (element.classList.contains(className) === true) containsClassName = true;
        });
        return containsClassName;
      };
    }

    return this.findAncestor(parent, identifyElement, getAll);
  }

  public static findAncestorWithID(
    parent: HTMLElement,
    ID: string,
    getAll: boolean = false
  ): DOMTraverseResult {
    const identifyElement: DOMTraverseIdentifyElementFunction = element => element.id === ID;
    return this.findAncestor(parent, identifyElement, getAll);
  }

  public static hasAncestor(parent: HTMLElement, options: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>): DOMTraverseResult {
    const identifyElement = element => {
      if (Array.isArray(options) === true) {
        return (options as HTMLElement[]).indexOf(element) !== -1;
      } else if (typeof options[Symbol.iterator] === 'function') {
        return Array.from(options as NodeListOf<HTMLElement>).indexOf(element) !== -1;
      } else {
        return element === options;
      }
    }

    return this.findAncestor(parent, identifyElement, false);
  }

  // @descendant

  public static findDescendant(
    element: HTMLElement,
    identifyElement: DOMTraverseIdentifyElementFunction,
    getAll: boolean = false
  ): DOMTraverseResult {

    const results: HTMLElement[] = [];

    if (identifyElement(element) === true) results.push(element);

    const descent: Function = (currentElement: HTMLElement) => {
      const children = currentElement.children;
      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          if (identifyElement(children[i] as HTMLElement) === true) {
            results.push(children[i] as HTMLElement);
            if (getAll === false) break;
          }
          if (children[i].children.length > 0) descent(children[i]);
        }
      }
    };
    descent(element);

    if (results.length > 0)
      return getAll === true ? results : results[0];

    return false;
  }

  public static findDescendantWithID(
    parent: HTMLElement,
    ID: string,
    getAll: boolean = false
  ): DOMTraverseResult {
    const identifyElement = element => element.id === ID;
    return this.findDescendant(parent, identifyElement, getAll);
  }

  public static findDescendantWithClass(
    parent: HTMLElement,
    classNames: string | string[],
    getAll: boolean = false
  ): DOMTraverseResult {
    let identifyElement = element => false;

    if (typeof classNames === 'string') {
      identifyElement = element => element.classList.contains(classNames);
    } else if (Array.isArray(classNames) === true) {
      identifyElement = element => {
        let containsClassName: boolean = false;
        classNames.forEach(className => {
          if (element.classList.contains(className) === true)
            containsClassName = true;
        });
        return containsClassName;
      };
    }

    return this.findDescendant(parent, identifyElement, getAll);
  }

  public static hasDescendant(
    parent: HTMLElement,
    options: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>
  ): DOMTraverseResult {
    const identifyElement: DOMTraverseIdentifyElementFunction = element => {
      if (Array.isArray(options) === true) {
        return (options as HTMLElement[]).indexOf(element) !== -1;
      } else if (typeof options[Symbol.iterator] === 'function') {
        return Array.from(options as NodeListOf<HTMLElement>).indexOf(element) !== -1;
      } else {
        return element === options;
      }
    }
    return this.findDescendant(parent, identifyElement, false);
  }

  // @siblings

  public static getSiblings(
    element: HTMLElement,
    isExclusive: boolean = false
  ): HTMLElement[] | false {
    if (element.parentElement !== null) {
      const siblings = Array.from(element.parentElement.children) as HTMLElement[];
      if (isExclusive === true)
        siblings.splice(siblings.indexOf(element), 1);
      return siblings.length > 0 ? siblings : false;
    }
    return false;
  }

  public static findSibling(
    element: HTMLElement,
    identifyElement: DOMTraverseIdentifyElementFunction,
    getAll = true
  ): DOMTraverseResult {
    const siblings: HTMLElement[] | false = this.getSiblings(element);

    if (siblings === false) return false;

    if (siblings.length > 0) {
      const results: HTMLElement[] = [];
      for (let i = 0; i < siblings.length; i++)
        if (identifyElement(siblings[i]) === true)
          results.push(siblings[i]);
      if (results.length > 0)
        return getAll === true ? results : results[0];
    }
    return false;
  }

  public static findSiblingWithClass(
    element: HTMLElement,
    classNames: string | string[],
    getAll: boolean = false
  ): DOMTraverseResult {
    let identifyElement: DOMTraverseIdentifyElementFunction = sibling => false;
    if (typeof classNames === 'string') {
      identifyElement = sibling => sibling.classList.contains(classNames);
    } else if (Array.isArray(classNames) === true) {
      identifyElement = sibling => {
        let containsClassName: boolean = false;
        classNames.forEach(className => {
          if (sibling.classList.contains(className) === true)
            containsClassName = true;
        });
        return containsClassName;
      };
    }
    return this.findSibling(element, identifyElement, getAll);
  }

  public static removeChildren(parent: HTMLElement): number {
    let deleteCount: number = 0;

    while (parent.firstChild !== null) {
      parent.removeChild(parent.firstChild);
      deleteCount++;
    }

    return deleteCount;
  }

  public static findNextSibling(
    element: HTMLElement,
    identifyElement: DOMTraverseIdentifyElementFunction
  ): HTMLElement | false {
    let nextSibling: HTMLElement | null = element;
    while (nextSibling !== null) {
      if (element !== null && identifyElement(element) === true) {
        return element;
      } else {
        nextSibling = element.nextElementSibling as HTMLElement | null;
      }
    }
    return false;
  }

  public static removeChild(
    element: HTMLElement,
    identifyElement: DOMTraverseIdentifyElementFunction
  ): number {
    let deleteCount: number = 0;
    const inspect: Function = (parent: HTMLElement) => {
      const children: HTMLCollection = parent.children;
      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          if (identifyElement(children[i] as HTMLElement) === true) {
            parent.removeChild(children[i]);
            deleteCount++;
          } else if (children[i].children.length > 0) {
            inspect(children[i]);
          }
        }
      }
    };
    inspect(element);
    return deleteCount;
  }

  public static getChildren(
    parent: HTMLElement,
    identifyElement?: DOMTraverseIdentifyElementFunction
  ): HTMLElement[] {
    const children = Array.from(parent.children) as HTMLElement[];
    if (typeof identifyElement === 'undefined') return children;
    return children.filter(element => identifyElement(element as HTMLElement));
  }

  public static getNthChild(
    n: number | 'last',
    parent: HTMLElement,
    identifyElement?: DOMTraverseIdentifyElementFunction
  ): HTMLElement | false {
    if (typeof identifyElement === 'undefined') identifyElement = element => true;

    const children = Array.from(parent.children) as HTMLElement[];
    const selectedChildren: HTMLElement[] = children.filter(identifyElement);

    let result: HTMLElement;
    if (n === 'last') {
      result = selectedChildren[selectedChildren.length - 1];
    } else {
      result = selectedChildren[n];
    }

    return (typeof result === 'object') ? result : false;
  }

  public static mapDataFromChildren<T>(
    parent: HTMLElement,
    extract: DOMTraverseExtractFunction<T>,
    identifyElement?: DOMTraverseIdentifyElementFunction
  ): T[] {
    if (typeof identifyElement === 'undefined') identifyElement = element => true;

    const children = Array.from(parent.children) as HTMLElement[];
    const selectedChildren: HTMLElement[] = children.filter(identifyElement);

    if (selectedChildren.length === 0) return [];

    if (selectedChildren.length === 1) {
      const datum: T = <T>extract(selectedChildren[0]);
      return (typeof datum !== 'undefined') ? [datum] : [];
    }

    const results: T[] = [];
    selectedChildren.forEach(child => {
      const datum: T = <T>extract(child);
      if (typeof datum !== 'undefined') results.push(datum);
    });

    return results;
  }
}
