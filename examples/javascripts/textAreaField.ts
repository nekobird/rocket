import {
  TextAreaField,
} from '../../rocket/rocket';

const textareas = document.querySelectorAll('.textareafield');
if (textareas !== null) {
  Array.from(textareas).forEach(textarea => {
    const textareafield = new TextAreaField(<HTMLTextAreaElement>textarea);
    textareafield.config.onGrow = (height, context) => {
      console.log(context.isSingleLine);
      console.log(context.lineCount);
    }
    textareafield.initialize();
  });
}
