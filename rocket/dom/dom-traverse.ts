import {
  DOMUtil,
  Elements,
} from '../rocket';

export interface DOMTraverseInspectFunction {
  (element: Element): true | void;
}

export interface DOMTraverseIdentifyFunction {
  (element: Element): boolean;
}

export interface DOMTraverseExtractFunction<T> {
  (child: Element): T | void;
}

export type DOMTraverseResult = Element | Element[] | null;

export class DOMTraverse {
  public static ascendFrom(
    from: Element,
    inspect: DOMTraverseInspectFunction,
    to: Element = document.documentElement,
  ): void {
    let element: Element | null = from;

    while (
      element !== null
      && element !== to
      && element !== document.documentElement
    ) {
      if (inspect(element) === true) {
        break;
      }

      element = element.parentElement;
    }
  }

  public static descendFrom(
    from: Element,
    inspect: DOMTraverseInspectFunction,
  ): void {
    const descent = (element: Element) => {
      const children = element.children;

      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];

          if (inspect(child) === true) {
            break;
          }

          if (child.children.length > 0) {
            descent(child);
          }
        }
      }
    };

    descent(from);
  }

  public static findAncestor(
    from: Element,
    identifyElement: DOMTraverseIdentifyFunction,
    getAllMatchingAncestors: boolean = false,
  ): DOMTraverseResult {
    const results: Element[] = [];

    if (DOMUtil.isHTMLElement(from) === false) {
      return null;
    }

    if (identifyElement(from) === true) {
      results.push(from);
    }

    let element: Element | null = from;

    while (
      element !== null
      && element !== document.documentElement
    ) {
      if (identifyElement(element) === true) {
        results.push(element);

        if (getAllMatchingAncestors === false) {
          break;
        }
      }

      element = element.parentElement;
    }

    if (results.length > 0) {
      return getAllMatchingAncestors === true ? results : results[0];
    }

    return null;
  }

  public static findDescendant(
    from: Element,
    identifyElement: DOMTraverseIdentifyFunction,
    getAllMatchingDescendants: boolean = false,
  ): DOMTraverseResult {
    const results: Element[] = [];

    if (identifyElement(from) === true) {
      results.push(from);
    }

    const descent = (element: Element) => {
      const children = element.children;

      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];

          if (identifyElement(child) === true) {
            results.push(child);

            if (getAllMatchingDescendants === false) {
              break;
            }
          }

          if (child.children.length > 0) {
            descent(child);
          }
        }
      }
    };

    descent(from);

    if (results.length > 0) {
      return getAllMatchingDescendants === true ? results : results[0];
    }

    return null;
  }

  public static findAncestorWithClass(
    from: Element,
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
    from: Element,
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
    from: Element,
    id: string,
    getAllMatchingAncestors: boolean = false,
  ): DOMTraverseResult {
    const identifyElement = element => element.id === id;

    return this.findAncestor(from, identifyElement, getAllMatchingAncestors);
  }

  public static findDescendantWithId(
    from: Element,
    id: string,
    getAllMatchingDescendants: boolean = false,
  ): DOMTraverseResult {
    const identifyElement = element => element.id === id;

    return this.findDescendant(from, identifyElement, getAllMatchingDescendants);
  }

  public static hasAncestor(
    from: Element,
    options: Element | Elements,
  ): boolean {
    const candidates = DOMUtil.toElementArray(options);

    const identifyElement = element => candidates.indexOf(element) !== -1;

    return this.findAncestor(from, identifyElement, false) !== null;
  }

  public static hasDescendant(
    from: Element,
    options: Element | Elements,
  ): boolean {
    const candidates = DOMUtil.toElementArray(options);

    const identifyElement = element => candidates.indexOf(element) !== -1;

    return this.findDescendant(from, identifyElement, false) !== null;
  }

  // @siblings

  public static getSiblings(
    element: Element,
    isExclusive: boolean = false,
  ): Element[] | null {
    if (element.parentElement !== null) {
      const siblings = [...element.parentElement.children];

      if (isExclusive === true) {
        siblings.splice(siblings.indexOf(element), 1);
      }

      return siblings.length > 0 ? siblings : null;
    }

    return null;
  }

  public static findSibling(
    element: Element,
    identifyElement: DOMTraverseIdentifyFunction,
    getAllMatchingSiblings = true,
  ): DOMTraverseResult {
    const siblings = this.getSiblings(element);

    if (siblings === null) {
      return null;
    }

    if (siblings.length > 0) {
      const results: Element[] = [];

      for (let i = 0; i < siblings.length; i++) {
        const sibling = siblings[i];

        if (identifyElement(sibling) === true) {
          results.push(sibling);

          if (getAllMatchingSiblings === false) {
            break;
          }
        }
      }

      if (results.length > 0) {
        return getAllMatchingSiblings === true ? results : results[0];
      }
    }

    return null;
  }

  public static findNextSibling(
    element: Element,
    identifyElement: DOMTraverseIdentifyFunction,
  ): Element | null {
    let nextSibling: Element | null = element;

    while (nextSibling !== null) {
      if (
        element !== null
        && identifyElement(element) === true
      ) {
        return element;
      } else {
        nextSibling = element.nextElementSibling;
      }
    }

    return null;
  }

  public static findSiblingWithClass(
    element: Element,
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
    element: Element,
    identifyElement?: DOMTraverseIdentifyFunction,
  ): Element[] {
    const children = [...element.children];

    if (typeof identifyElement === 'undefined') {
      return children;
    }

    return children.filter(element => identifyElement(element));
  }

  public static getNthChild(
    n: number | 'last',
    element: Element,
    identifyElement?: DOMTraverseIdentifyFunction,
  ): Element | null {
    if (typeof identifyElement === 'undefined') {
      identifyElement = element => true;
    }

    const children = [...element.children];

    const selectedChildren = children.filter(identifyElement);

    let result;

    if (n === 'last') {
      result = selectedChildren[selectedChildren.length - 1];
    } else {
      result = selectedChildren[n];
    }

    return typeof result === 'object' ? result : null;
  }

  public static removeChildren(element: Element): number {
    let deleteCount = 0;

    while (element.firstChild !== null) {
      element.removeChild(element.firstChild);

      deleteCount++;
    }

    return deleteCount;
  }

  public static removeChild(
    element: Element,
    identifyElement: DOMTraverseIdentifyFunction,
  ): number {
    let deleteCount = 0;

    const inspect = parent => {
      const children = parent.children;

      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];

          if (identifyElement(child) === true) {
            parent.removeChild(child);

            deleteCount++;
          } else if (child.children.length > 0) {
            inspect(child);
          }
        }
      }
    };

    inspect(element);

    return deleteCount;
  }

  public static mapDataFromChildren<T>(
    element: Element,
    extractFunction: DOMTraverseExtractFunction<T>,
    identifyElement?: DOMTraverseIdentifyFunction,
  ): T[] {
    if (typeof identifyElement === 'undefined') {
      identifyElement = element => true;
    }

    const children = [...element.children];

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
