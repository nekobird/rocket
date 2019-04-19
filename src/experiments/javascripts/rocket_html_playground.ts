import {
  PolyController,
} from '../../../rocket/Rocket'

let polyCon = new PolyController({
  selectorItems: '.poly_item',
  classNameItemActive: '__active',
  classNameJsActivate: 'js_open',
  classNameJsDeactivate: 'js_close',
  beforeAction: (action, context) => {
    console.log(context)
    return Promise.resolve()
  }
})