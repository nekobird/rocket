import {
  Animation,
  Easings,
  CanvasDraw,
  CanvasLayer,
  CanvasLayerManager,
  KeyboardEventManager,
  KeyboardEventHandler,
  UITextArea,
  ScreenModel,
  Num,
  Vector2,
} from './rocket/Rocket'


class Wave {

  constructor() {
    this.amplitude = 16
    this.bezierLength = 100
    this.numberOfPoints = 16
    this.width = 1000

    this.templatePoints = new Array
    this.points = new Array
    this.bezierControlPoints = new Array

    this.initializeVectors()
    this.setupPoints()
  }

  initializeVectors() {
    this.templatePoints = new Array
    this.points = new Array
    this.bezierControlPoints = new Array
    for (let i = 0; i < this.numberOfPoints; i++) {
      this.templatePoints[i] = new Vector2
      this.points[i] = new Vector2
    }
    this.points.forEach(() => {
      this.bezierControlPoints.push(new Vector2)
      this.bezierControlPoints.push(new Vector2)
    })
  }

  setupPoints() {
    let segment = this.width / this.numberOfPoints
    this.templatePoints.map((p, i) => {
      let m = 1
      if (i % 2 === 0) {
        m = -1
      }
      p.x = 200 + (i * segment)
      p.y = 400 + (this.amplitude * m)
    })
  }

  filterWave(n) {
    this.templatePoints.forEach((point, i) => {
      this.points[i].equals(point)
      if (i % 2 === 0) {
        this.points[i].y = point.y + (n * (this.amplitude * 2))
      } else {
        this.points[i].y = point.y - (n * (this.amplitude * 2))
      }
    })
  }

  filterBezierControlPoints(n) {
    // Clears array every time.
    this.bezierControlPoints = new Array
    let c = 0
    let l = (this.width / this.numberOfPoints) / 2
    this.points.forEach((point, i) => {
      this.bezierControlPoints[c] = point.clone().moveBy(l, 0)
      c++
      if (i + 1 <= this.points.length - 1) {
        this.bezierControlPoints[c] = this.points[i + 1].clone().moveBy(-l, 0)
        c++
      }
    })
  }

  drawTemplatePoints(layer) {
    let style = {
      noFill: true,
      fillColor: 'white',
      strokeWidth: 10,
      strokeColor: 'white'
    }
    this.templatePoints.forEach(point => {
      layer.draw.circle(point, 10, style)
    })
  }

  drawBezierControlPoints(layer) {
    let style = {
      noFill: false,
      noStroke: true,
      fillColor: 'red'
    }
    this.bezierControlPoints.forEach(point => {
      layer.draw.circle(point, 4, style)
    })
  }

  drawPoints(layer) {
    let style = {
      noFill: true,
      fillColor: 'white',
      strokeWidth: 10,
      strokeColor: 'white'
    }
    this.points.forEach(point => {
      layer.draw.circle(point, 5, style)
    })
  }

  draw(layer, n) {
    layer.draw.begin()
    // Move to first point
    layer.draw.moveTo(this.points[0])
    let c = 0
    this.filterWave(n)
    this.filterBezierControlPoints(n)
    layer.draw.moveTo(this.points[0])
    this.points.forEach((point, i) => {
      if (i > 0) {
        let cp1 = this.bezierControlPoints[c]
        c++
        let cp2 = this.bezierControlPoints[c]
        c++
        layer.draw.bezierCurveTo(cp1, cp2, point)
      }
    })
    layer.draw.applyStyle({
      noFill: true,
      fillColor: 'white',
      strokeWidth: 24,
      strokeColor: 'white'
    })
    layer.draw.end()
  }

}

let el_layer_stack = document.getElementById('layer_stack')
let manager = new CanvasLayerManager(el_layer_stack)

manager.create('main')

let main = manager.find('main')
main.draw.resolutionMultiplier = 2
main.draw.resize(ScreenModel.width, ScreenModel.height)

let center = new Vector2(
  ScreenModel.width / 2,
  ScreenModel.height / 2
)

let wave = new Wave()

let animation = new Animation({
  duration: 2,
  numberOfIterations: 'infinite',
  alternate: true,
  timingFunction: Easings.QuadEaseInEaseOut,
  onTick: n => {
    main.draw.clear()
    wave.draw(main, n)
    // wave.drawTemplatePoints(main)
    // wave.drawPoints(main)
    // wave.drawBezierControlPoints(main)
  }
}).play()