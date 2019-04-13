import {
  CanvasLayer,
  ScreenModel,
} from '../Rocket'

export class CanvasLayerManager {

  public count: number = 0
  public isFullScreen: boolean = false

  public layerStackElement: HTMLElement
  public layers: CanvasLayer[]

  constructor(layerStackElement: HTMLElement) {
    this.layerStackElement = layerStackElement
    this.layers = []
    this
      .startListening()
      .resize()
    return this
  }

  public create(name: string) {
    let element: HTMLCanvasElement = <HTMLCanvasElement>document.createElement(`CANVAS`)
    element = this.layerStackElement.appendChild(element)
    this.layers[name] = new CanvasLayer(element)
    this.count++
    this.resize()
    return this.layers[name]
  }

  public register(name: string, canvasLayer: CanvasLayer): CanvasLayer {
    let element: HTMLCanvasElement = this.layerStackElement.appendChild(canvasLayer.element)
    canvasLayer.updateElement(element)
    this.layers[name] = canvasLayer
    this.count++
    this.resize()
    return this.layers[name]
  }

  public remove(name: string): boolean {
    for (let i = 0; i < this.layerStackElement.children.length; i++) {
      let child: Element = this.layerStackElement.children[i]
      if (child === this.layers[name].element) {
        this.layerStackElement.removeChild(child)
        delete this.layers[name]
        this.count--
        return true
      }
    }
    return false
  }

  public find(name: string): HTMLCanvasElement {
    if (typeof this.layers[name] === 'undefined') {
      this.create(name)
    }
    return this.layers[name]
  }

  public resize = () => {
    let height: number = 0
    let width: number = 0

    if (this.isFullScreen === true) {
      this.layerStackElement.style.height = `${ScreenModel.height}px`
      this.layerStackElement.style.width = `${ScreenModel.width}px`
    } else {
      height = this.layerStackElement.offsetHeight
      width = this.layerStackElement.offsetWidth
    }

    for (let name in this.layers) {
      this.layers[name].element.style.height = `${height}px`
      this.layers[name].element.style.width = `${width}px`
      this.layers[name].draw.resize()
    }

    return this
  }

  // LISTEN

  public startListening(): CanvasLayerManager {
    window.addEventListener('resize', this.resize)
    return this
  }

  public stopListening(): CanvasLayerManager {
    window.removeEventListener('resize', this.resize)
    return this
  }

}