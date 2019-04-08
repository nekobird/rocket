import {
  CanvasDraw,
} from '../Rocket'

export class CanvasLayer {

  constructor(element) {
    this.element = element
    this.element.style.position = 'absolute'
    this.element.style.left = '0px'
    this.element.style.top = '0px'
    this.draw = new CanvasDraw(this.element)
  }

  set zIndex(zIndex) {
    this.element.style.zIndex = zIndex.toString()
  }

  updateElement(element) {
    this.element = element
    this.draw.element = element
    return this
  }

  show() {
    this.element.style.display = `block`
    return this
  }

  hide() {
    this.element.style.display = `none`
    return this
  }

}