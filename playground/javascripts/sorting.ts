import {
  SortableList,
} from '../../rocket/rocket';

const containers = document.querySelectorAll('.sortableContainer');

// document.addEventListener('contextmenu', event => event.preventDefault());
const sortable = new SortableList({
  activateOnLongPress: true,
  autoScroll: true,
  longPressWait: 0.2,
  childIsItem: child => child.classList.contains('sortableItem'),
  longPressCondition: event => event.wasScrolling !== true,
  condition: item => true,
});
sortable.config.groups = containers as NodeListOf<HTMLElement>;
sortable.initialize();

console.log(sortable);