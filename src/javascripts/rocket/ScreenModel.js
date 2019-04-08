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
    this.createModel()
  }

  // MODEL PROPERTIES

  static get width() {
    this.createModel()
    return modelElement.offsetWidth
  }

  static get height() {
    this.createModel()
    return modelElement.offsetHeight
  }

  static get diagonal() {
    this.createModel()

    const h = modelElement.offsetHeight
    const w = modelElement.offsetWidth

    return Math.abs(
      Math.sqrt(w * w + h * h)
    )
  }

  // MODEL

  static get modelElement() {
    this.createModel()
    return modelElement
  }

  static get modelIsReady() {
    return modelIsReady
  }

  static get modelIsCreated() {
    if (
      typeof modelElement !== 'undefined' &&
      modelElement.nodeType === 1
    ) {
      return true
    }
    return false
  }

  static createModel() {
    if (modelIsReady === false) {
      modelElement = document.createElement('DIV')
      document.body.appendChild(modelElement)

      for (let key in MODEL_ATTRIBUTES) {
        modelElement.style[key] = MODEL_ATTRIBUTES[key]
      }

      modelIsReady = true
    }
    return this
  }

  static destroyModel() {
    if (modelIsReady === true) {
      document.body.removeChild(modelElement)
      modelElement.remove()

      modelIsReady = false
    }
    return this
  }

}