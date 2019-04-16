export class polyHtmlControllerElements {

  // HTML ELEMENT
  private els_item: NodeListOf<HTMLElement>

  private els_js_activate: NodeListOf<HTMLElement>
  private els_js_deactivate: NodeListOf<HTMLElement>
  private els_js_toggle: NodeListOf<HTMLElement>

  private els_js_activateAll: NodeListOf<HTMLElement>
  private els_js_deactivateAll: NodeListOf<HTMLElement>
  private els_js_toggleAll: NodeListOf<HTMLElement>
  private initialize_elements(): PolyHTMLController {
    this.els_item = document.querySelectorAll(this.selector_item)

    this.els_js_activate = document.querySelectorAll(`.${this.className_js_activate}`)
    this.els_js_deactivate = document.querySelectorAll(`.${this.className_js_deactivate}`)
    this.els_js_toggle = document.querySelectorAll(`.${this.className_js_toggle}`)

    this.els_js_activateAll = document.querySelectorAll(`.${this.className_js_activateAll}`)
    this.els_js_deactivateAll = document.querySelectorAll(`.${this.className_js_deactivateAll}`)
    this.els_js_toggleAll = document.querySelectorAll(`.${this.className_js_toggleAll}`)
    return this
  }

}

