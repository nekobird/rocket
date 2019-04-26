import {
  UITextArea
} from '../../rocket/rocket'


let textareas = document.querySelectorAll('.uiTextArea')

Array.from(textareas).forEach(textarea => {
  new UITextArea(<HTMLTextAreaElement>textarea)
})