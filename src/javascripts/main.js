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
    this.amplitude = 60
    this.bezierLength = 100
    this.numberOfPoints = 12
    this.width = 1000

    this.points = new Array
  }

  initializePoints() {
    this.points = new Array
    for (let i = 0; i < this.numberOfPoints; i++) {
      this.points[i] = new Vector2()
    }
    this.generatePoints()
  }

  generatePoints() {
    let segment = this.width / this.numberOfPoints
    this.points.map((p, i) => {
      let m = 1
      if (i % 2 === 0) {
        m = -1
      }
      p.x = 200 + (i * segment)
      p.y = 400 + (50 * m)
    })
  }

  draw(layer, n) {
    layer.draw.begin()
    let cp1
    let cp2
    layer.draw.moveTo(this.points[0])
    this.points.forEach((point, i) => {
      let _point = point.clone()
      if (i % 2 === 0) {
        _point.y = point.y + (n * 100)
      } else {
        _point.y = point.y - (n * 100)
      }
      cp1 = _point.clone().moveBy(100, 0)
      cp2 = _point.clone().moveBy(-100, 0)
      layer.draw.bezierCurveTo(cp1, cp2, _point)
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
wave.initializePoints()

let animation = new Animation({
  duration: 2,
  numberOfIterations: 'infinite',
  alternate: true,
  timingFunction: Easings.QuadEaseInEaseOut,
  onTick: n => {
    main.draw.clear()
    wave.draw(main, n)
  }
}).play()