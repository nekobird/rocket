export class Config {
    // PUBLIC

    public listenTo_clickOutside: boolean = false
    public listenTo_keydown: boolean = false
  
    // SELECTOR
    public selector_item: string = '.item'
  
    // CLASS NAME
    public className_active: string = '__active'
  
    public className_js_activate: string = 'js_activate'
    public className_js_deactivate: string = 'js_deactivate'
    public className_js_toggle: string = 'js_toggle'
  
    public className_js_activateAll: string = 'js_activateAll'
    public className_js_deactivateAll: string = 'js_deactivateAll'
    public className_js_toggleAll: string = 'js_toggleAll'
  
    // CONDITION HOOK
    public condition_activate: ConditionHook = (action, context) => {
      return true
    }
    public condition_deactivate: ConditionHook = (action, context) => {
      return true
    }
    public condition_toggle: ConditionHook = (action, context) => {
      return true
    }
  
    public condition_activateAll: ConditionHook = (action, context) => {
      return true
    }
    public condition_deactivateAll: ConditionHook = (action, context) => {
      return true
    }
    public condition_toggleAll: ConditionHook = (action, context) => {
      return true
    }
  
    // LISTEN TO HOOK
    public onClickOutside: ListenToHook = (event, group, context) => { }
    public onKeydown: ListenToHook = (event, group, context) => { }


      // HOOK
  public before_activate: Hook = (action, context) => {
    return new Promise(resolve => {
      resolve()
    })
  }
  public after_activate: Hook = (action, context) => {
    return new Promise(resolve => {
      resolve()
    })
  }

  public before_deactivate: Hook = (action, context) => {
    return new Promise(resolve => {
      resolve()
    })
  }
  public after_deactivate: Hook = (action, context) => {
    return new Promise(resolve => {
      resolve()
    })
  }

  public before_action: BeforeActionCallback = (action, context) => { return Promise.resolve() }
  public after_action: AfterActionCallback = (action, context) => { }

}