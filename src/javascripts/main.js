import {
  Animation,
  CanvasDraw,
  CanvasLayer,
  CanvasLayerManager,
  Easings,
  KeyboardEventHandler,
  KeyboardEventManager,
  Num,
  ScreenModel,
  UITextArea,
  Vector2,
} from './rocket/Rocket'

let SimplexNoise = require('simplex-noise')
let simplex = new SimplexNoise()

class Wave {

  constructor(position) {
    this.position = Vector2.equals(position)
    this.amplitude = 16
    this.bezierLength = 100
    this.numberOfPoints = 16
    this.width = 1000
    this.seed = Math.random() * 100

    this.templatePoints2 = new Array
    this.templatePoints = new Array
    this.points = new Array
    this.bezierControlPoints = new Array

    this.initializeVectors()
    this.setupPoints()
  }

  initializeVectors() {
    this.templatePoints = new Array
    this.templatePoints2 = new Array
    this.points = new Array
    this.bezierControlPoints = new Array
    for (let i = 0; i < this.numberOfPoints; i++) {
      this.templatePoints[i] = new Vector2
      this.templatePoints2[i] = new Vector2
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
      p.x = this.position.x + (i * segment)
      p.y = this.position.y + (this.amplitude * m)
    })
  }

  filterTemplatePointn(n) {
    this.templatePoints.forEach(point => {

    })
  }

  filterWave(n) {
    this.templatePoints.forEach((point, i) => {
      this.points[i].equals(point)
      if (i % 2 === 0) {
        this.points[i].x = point.x + (n * (this.amplitude * 2))
        this.points[i].y = point.y + (n * (this.amplitude * 2))
      } else {
        this.points[i].x = point.x + (n * (this.amplitude * 2))
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
      strokeColor: 'black'
    })
    layer.draw.end()
  }

}

let el_layer_stack = document.getElementById('layer_stack')
let manager = new CanvasLayerManager(el_layer_stack)

let l1 = manager.create('w1')
let l2 = manager.create('w2')
let l3 = manager.create('w3')

l1.draw.resolutionMultiplier = 2
l1.draw.resize(ScreenModel.width, ScreenModel.height)

let wave = new Wave(ScreenModel.centerPoint.moveBy(-500, -100))
let wave2 = new Wave(ScreenModel.centerPoint.moveBy(-500, -50))
let wave3 = new Wave(ScreenModel.centerPoint.moveBy(-500, 0))

let animation = new Animation({
  duration: 2,
  numberOfIterations: 'infinite',
  alternate: true,
  timingFunction: Easings.QuadEaseInEaseOut,
  onTick: n => {
    l1.draw.clear()
    wave.draw(l1, n)
    // wave.drawTemplatePoints(main)
    // wave.drawPoints(main)
    // wave.drawBezierControlPoints(main)
  }
}).play()

let animation2 = new Animation({
  duration: 2.1,
  numberOfIterations: 'infinite',
  alternate: true,
  timingFunction: Easings.QuadEaseInEaseOut,
  onTick: n => {
    l2.draw.clear()
    wave2.draw(l2, n)
    // wave.drawTemplatePoints(main)
    // wave.drawPoints(main)
    // wave.drawBezierControlPoints(main)
  }
}).play()

let animation3 = new Animation({
  duration: 2.2,
  numberOfIterations: 'infinite',
  alternate: true,
  timingFunction: Easings.QuadEaseInEaseOut,
  onTick: n => {
    l3.draw.clear()
    wave3.draw(l3, n)
    // wave.drawTemplatePoints(main)
    // wave.drawPoints(main)
    wave3.drawBezierControlPoints(l3)
  }
}).play()