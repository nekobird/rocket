import {
  KeyboardEventManager,
  KeyboardEventHandler,
  UITextArea,
  Color
} from './rocket/Rocket'

let color_0 = new Color('hsla(240, 100%, 50%, 0.5)')
// color_0.hslaString = "hsla(240, 100%, 50%, 0.5)"

// KeyboardEventManager Demo
let keyboardEventHandler = new KeyboardEventHandler()
keyboardEventHandler.determineKeyDown = keycode => {
  console.log(keycode)
}

let keyboardEventManager = new KeyboardEventManager()
keyboardEventManager.register('main', keyboardEventHandler)

// UITextArea Demo
let textareaDemo = document.getElementById('textarea_demo')
let textarea = new UITextArea(textareaDemo)