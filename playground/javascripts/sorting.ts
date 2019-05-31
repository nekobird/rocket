import {
  Sortable,
} from '../../rocket/rocket';

const container: HTMLElement = document.querySelector('.sortableContainer');
const items: HTMLElement[] = Array.from(document.querySelectorAll('.sortableItem'));

document.addEventListener('contextmenu', event => event.preventDefault());

const sortable = new Sortable({
  activateOnLongPress: true,
  autoScroll: true,
  longPressWait: 0.2,
  longPressCondition: (event, manager, context) => {
    if (event.wasScrolling === true) {
      return false;
    }
    return true;
  },

  condition: (item) => {
    return true;
  }
});

sortable.config.items = items;
sortable.config.group = container;

sortable.initialize();