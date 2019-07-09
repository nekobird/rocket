import {
  DOMTraverse,
} from '../rocket'

export interface InputActiveManagerConfig {
  activeClassName: string;
  containerClassName: string;

  activateOnFocus: boolean;

  beforeActivate: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => Promise<void>;
  afterActivate: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => void;

  conditionActivate: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => boolean;

  beforeDeactivate: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => Promise<void>;
  afterDeactivate: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement) => void;

  activate: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement, activeClassName: string) => Promise<void>;
  deactivate: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement, activeClassName: string) => Promise<void>;

  onFocus: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement, context: InputActiveManager) => void;
  onBlur: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement, context: InputActiveManager) => void;
  onInput: (container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement, context: InputActiveManager) => void;
}

export const INPUT_FOCUS_MANAGER_CONFIG: InputActiveManagerConfig = {
  activeClassName: 'floating-label-field--focus',
  containerClassName: 'floating-label-field',
  activateOnFocus: true,

  conditionActivate: (container, input) => input.value !== '',

  beforeActivate: (container, input) => Promise.resolve(),
  afterActivate: (container, input) => Promise.resolve(),

  beforeDeactivate: (container, input) => Promise.resolve(),
  afterDeactivate: (container, input) => Promise.resolve(),

  activate: (container, input, activeClassName) => {
    container.classList.add(activeClassName);
    return Promise.resolve();
  },
  deactivate: (container, input, activeClassName) => {
    container.classList.remove(activeClassName);
    return Promise.resolve();
  },

  onFocus: () => {},
  onBlur: () => {},
  onInput: () => {},
};

export class InputActiveManager {

  public inputElements: (HTMLInputElement | HTMLTextAreaElement)[];
  public containerElements?: HTMLElement[];

  public config: InputActiveManagerConfig;

  constructor(config?: Partial<InputActiveManagerConfig>) {
    this.config = Object.assign({}, INPUT_FOCUS_MANAGER_CONFIG);
    this.setConfig(config);

    this.inputElements = [];

    this.getElements();
    this.listen();
    this.initialize();
  }

  private setConfig(config?: Partial<InputActiveManagerConfig>) {
    if (typeof config === 'object') Object.assign(this.config, config);
  }

  private getElements() {
    const containerElements: NodeListOf<HTMLElement> =
      document.querySelectorAll(`.${this.config.containerClassName}`);

    if (containerElements !== null) {
      this.containerElements = Array.from(containerElements);

      this.inputElements = [];
      this.containerElements.forEach(container => {
        const input = DOMTraverse.findDescendant(
          container,
          element => (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA'),
          false
        );
        if (input !== false)
          this.inputElements.push(input as HTMLInputElement | HTMLTextAreaElement);
      });
    }
  }

  public initialize() {
    this.inputElements.forEach(input => {
      let containerElement = DOMTraverse.findAncestorWithClass(
        input, this.config.containerClassName, false
      );
      if (containerElement !== false) {
        containerElement = containerElement as HTMLElement;
        if (this.config.conditionActivate(containerElement, input) === true) {
          if (this.isActive(containerElement) === false)
            this.activate(containerElement, input);
        } else {
          if (this.isActive(containerElement) === true)
            this.deactivate(containerElement, input);
        }
      }
    });
  }

  private async activate(container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement): Promise<void> {
    await this.config.beforeActivate(container, input);
    await this.config.activate(container, input, this.config.activeClassName);
    return this.config.afterActivate(container, input);
  }

  private async deactivate(container: HTMLElement, input: HTMLInputElement | HTMLTextAreaElement): Promise<void> {
    await this.config.beforeDeactivate(container, input);
    await this.config.deactivate(container, input, this.config.activeClassName);
    return this.config.afterDeactivate(container, input);
  }

  private getInputActiveManagerElement(input: HTMLInputElement | HTMLTextAreaElement): HTMLElement | false {
    const { containerClassName } = this.config;
    const result = DOMTraverse.findAncestorWithClass(
      input, containerClassName, false,
    );
    return (result !== false) ? result as HTMLElement : false;
  }

  private eventHandlerFocus = event => {
    const containerElement = this.getInputActiveManagerElement(event.target);
    if (containerElement !== false) {
      this.config.onFocus(containerElement, event.target, this);
      if (this.config.activateOnFocus === true)
        if (this.isActive(containerElement as HTMLElement) === false)
          this.activate(containerElement, event.target);
    }
  }

  private eventHandlerBlur = event => {
    let containerElement = this.getInputActiveManagerElement(event.target);
    if (containerElement !== false) {
      containerElement = containerElement as HTMLElement;
      this.config.onBlur(containerElement, event.target, this);
      if (this.config.activateOnFocus === true) {   
        if (
          this.config.conditionActivate(containerElement, event.target) === false
          && this.isActive(containerElement) === true
        )
          this.deactivate(containerElement, event.target);
      }
    } // If container element is valid.
  }

  private eventHandlerInput = event => {
    let containerElement = this.getInputActiveManagerElement(event.target);
    if (containerElement !== false) {
      containerElement = containerElement as HTMLElement;
      this.config.onInput(containerElement, event.target, this);
      if (this.config.activateOnFocus === false) {
        if (
          this.config.conditionActivate(containerElement, event.target) === true
          && this.isActive(containerElement) === false
        ) {
          this.activate(containerElement, event.target);
        } else {
          if (this.isActive(containerElement) === true)
            this.deactivate(containerElement, event.target);
        }
      }
    } // if containerElement is valid
  }

  private isActive(containerElement: HTMLElement): boolean {
    return containerElement.classList.contains(this.config.activeClassName);
  }

  public listen() {
    this.inputElements.forEach(input => {
      input.addEventListener('focus', this.eventHandlerFocus);
    });
    this.inputElements.forEach(input => {
      input.addEventListener('blur', this.eventHandlerBlur);
    });
    this.inputElements.forEach(input => {
      input.addEventListener('input', this.eventHandlerInput);
    });
  }

  public stop() {
    this.inputElements.forEach(input => {
      input.removeEventListener('focus', this.eventHandlerFocus);
    });
    this.inputElements.forEach(input => {
      input.removeEventListener('blur', this.eventHandlerBlur);
    });
    this.inputElements.forEach(input => {
      input.removeEventListener('input', this.eventHandlerInput);
    });
  }
}
