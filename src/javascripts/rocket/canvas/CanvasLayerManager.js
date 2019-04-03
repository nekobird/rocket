import { CanvasLayer } from './CanvasLayer'
import { ScreenModel } from '../ScreenModel'

export class CanvasLayerManager {

  constructor(layerStackElement) {
    this.count = 0
    this.isFullScreen = false
    this.layerStackElement = layerStackElement

    this.layers = new Array

    this.startListening()
    this.resize()
    return this
  }

  create(name) {
    const element = document.createElement(`CANVAS`)
    element = this.layerStackElement.appendChild(element)
    const canvasLayer = new CanvasLayer(element)
    this.layers[name] = canvasLayer
    this.count++
    this.resize()
    return this.layers[name]
  }

  register(name, canvasLayer) {
    let element = this.layerStackElement.appendChild(canvasLayer.element)
    canvasLayer.updateElement(element)
    this.layers[name] = canvasLayer
    this.count++
    this.resize()
    return this.layers[name]
  }

  get(name) {
    if (typeof this.layers[name] === 'undefined') {
      this.create(name)
    }
    return this.layers[name]
  }

  remove(name) {
    for (let i = 0; i < this.layerStackElement.children.length; i++) {
      let child = this.layerStackElement.children[i]
      if (child === this.layers[name].element) {
        this.layerStackElement.removeChild(child)
        delete this.layers[name]
        this.count--
        return true
      }
    }
    return false
  }

  resize() {
    let height = 0
    let width = 0

    if (this.isFullScreen === true) {
      height = ScreenModel.height
      width = ScreenModel.width
      this.layerStackElement.style.height = `${height}px`
      this.layerStackElement.style.width = `${width}px`
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

  startListening() {
    window.addEventListener('resize', this.resize.bind(this))
    return this
  }

  stopListening() {
    window.removeEventListener('resize', this.resize)
    return this
  }

}