export type ElementInput = HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>

export interface ElementMapEntry {
  name: string,
  selector: string,
  elements: Elements,
}

export interface Elements {
  [name: string]: ElementInput
}
export class HTMLControllerElementManager {

  private HTMLController: HTMLController

  private elementMap: ElementMapEntry[]

  constructor(controller: HTMLController) {
    this.elementMap = []
    this.HTMLController = controller
  }

  public initialize() {

  }

  public updateElements() {
    this.elements.forEach(element)
  }

}