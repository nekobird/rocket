import {
  TextAreaField,
} from '../../rocket/rocket';

let textareas = document.querySelectorAll('.textareafield');
Array.from(textareas).forEach(textarea => {
  const textareafield = new TextAreaField(<HTMLTextAreaElement>textarea);
  textareafield.config.onGrow = (height, context) => {
    console.log(context.isSingleLine);
    console.log(context.lineCount);
  }
});