export interface Rect {
  height: number;
  width: number;
}

export class RectHelper {

  public static newRect(width: number, height: number): Rect {
    return { width, height };
  }

  public static newFromElement(element: HTMLElement): Rect {
    return this.newRect(element.offsetWidth, element.offsetHeight);
  }

  public static scale(rect: Rect, scale: number, mutate: boolean = false): Rect {
    const width = rect.width * scale;
    const height = rect.height * scale;
    if (mutate === true) {
      rect.width = width;
      rect.height = height;
      return rect;
    }
    return { width, height };
  }

  public static getWidthFromNewHeight(rect: Rect, newHeight: number): number {
    const whr = rect.height === 0 ? rect.width : rect.width / rect.height;
    return newHeight * whr;
  }

  public static getHeightFromNewWidth(rect: Rect, newWidth: number): number {
    const whr = rect.height === 0 ? rect.width : rect.width / rect.height;
    return newWidth / whr;
  }
}
