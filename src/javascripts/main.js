import {
  Animation,
  KeyboardEventManager,
  KeyboardEventHandler,
  UITextArea,
} from './rocket/Rocket'


let animation = new Animate

// KeyboardEventManager Demo
let keyboardEventHandler = new KeyboardEventHandler()
keyboardEventHandler.determineKeyDown = keycode => {
  console.log(keycode)
}

let keyboardEventManager = new KeyboardEventManager()
keyboardEventManager.register('main', keyboardEventHandler)

// UITextArea Demo
let textareaDemo = document.getElementById('textarea_grow_demo')
let textarea = new UITextArea(textareaDemo)