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

let el_layer_stack = document.getElementById('layer_stack')

let manager = new CanvasLayerManager(el_layer_stack)

manager.create('main')
console.log(ScreenModel.height)
console.log(ScreenModel.width)

let main = manager.find('main')
main.draw.resolutionMultiplier = 2
main.draw.resize(ScreenModel.width, ScreenModel.height)
let circle_position = new Vector2(
  ScreenModel.width / 2,
  ScreenModel.height / 2
)

let animation = new Animation({
  duration: 2,
  numberOfIterations: 'infinite',
  alternate: true,
  timingFunction: Easings.QuadEaseInEaseOut,
  onTick: n => {
    main.draw.clear()
    main.draw.circle(circle_position, Num.modulate(n, 1, [0, 100]), {
      fillColor: 'hsl(220, 100%, 50%)',
      noStroke: true,
    })
  }
}).play()