namespace HTMLControllerElementManager {

  export interface ElementManager {

  }

}

namespace HTMLControllerElementManager {
  export type Elements = string
}


namespace HTMLController {

  export class ElementManager {

    private HTMLController: HTMLController

    private elementsMap
    private elements

    constructor(controller: HTMLController) {
      this.HTMLController = controller
    }

    public initialize() {

    }

    public updateElements() {
      this.elements.forEach(element)
    }

  }

}