import {
  Sortable,
} from '../../rocket/rocket';

const container: HTMLElement = document.querySelector('.sortableContainer');
const items: HTMLElement[] = Array.from(document.querySelectorAll('.sortableItem'));

const sortable = new Sortable({
  activateOnLongPress: true,
});

sortable.config.items = items;
sortable.config.group = container;
sortable.initialize();
