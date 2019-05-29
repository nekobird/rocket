import {
  ScrollTriggerManager,
  ViewportModel,
} from '../../rocket/rocket';

const manager = new ScrollTriggerManager();

const item3 = document.querySelector('.item-3');

manager.addTrigger({
  condition: (scrollLocation, trigger) => {
    if (item3.getBoundingClientRect().top - ViewportModel.height < 0) {
      return true;
    }
    return false;
  },
  action: (location, trigger) => {
    item3.classList.add('item--animate-in')
    trigger.removeOnceTriggered = true;
    return Promise.resolve();
  },
});

manager.initialize();