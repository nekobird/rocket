import {
  Num,
  Vector2,
} from './Rocket'

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
    ScreenModel.createModel()
  }

  // MODEL PROPERTIES

  static get centerPoint(): Vector2 {
    this.createModel()
    return new Vector2(this.centerX, this.centerY)
  }

  static get centerX(): number {
    this.createModel()
    return modelElement.offsetWidth / 2
  }

  static get centerY(): number {
    this.createModel()
    return modelElement.offsetHeight / 2
  }

  static get width(): number {
    this.createModel()
    return modelElement.offsetWidth
  }

  static get height(): number {
    this.createModel()
    return modelElement.offsetHeight
  }

  static get diagonal(): number {
    this.createModel()

    const w = modelElement.offsetWidth
    const h = modelElement.offsetHeight
  
    return Num.hypotenuse(w, h)
  }

  // MODEL

  static get modelElement(): HTMLElement {
    this.createModel()
    return modelElement
  }

  static get modelIsReady(): boolean {
    return modelIsReady
  }

  static get modelIsCreated(): boolean {
    return (
      typeof modelElement !== 'undefined' &&
      modelElement.nodeType === 1
    )
  }

  static createModel(): ScreenModel {
    if (modelIsReady === false) {
      modelElement = document.createElement('DIV')
      document.body.appendChild(modelElement)
      Object.assign(modelElement.style, MODEL_ATTRIBUTES)
      modelIsReady = true
    }
    return this
  }

  static destroyModel(): ScreenModel {
    if (modelIsReady === true) {
      document.body.removeChild(modelElement)
      modelElement.remove()
      modelIsReady = false
    }
    return this
  }

}