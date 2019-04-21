import {
  Color,
  Point,
  Vector2,
} from '../rocket'

interface CanvasDrawStyle {
  fillColor?: string | Color,
  noFill?: boolean,
  noStroke?: boolean,
  strokeCap?: 'square' | 'round',
  strokeColor?: string | Color,
  strokeJoin?: 'bevel' | 'round' | 'miter',
  strokeWidth?: number,
}

const DEFAULT_STYLE: CanvasDrawStyle = {
  fillColor: 'black',
  noFill: false,
  noStroke: false,
  strokeCap: 'round',
  strokeColor: 'black',
  strokeJoin: 'round',
  strokeWidth: 0,
}

export class CanvasDraw {

  public element: HTMLCanvasElement

  public context
  public resolutionMultiplier: number
  public previousTranslation: Vector2

  private _defaultStyle: object

  constructor(element: HTMLCanvasElement) {
    this.element = element

    this.context = this.element.getContext('2d')

    this.resolutionMultiplier = window.devicePixelRatio
    this.previousTranslation = new Vector2

    this._defaultStyle = Object.assign({}, DEFAULT_STYLE)

    // this.resize()
  }

  get defaultStyle(): CanvasDrawStyle {
    return this._defaultStyle
  }

  set defaultStyle(style: CanvasDrawStyle) {
    Object.assign(this._defaultStyle, style)
  }

  // GRADIENTS
  // https://www.w3schools.com/tags/canvas_createlineargradient.asp
  // https://www.w3schools.com/tags/canvas_arcto.asp
  public createLinearGradient(from: Vector2, to: Vector2): CanvasGradient {
    const m: number = this.resolutionMultiplier
    return this.context.createLinearGradient(
      from.x * m, from.y * m,
      to.x * m, to.y * m
    )
  }

  public createRadialGradient(from: Vector2, fromRadius: number, to: Vector2, toRadius: number): CanvasGradient {
    const m: number = this.resolutionMultiplier
    return this.context.createRadialGradient(
      from.x * m, from.y * m, fromRadius * m,
      to.x * m, to.y * m, toRadius * m
    )
  }

  public applyStyle(style: CanvasDrawStyle): this {
    let computedStyle: any = Object.assign({}, this._defaultStyle)

    if (typeof style === 'object') {
      Object.assign(computedStyle, style)
    }

    this.context.fillStyle = computedStyle.fillColor
    this.context.lineCap = computedStyle.strokeCap
    this.context.lineJoin = computedStyle.strokeJoin
    this.context.strokeStyle = computedStyle.strokeColor
    this.context.lineWidth = computedStyle.strokeWidth

    if (computedStyle.noFill === false) {
      this.context.fill()
    }

    if (computedStyle.noStroke === false) {
      this.context.stroke()
    }

    return this
  }

  public clear(): this {
    this.context.clearRect(
      0, 0,
      this.element.width, this.element.height
    )
    return this
  }

  public resize(width?: number, height?: number): this {
    const m: number = this.resolutionMultiplier
    if (
      typeof height === 'number' &&
      typeof width === 'number'
    ) {
      this.element.height = height * m
      this.element.width = width * m
    } else {
      this.element.height = this.element.offsetHeight * m
      this.element.width = this.element.offsetWidth * m
    }
    return this
  }

  // TODO: Need to optimize this.
  // Perhaps get a snapshot of all the pixel data.
  public getPixelColor(point: Point): Color {
    const m: number = this.resolutionMultiplier
    let imageData: ImageData = this.context.getImageData(
      point.x * m, point.y * m,
      this.element.width, this.element.height
    )
    let data = imageData.data
    let color: Color = new Color()
    color.rgba = [
      data[0] / 255,
      data[1] / 255,
      data[2] / 255,
      data[3] / 255
    ]
    return color
  }

  public putPixelColor(point: Point, color: Color) {
    const m = this.resolutionMultiplier
    let pixel = this.context.getImageData(point.x * m, point.y * m, 1, 1)
    let data = pixel.data
    data[0] = color.red * 255
    data[1] = color.green * 255
    data[2] = color.blue * 255
    data[3] = color.alpha * 255
    return this.context.putImageData(pixel, 0, 0)
  }

  public clip(): this {
    this.context.clip()
    return this
  }

  public shadow(offsetX, offsetY, blur, color): this {
    const m = this.resolutionMultiplier
    if (color instanceof Color) {
      color = color.rgbaString
    }
    this.context.shadowBlur = blur * m
    this.context.shadowColor = color
    this.context.shadowOffsetX = offsetX * m
    this.context.shadowOffsetY = offsetY * m
    return this
  }

  public image(img, st, sw, sh, dt, dw, dh): this {
    const m = this.resolutionMultiplier
    this.context.drawImage(
      img, st.x, st.y, sw, sh, dt.x * m, dt.y * m, dw * m, dh * m
    )
    return this
  }

  // SHAPES

  public circle(v: Point, r: number, style: CanvasDrawStyle, insert): this {
    const m = this.resolutionMultiplier
    this.save()
    this.begin()
    this.context.arc(
      v.x * m, v.y * m,
      r * m,
      0, 2 * Math.PI,
      false
    )
    this.end()
    this.applyStyle(style)
    if (typeof insert !== 'undefined') {
      insert()
    }
    this.restore()
    return this
  }

  // PATH

  public begin(): this {
    this.context.beginPath()
    return this
  }

  public end(): this {
    this.context.closePath()
    return this
  }

  // https://www.w3schools.com/tags/canvas_ispointinpath.asp
  public isPointInPath(point: Point): boolean {
    const m: number = this.resolutionMultiplier
    return this.context.isPointInPath(point.x * m, point.y * m)
  }

  public moveTo(to: Point): this {
    const m: number = this.resolutionMultiplier
    this.context.moveTo(to.x * m, to.y * m)
    return this
  }

  public lineTo(to: Point): this {
    const m: number = this.resolutionMultiplier
    this.context.lineTo(to.x * m, to.y * m)
    return this
  }

  public arcTo(from: Point, to: Point, r): this {
    const m: number = this.resolutionMultiplier
    this.context.arcTo(
      from.x * m, from.y * m,
      to.x * m, to.y * m,
      r * m
    )
    return this
  }

  public bezierCurveTo(cp1: Point, cp2: Point, to: Point): this {
    const m: number = this.resolutionMultiplier
    this.context.bezierCurveTo(
      cp1.x * m, cp1.y * m,
      cp2.x * m, cp2.y * m,
      to.x * m, to.y * m
    )
    return this
  }

  public quadraticCurveTo(cp: Point, to: Point): this {
    const m: number = this.resolutionMultiplier
    this.context.quadraticCurveTo(
      cp.x * m, cp.y * m,
      to.x * m, to.y * m
    )
    return this
  }

  // TRANSFORM

  public translate(to: Point): this {
    const m: number = this.resolutionMultiplier
    this.context.translate(to.x * m, to.y * m)
    this.previousTranslation.equals(to)
    return this
  }

  public rotate(angle: number): this {
    this.context.rotate(angle)
    return this
  }

  public scale(w: number, h?: number): this {
    if (typeof h !== 'number') {
      h = w
    }
    this.context.scale(w, h)
    return this
  }

  // STASH

  public reset(): this {
    this.context.setTransform(1, 0, 0, 1, 0, 0)
    return this
  }

  public save(): this {
    this.context.save()
    return this
  }

  public restore(): this {
    this.context.restore()
    return this
  }

}