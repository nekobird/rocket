const MODEL_ATTRIBUTES = {
  border: 'none',
  boxSizing: 'border-box',
  display: 'block',
  height: '100vh',
  left: '0px',
  padding: '0px',
  position: 'fixed',
  top: '0px',
  visibility: 'hidden',
  width: '100vw',
  zIndex: '-9999',
}

let modelElement = undefined
let modelIsReady = false

export class ScreenModel {

  constructor() {
    this.create()
  }

  get modelIsReady() {
    return modelIsReady
  }

  get width() {
    return modelElement.offsetWidth
  }

  get height() {
    return modelElement.offsetHeight
  }

  get diagonal() {
    const h = modelElement.offsetHeight
    const w = modelElement.offsetWidth
    return Math.abs(Math.sqrt(w * w + h * h))
  }

  get modelElement() {
    return modelElement
  }

  // MODEL

  static create() {
    // Create and append model element.
    modelElement = document.createElement()
    document.body.appendChild(this.element)
    // Apply model attributes.
    for (let key in MODEL_ATTRIBUTES) {
      modelElement.style[key] = MODEL_ATTRIBUTES[key]
    }
    modelIsReady = true
    return this
  }

  static destroy() {
    // Check if model is created.
    if (
      typeof modelElement !== 'undefined' &&
      modelElement.nodeType === 1
    ) {
      // Remove model from DOM and destroy it.
      document.body.removeChild(modelElement)
      modelElement.remove()
    }
    modelIsReady = false
    return this
  }

}