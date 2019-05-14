export interface FormDataConfig {
  trimValue?: boolean,
  inputSelector?: string,

  useCustomInput?: boolean,
  customInputSelector?: string,
  getValueFromCustomInput?: Function,
}

export const FORMDATA_DEFAULT_CONFIG: FormDataConfig = {
  trimValue: true,

  inputSelector: '.input',
  
  useCustomInput: false,
  customInputSelector: '',
  getValueFromCustomInput: (customInput: HTMLElement) => {
    return ''
  },

}

// Type Data = field: string

const INPUT_TYPES_VALUE = [
  'color',
  'date',
  'datetime-local',
  'email',
  'month',
  'number',
  'password',
  'range',
  'search',
  'tel',
  'text',
  'time',
  'url',
  'week',
]

const INPUT_TYPES_CHECKED = [
  'checkbox',
  'radio'
]

export class FormData {

  public config: FormDataConfig

  public data

  public inputElements: HTMLElement[]
  public customInputElements: HTMLElement[]

  constructor() {
    this.config = Object.assign({}, FORMDATA_DEFAULT_CONFIG)
  }

  public setConfig(config: FormDataConfig) {
    Object.assign(this.config, config)
  }

  public initialize(): this {
    this.getElements()
    return this
  }

  public getElements(): this {
    // Input elements
    const inputElements: NodeListOf<HTMLElement> = document.querySelectorAll(
      this.config.customInputSelector
    )
    this.inputElements = (inputElements !== null) ? Array.from(inputElements) : []
    if (this.config.useCustomInput === true) {
      // Custom input elements
      const customInputElements: NodeListOf<HTMLElement> = document.querySelectorAll(
        this.config.customInputSelector
      )
      this.customInputElements = (customInputElements !== null) ? Array.from(customInputElements) : []
    }
    return this
  }

  public addData(field: string, value: string | string[], overwrite: boolean = false) {
    if (typeof this.data[field] !== 'undefined') {
      this.data[field] = value
    } else {

    }
  }

  public getInputValues(): this {
    this.inputElements.forEach(input => {
      if (input.nodeName === 'INPUT') {

        if (
          INPUT_TYPES_VALUE.indexOf(input.getAttribute('type')) !== 1
        ) {
          this.addData(
            input.getAttribute('name'),
            (<HTMLInputElement>input).value,
            true
          )
        } else if (
          (
            input.getAttribute('type') === 'radio' ||
            input.getAttribute('type') === 'checkbox'
          ) &&
          (<HTMLInputElement>input).checked === true
        ) {
          const overwrite: boolean = input.getAttribute('type') === 'radio'
          this.addData(
            input.getAttribute('name'),
            (<HTMLInputElement>input).value,
            overwrite
          )
        } // input type

      } else if (input.nodeName === 'TEXTAREA') {
        this.addData(
          input.getAttribute('name'),
          (<HTMLTextAreaElement>input).value
        )
      } else if (input.nodeName === 'SELECT') {
        this.getDataFromSelect(<HTMLSelectElement>input)
      }

    })
    return this
  }

  private getDataFromSelect(select: HTMLSelectElement): string | string[] {
    const options: HTMLCollection = select.children
    const isMultiple: boolean = (select.multiple === true)
    const values: string[] = []
    Array.from(options).forEach((child: HTMLOptionElement) => {
      if (
        child.nodeName === 'OPTION' &&
        child.selected === true
      ) {
        values.push(child.value)
      }
    })
    if (isMultiple === true) {
      return values[0]
    }
    return values
  }
}