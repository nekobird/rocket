import {
  Sortable,
} from '../../rocket/rocket';

const container: HTMLElement = document.querySelector('.sortableContainer');

const sortable = new Sortable({
  activateOnLongPress: true,
});

sortable.config.group = container;
sortable.initialize();
