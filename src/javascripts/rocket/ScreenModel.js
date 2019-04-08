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

  static get modelIsReady() {
    return modelIsReady
  }

  static get width() {
    this.startModel()
    return modelElement.offsetWidth
  }

  static get height() {
    this.startModel()
    return modelElement.offsetHeight
  }

  static get diagonal() {
    this.startModel()

    const h = modelElement.offsetHeight
    const w = modelElement.offsetWidth

    return Math.abs(
      Math.sqrt(w * w + h * h)
    )
  }

  static get modelElement() {
    this.startModel()
    return modelElement
  }

  // MODEL

  static get modelIsCreated() {
    if (
      typeof modelElement !== 'undefined' &&
      modelElement.nodeType === 1
    ) {
      return true
    }
    return false
  }

  static startModel() {
    if (!this.modelIsCreated) {
      this.create()
    }
    return this
  }

  static create() {
    // Create and append model element.
    modelElement = document.createElement('DIV')
    document.body.appendChild(modelElement)

    // Apply model attributes.
    for (let key in MODEL_ATTRIBUTES) {
      modelElement.style[key] = MODEL_ATTRIBUTES[key]
    }

    modelIsReady = true
    return this
  }

  static destroy() {
    // Check if model is created.
    if (this.modelIsCreated) {
      // Remove model from DOM and destroy it.
      document.body.removeChild(modelElement)
      modelElement.remove()
    }

    modelIsReady = false
    return this
  }

}