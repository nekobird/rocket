import {
  ScrollEventManager,
  ScrollEventHandler,
} from '../../rocket/rocket'


const scrollManager = new ScrollEventManager()


const scrollHandler = new ScrollEventHandler(window)
scrollHandler.onScrollStart = (a) => {
  console.log(a)
}

scrollManager.register('main', scrollHandler)

scrollManager.listen()