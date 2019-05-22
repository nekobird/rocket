import {
  TextAreaField,
} from '../../rocket/rocket';

let textareas = document.querySelectorAll('.textareafield');
Array.from(textareas).forEach(textarea => {
  const textareafield = new TextAreaField(<HTMLTextAreaElement>textarea);
  console.log(textareafield.getHeight('a'));
});