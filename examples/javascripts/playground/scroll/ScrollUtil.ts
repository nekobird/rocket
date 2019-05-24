// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
// https://www.w3schools.com/jsref/event_onscroll.asp
import {
  DOMUtil,
} from '../../rocket'

export class ScrollUtil {

  public static scrollLeftTo(target: HTMLElement | Window, to: number): void {
    if (target === window) {
      window.scrollTo(to, window.scrollY)
    } else {
      (<HTMLElement>target).scrollLeft = to
    }
  }

  public static scrollTopTo(target: HTMLElement | Window, to: number): void {
    if (target === window) {
      window.scrollTo(window.scrollX, to)
    } else {
      (<HTMLElement>target).scrollTop = to
    }
  }

  public static scrollLeftBy(target: HTMLElement | Window, by: number): void {
    if (target === window) {
      window.scrollTo(window.scrollX + by, window.scrollY)
    } else {
      (<HTMLElement>target).scrollLeft = (<HTMLElement>target).scrollLeft + by
    }
  }

  public static scrollTopBy(target: HTMLElement | Window, by: number): void {
    if (target === window) {
      window.scrollTo(window.scrollX, window.scrollY + by)
    } else {
      (<HTMLElement>target).scrollTop = (<HTMLElement>target).scrollTop + by
    }
  }

  public static scrollLeft(target: HTMLElement | Window): number {
    if (target === window) {
      return window.scrollX
    }
    return (<HTMLElement>target).scrollLeft
  }

  public static scrollTop(target: HTMLElement | Window): number {
    if (target === window) {
      return window.scrollY
    }
    return (<HTMLElement>target).scrollTop
  }

  public static scrollTopToCenterOf(parent: HTMLElement | Window, target: HTMLElement): void {
    let offset
    if (parent === window) {
      offset = DOMUtil.getOffset(target)
      ScrollUtil.scrollTopBy(parent, offset.y)
    } else {
      offset = DOMUtil.getOffsetFrom(target, <HTMLElement>parent)
    }
  }
}