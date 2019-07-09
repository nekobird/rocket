import {
  DOMTraverse,
  DragEventManager,
} from '../../rocket';

import {
  SequenceController,
} from './SequenceController';

import {
  SequenceTriggerMap,
} from './config';

import {
  SequenceActionName,
} from './actionManager';

export interface ActionConfigMapEntry {
  configProperty: string;
  action: SequenceActionName;
}

export type ActionConfigMapEntries = ActionConfigMapEntry[];

export class EventManager {
  public controller: SequenceController;

  public dragEventManager: DragEventManager;

  constructor(controller: SequenceController) {
    this.controller = controller;
    this.dragEventManager = new DragEventManager({ onUp: this.onUp });
  }

  public initialize(): this {
    this.dragEventManager.initialize()
    if (this.controller.config.listenToKeydown === true)
      window.addEventListener('keydown', this.eventHandlerKeydown);
    return this;
  }

  private onUp = event => {
    if (typeof event.downData !== 'object') return;
    const targetDownElement = event.getTargetElementFromData(event.downData);
    if (targetDownElement === false) return;
    const { config } = this.controller;
    const trigger = DOMTraverse.findAncestor(targetDownElement, config.isTrigger, false);
    if (trigger === false) return;
    const triggerMap = config.mapTriggerToAction(<HTMLElement>trigger);
    if (triggerMap === false) return;
    this.eventHub(<HTMLElement>trigger, triggerMap);
  }

  private eventHub(trigger: HTMLElement, triggerMap: SequenceTriggerMap): this {
    const { actionManager, isReady } = this.controller;
    if (
      isReady === true
      && actionManager.isRunning === false
    ) {
      actionManager.isRunning = true;
      const action = actionManager.composeActionFromTrigger(trigger, triggerMap);
      actionManager.actionHub(action);
    }
    return this;
  }

  private eventHandlerKeydown = (event: KeyboardEvent) => {
    const { config, actionManager } = this.controller;
    if (
      config.listenToKeydown === true
      && actionManager.isRunning === false
    ) config.onKeydown(event, this.controller);
  }
}
