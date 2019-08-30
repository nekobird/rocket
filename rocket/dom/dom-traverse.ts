import {
  DOMUtil,
  HTMLElements,
} from '../rocket';

export interface DOMTraverseInspectFunction {
  (element: HTMLElement): true | void;
}

export interface DOMTraverseIdentifyElementFunction {
  (element: HTMLElement): boolean;
}

export interface DOMTraverseExtractFunction<T> {
  (child: HTMLElement): T | void;
}

export type DOMTraverseResult = HTMLElement | HTMLElement[] | false;

export class DOMTraverse {
  public static ascendFrom(
    from: HTMLElement,
    inspect: DOMTraverseInspectFunction,
    to: HTMLElement = document.documentElement,
  ): void {
    let currentElement: HTMLElement | null = from;

    while (currentElement !== null && currentElement !== to) {
      currentElement = currentElement as HTMLElement;

      if (currentElement !== null) {
        if (inspect(currentElement) === true) {
          break;
        } else {
          currentElement = currentElement.parentElement;
        }
      }
    }
  }

  public static descendFrom(
    from: HTMLElement,
    inspect: DOMTraverseInspectFunction,
  ): void {
    const descent = (currentElement: HTMLElement) => {
      const children = currentElement.children;

      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          if (inspect(children[i] as HTMLElement) === true) {
            break;
          } else if (children[i].children.length > 0) {
            descent(children[i] as HTMLElement);
          }
        }
      }
    };

    descent(from);
  }

  public static findAncestor(
    from: HTMLElement,
    identifyElement: DOMTraverseIdentifyElementFunction,
    getAllMatchingAncestors: boolean = false,
  ): DOMTraverseResult {
    const results: HTMLElement[] = [];

    if (DOMUtil.isHTMLElement(from) === false) {
      return false;
    }

    if (identifyElement(from) === true) {
      results.push(from);
    }

    let currentElement: HTMLElement | null = from;

    while (
      currentElement !== null
      && currentElement !== document.documentElement
    ) {
      currentElement = currentElement as HTMLElement;

      if (currentElement !== null) {
        if (identifyElement(currentElement) === true) {
          results.push(currentElement);

          if (getAllMatchingAncestors === false) {
            break;
          }
        }

        currentElement = currentElement.parentElement;
      }
    }

    if (results.length > 0) {
      return getAllMatchingAncestors === true ? results : results[0];
    }

    return false;
  }

  public static findDescendant(
    from: HTMLElement,
    identifyElement: DOMTraverseIdentifyElementFunction,
    getAllMatchingDescendants: boolean = false,
  ): DOMTraverseResult {
    const results: HTMLElement[] = [];

    if (identifyElement(from) === true) {
      results.push(from);
    }

    const descent = (currentElement: HTMLElement) => {
      const children = currentElement.children;

      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          if (identifyElement(children[i] as HTMLElement) === true) {
            results.push(children[i] as HTMLElement);

            if (getAllMatchingDescendants === false) {
              break;
            }
          }

          if (children[i].children.length > 0) {
            descent(children[i] as HTMLElement);
          }
        }
      }
    };

    descent(from);

    if (results.length > 0) {
      return getAllMatchingDescendants === true ? results : results[0];
    }

    return false;
  }

  public static findAncestorWithClass(
    from: HTMLElement,
    classNames: string | string[],
    getAllMatchingAncestors: boolean = false,
  ): DOMTraverseResult {
    let identifyElement;

    if (typeof classNames === 'string') {
      identifyElement = element => element.classList.contains(classNames);
    } else if (Array.isArray(classNames) === true) {
      identifyElement = element => {
        for (let i = 0; i < classNames.length; i++) {
          if (element.classList.contains(classNames[i]) === true) {
            return true;
          }
        }

        return false;
      };
    }

    return this.findAncestor(from, identifyElement, getAllMatchingAncestors);
  }

  public static findDescendantWithClass(
    from: HTMLElement,
    classNames: string | string[],
    getAllMatchingDescendants: boolean = false,
  ): DOMTraverseResult {
    let identifyElement;

    if (typeof classNames === 'string') {
      identifyElement = element => element.classList.contains(classNames);
    } else if (Array.isArray(classNames) === true) {
      identifyElement = element => {
        for (let i = 0; i < classNames.length; i++) {
          if (element.classList.contains(classNames[i]) === true) {
            return true;
          }
        }

        return false;
      };
    }

    return this.findDescendant(from, identifyElement, getAllMatchingDescendants);
  }

  public static findAncestorWithId(
    from: HTMLElement,
    id: string,
    getAllMatchingAncestors: boolean = false,
  ): DOMTraverseResult {
    const identifyElement = element => element.id === id;

    return this.findAncestor(from, identifyElement, getAllMatchingAncestors);
  }

  public static findDescendantWithId(
    from: HTMLElement,
    id: string,
    getAllMatchingDescendants: boolean = false,
  ): DOMTraverseResult {
    const identifyElement = element => element.id === id;

    return this.findDescendant(from, identifyElement, getAllMatchingDescendants);
  }

  public static hasAncestor(
    from: HTMLElement,
    options: HTMLElement | HTMLElements,
  ): boolean {
    const candidates = DOMUtil.toHTMLElementArray(options);

    const identifyElement = element => candidates.indexOf(element) !== -1;

    return this.findAncestor(from, identifyElement, false) !== false;
  }

  public static hasDescendant(
    from: HTMLElement,
    options: HTMLElement | HTMLElements,
  ): boolean {
    const candidates = DOMUtil.toHTMLElementArray(options);

    const identifyElement = element => candidates.indexOf(element) !== -1;

    return this.findDescendant(from, identifyElement, false) !== false;
  }

  // @siblings

  public static getSiblings(
    element: HTMLElement,
    isExclusive: boolean = false,
  ): HTMLElement[] | false {
    if (element.parentElement !== null) {
      const siblings = [...element.parentElement.children] as HTMLElement[];

      if (isExclusive === true) {
        siblings.splice(siblings.indexOf(element), 1);
      }

      return siblings.length > 0 ? siblings : false;
    }

    return false;
  }

  public static findSibling(
    element: HTMLElement,
    identifyElement: DOMTraverseIdentifyElementFunction,
    getAllMatchingSiblings = true,
  ): DOMTraverseResult {
    const siblings: HTMLElement[] | false = this.getSiblings(element);

    if (siblings === false) {
      return false;
    }

    if (siblings.length > 0) {
      const results: HTMLElement[] = [];

      for (let i = 0; i < siblings.length; i++) {
        if (identifyElement(siblings[i]) === true) {
          results.push(siblings[i]);
        }
      }

      if (results.length > 0) {
        return getAllMatchingSiblings === true ? results : results[0];
      }
    }

    return false;
  }

  public static findNextSibling(
    element: HTMLElement,
    identifyElement: DOMTraverseIdentifyElementFunction,
  ): HTMLElement | false {
    let nextSibling: HTMLElement | null = element;

    while (nextSibling !== null) {
      if (
        element !== null
        && identifyElement(element) === true
      ) {
        return element;
      } else {
        nextSibling = element.nextElementSibling as HTMLElement | null;
      }
    }

    return false;
  }

  public static findSiblingWithClass(
    element: HTMLElement,
    classNames: string | string[],
    getAllMatchingSiblings: boolean = false,
  ): DOMTraverseResult {
    let identifyElement;

    if (typeof classNames === 'string') {
      identifyElement = sibling => sibling.classList.contains(classNames);
    } else if (Array.isArray(classNames) === true) {
      identifyElement = sibling => {
        for (let i = 0; i < classNames.length; i++) {
          if (sibling.classList.contains(classNames[i]) === true) {
            return true;
          }
        }

        return false;
      };
    }

    return this.findSibling(element, identifyElement, getAllMatchingSiblings);
  }

  public static getChildren(
    element: HTMLElement,
    identifyElement?: DOMTraverseIdentifyElementFunction,
  ): HTMLElement[] {
    const children = [...element.children] as HTMLElement[];

    if (typeof identifyElement === 'undefined') {
      return children;
    }

    return children.filter(element => {
      return identifyElement(element as HTMLElement);
    });
  }

  public static getNthChild(
    n: number | 'last',
    element: HTMLElement,
    identifyElement?: DOMTraverseIdentifyElementFunction,
  ): HTMLElement | false {
    if (typeof identifyElement === 'undefined') {
      identifyElement = element => true;
    }

    const children = [...element.children] as HTMLElement[];

    const selectedChildren = children.filter(identifyElement);

    let result;

    if (n === 'last') {
      result = selectedChildren[selectedChildren.length - 1];
    } else {
      result = selectedChildren[n];
    }

    return typeof result === 'object' ? result : false;
  }

  public static removeChildren(element: HTMLElement): number {
    let deleteCount = 0;

    while (element.firstChild !== null) {
      element.removeChild(element.firstChild);

      deleteCount++;
    }

    return deleteCount;
  }

  public static removeChild(
    element: HTMLElement,
    identifyElement: DOMTraverseIdentifyElementFunction,
  ): number {
    let deleteCount = 0;

    const inspect = parent => {
      const children = parent.children;

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

  public static mapDataFromChildren<T>(
    element: HTMLElement,
    extractFunction: DOMTraverseExtractFunction<T>,
    identifyElement?: DOMTraverseIdentifyElementFunction,
  ): T[] {
    if (typeof identifyElement === 'undefined') {
      identifyElement = element => true;
    }

    const children = [...element.children] as HTMLElement[];

    const selectedChildren = children.filter(identifyElement);

    if (selectedChildren.length === 0) {
      return [];
    }

    if (selectedChildren.length === 1) {
      const datum: T = <T>extractFunction(selectedChildren[0]);

      return typeof datum !== 'undefined' ? [datum] : [];
    }

    const results: T[] = [];

    selectedChildren.forEach(child => {
      const datum: T = <T>extractFunction(child);

      if (typeof datum !== 'undefined') {
        results.push(datum);
      }
    });

    return results;
  }
}
