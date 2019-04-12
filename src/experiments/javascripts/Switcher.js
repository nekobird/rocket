import {
  DOMUtil
} from '../../rocket/Rocket'

export class Switcher {

  constructor() {
    // item
    // next
    // previous
    // jump
    // target, group, id
    this.activeClassName = '__active'
    this.itemSelector = '.item'
    this.jsPreviousSelector = '.js_previous'
    this.jsNextSelector = '.js_next'
    this.jsJumpSelector = '.js_jump'
    this.els_item
    this.groups = {}
  }

  initialize() {
    this.els_item = document.querySelectorAll(this.itemSelector)
    // Initialize group object
    this.els_item.forEach(element => {
      const groupName = element.dataset.group
      this.groups[groupName] = {
        name: groupName,
        items: document.querySelectorAll(
          `${this.itemSelector}[data-group="${groupName}"]`
        ),
        isActive: false
      }
    })
    // Set active item.
    // TODO: Handle empty set..
    Object.keys(this.groups).forEach(groupName => {
      this.groups[groupName].items.forEach((item, index) => {
        if (item.classList.contains(this.activeClassName)) {
          if (typeof this.groups[groupName.activeItem] === 'undefined') {
            this.groups[groupName].activeItem = item
            this.groups[groupName].activeIndex = index
            this.groups[groupName].isActive = true
          } else {
            item.classList.remove(this.activeClassName)
          }
        }
      })
      if (typeof this.groups[groupName].activeItem === 'undefined') {
        this.groups[groupName].activeItem = this.groups[groupName].items[0]
        this.groups[groupName].activeIndex = 0
        this.groups[groupName].isActive = true
        this.groups[groupName].items[0].classList.add(this.activeClassName)
      }
    })
  }

  next() {

  }

  reset(groupName) {
    this.groups[groupName].items.forEach(item => {
      this.groups[groupName].activeItem.classList.remove('__active')
    })
  }

  initializeEventHandlers() {
    this._click_next_handler = () => {

    }
    this._click_previous_handler = () => {

    }
    this._click_jump_handler = () => {

    }
  }

  startListening() {
    this.els_js_next.forEach(element => {
      element.addEventListener('click', this._click_next_handler)
    })
    this.els_js_previous.forEach(element => {
      element.addEventListener('click', this._click_previous_handler)
    })
    this.els_js_jump.forEach(element => {
      element.addEventListener('click', this._click_jump_handler)
    })

  }
}