import {
  HTMLSequenceController,
  HTMLPolyController,

} from '../../../rocket/Rocket'

let polyCon = new HTMLPolyController({
  selector_item: '.poly_item',
  className_active: '__active',
  className_js_activate: 'js_open',

  before_action: (action, context) => {
    console.log(action)
    return new Promise(resolve => {
      context
        .deactivateAll(action.groupName)
        .then(() => {
          resolve()
        })
    })
  }

})

let seqSwitcher = new HTMLSequenceController({
  selector_item: '.sequence_item',
  className_active: '__active',
  className_js_previous: 'js_goBack',
  className_js_next: 'js_goForward',
  className_js_jump: 'js_jump',
})