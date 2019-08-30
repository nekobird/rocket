export type HTMLElements = NodeListOf<HTMLElement> | HTMLCollection | HTMLElement[];

export class DOMUtil {
  public static isHTMLElement(...things): boolean {
    if (things.length === 0) {
      return false;
    }

    const isHTMLElement = thing => {
      return (
        thing !== null
        && typeof thing === 'object'
        && typeof thing.nodeType === 'number'
        && thing.nodeType === 1
        && thing instanceof HTMLElement === true
      )
    }

    for (let i = 0; i < things.length; i++) {
      const thing = things[i];

      if (isHTMLElement(thing) === false) {
        return false;
      }
    };

    return true;
  }

  public static isNodeListOfHTMLElement(...things): boolean {
    if (things.length === 0) {
      return false;
    }

    const isNodeListOfHTMLElement = thing => {
      return (
        typeof thing === 'object'
        && NodeList.prototype.isPrototypeOf(thing) === true
        && [...thing].every(element => DOMUtil.isHTMLElement(element)) === true
      );
    }

    for (let i = 0; i < things.length; i++) {
      const thing = things[i];

      if (isNodeListOfHTMLElement(thing) === false) {
        return false;
      }
    };

    return true;
  }

  public static isHTMLCollection(...things): boolean {
    if (things.length === 0) {
      return false;
    }

    const isHTMLCollection = thing => {
      return (
        typeof thing === 'object'
        && HTMLCollection.prototype.isPrototypeOf(thing) === true
      );
    }

    for (let i = 0; i < things.length; i++) {
      const thing = things[i];

      if (isHTMLCollection(thing) === false) {
        return false;
      }
    };

    return true;
  }

  public static toHTMLElementArray(collection: HTMLElement | HTMLElements): HTMLElement[] {
    if (
      this.isNodeListOfHTMLElement(collection) === true
      || this.isHTMLCollection(collection) === true
    ) {
      const elements = collection as NodeListOf<HTMLElement> | HTMLCollection;

      return [...elements] as HTMLElement[];
    } else if (
      this.isHTMLElement(collection) === true
    ) {
      const element = collection as HTMLElement;

      return [element];
    } else if (
      Array.isArray(collection) === true
      && this.isHTMLElement(...collection as unknown[]) === true
    ) {
      return collection as HTMLElement[];
    }

    return [];
  }

  public static prependChild(parent: HTMLElement, child: HTMLElement): void {
    if (parent.childElementCount > 0) {
      parent.insertBefore(child, parent.childNodes[0]);
    } else {
      parent.appendChild(child);
    }
  }
}
