import {
  Num,
  Vector2,
} from './rocket'

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

let modelElement: HTMLElement
let modelIsReady: boolean = false

export class ScreenModel {

  constructor() {
    ScreenModel.createModel()
  }

  // MODEL PROPERTIES

  public static get centerPoint(): Vector2 {
    this.createModel()
    return new Vector2(this.centerX, this.centerY)
  }

  public static get centerX(): number {
    this.createModel()
    return modelElement.offsetWidth / 2
  }

  public static get centerY(): number {
    this.createModel()
    return modelElement.offsetHeight / 2
  }

  public static get width(): number {
    this.createModel()
    return modelElement.offsetWidth
  }

  public static get height(): number {
    this.createModel()
    return modelElement.offsetHeight
  }

  public static get diagonal(): number {
    this.createModel()
    const w: number = modelElement.offsetWidth
    const h: number = modelElement.offsetHeight
    return Num.hypotenuse(w, h)
  }

  // MODEL

  public static get modelElement(): HTMLElement {
    this.createModel()
    return modelElement
  }

  public static get modelIsReady(): boolean {
    return modelIsReady
  }

  public static get modelIsCreated(): boolean {
    return (
      typeof modelElement !== 'undefined' &&
      modelElement.nodeType === 1
    )
  }

  public static createModel(): ScreenModel {
    if (modelIsReady === false) {
      modelElement = document.createElement('DIV')
      document.body.appendChild(modelElement)
      Object.assign(modelElement.style, MODEL_ATTRIBUTES)
      modelIsReady = true
    }
    return this
  }

  public static destroyModel(): ScreenModel {
    if (modelIsReady === true) {
      document.body.removeChild(modelElement)
      modelElement.remove()
      modelIsReady = false
    }
    return this
  }

}