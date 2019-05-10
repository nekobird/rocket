import {
  Identifier,
  SensorEventName,
  SensorData,
} from './sensorHub'


export class MouseTouchEvent {

  public identifier: Identifier

  public downData: SensorData
  public dragData: SensorData
  public upData  : SensorData
  public cancelData?: SensorData

  public isCancelled: boolean = false

  constructor(initialData: SensorData) {
    if (initialData.name === 'down') {
      this.identifier = initialData.identifier
      this.downData   = initialData
    }
  }
  
  public get duration(): number | undefined {
    if (typeof this.downData === 'object') {
      if (this.isCancelled === true) {
        return this.cancelData.time - this.downData.time
      }
      return this.upData.time - this.downData.time
    }
    return undefined
  }

  public update(data: SensorData): this {
    switch (data.name) {
      case 'drag': {
        this.dragData = data
        break
      }
      case 'up': {
        this.upData = data
        break
      }
      case 'cancel': {
        this.cancelData  = data
        this.isCancelled = true
        break
      }
    }
    return this
  }
}