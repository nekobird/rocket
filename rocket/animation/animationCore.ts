import {
  Num,
} from '../rocket'

import {
  Animation,
} from './animation'

import {
  AnimationConfig,
} from './animationConfig'

export class AnimationCore {
  public isActive   : boolean = false
  public isAnimating: boolean = false
  public isPaused   : boolean = false
  public isReversed : boolean = false

  public iterationCount: number = 0

  private direction: boolean = true

  private progress: number

  private startTime: number
  private endTime  : number
  private pauseTime: number

  private RAFID    : number
  private timeoutID: number

  public animation: Animation
  public callback: Function

  constructor(animation?: Animation) {
    this.animation = animation
  }

  // 1)
  public startWithDelay(delay?: number): Promise<void> {
    // This is only called when not animating.
    this.isActive = true

    if (typeof delay !== 'number') {
      delay = this.animation.config.delay
    }

    if (delay > 0) {
      return this.animation.config
        .beforeStartWithDelay(
          this.animation,
          this.animation.config.dataExport
        )
        .then(() => {
          this.runCallback('onStart')
          this.timeoutID = setTimeout(
            this.start,
            delay * 1000
          )    
        })
        .catch(() => {
          this.end()
        })
    } else {
      return this.animation.config
        .beforeStart(
          this.animation,
          this.animation.config.dataExport
        )
        .then(() => {
          this.runCallback('onStart')
          this.start()
        })
        .catch(() => {
          this.end()
        })
    }
  }

  // 2) Start Animation.
  public start = () => {
    this.isActive = true

    // Set starting direction.
    if (this.isReversed === true) {
      this.direction = false
    }

    if (this.isPaused === true) {
      const startTimeDelta = this.pauseTime - this.startTime
      const endTimeDelta   = this.endTime   - this.pauseTime

      const now = Date.now()

      this.startTime = now - startTimeDelta
      this.endTime   = now + endTimeDelta

      this.isPaused = false
    } else {
      this.startTime = Date.now()
      this.endTime   = this.startTime + (this.animation.config.duration * 1000)
    }

    this.isAnimating = true
    this.animation.config
      .beforeIterationStart(
        this.animation,
        this.animation.config.dataExport
      )
      .then(() => {
        this.runCallback('onIterationStart')
        this.loop()    
      })
  }

  public pause(): this {
    if (
      this.isActive    === true &&
      this.isAnimating === true &&
      this.isPaused    === false
    ) {
      this.clearSessions()
      this.isAnimating = false
      this.isPaused    = true
      this.pauseTime   = Date.now()
    }
    return this
  }

  public reset(): this {
    this.clearSessions()

    this.isActive    = false
    this.isAnimating = false
    this.isPaused    = false

    this.direction = true

    this.iterationCount = 0

    this.startTime = 0
    this.endTime   = 0
    this.pauseTime = 0
    this.progress  = 0
    return this
  }

  public end(): this {
    this.reset()
    this.runCallback('onComplete')
    this.animation.config.callback()
    if (typeof this.callback === 'function') {
      this.callback()
    }
    return this
  }

  // 3)
  private loop(): this {
    const frame = () => {

      // Tick, this also moves progress forward!
      this.tick()

      if (
        this.isActive    === true &&
        this.isAnimating === true &&
        this.isPaused    === false
      ) {
        if (this.progress < 1) {
          this.loop()
          return
        } else {
          // END ITERATION
          this.iterationCount++
          this.runCallback('onIterationComplete')

          // End animation if exceeds config.numberOfIterations
          if (
            typeof this.animation.config.numberOfIterations === 'number' &&
            this.iterationCount >= this.animation.config.numberOfIterations
          ) {
            this.end()
            return
          }

          // Continue animation.
          this.animation.config
            .beforeSubsequentIteration(
              this.animation,
              this.animation.config.dataExport
            )
            .then(resolve => {
              // Toggle direction if it's alternating.
              if (this.animation.config.alternate === true) {
                this.toggleDirection()
              }
              this.startWithDelay(this.animation.config.iterationDelay)
            })
            .catch(() => {
              this.end()
            })
        }
      }

    } // End frame.

    // Go!
    this.RAFID = window.requestAnimationFrame(frame)
    return this
  }

  // 4)
  private tick(): this {
    // Update progress.
    this.progress = this.currentNValue
    const config: AnimationConfig = this.animation.config

    // Modify N based on TimingFunction.
    let n = config.timingFunction(this.progress)

    // Reverse N depending on current direction.
    if (this.direction === false) {
      n = 1 - n
    }

    // Tick.
    if (typeof config.onTick === 'function') {
      config.onTick(n, this.iterationCount, this.animation, config.dataExport)
    } else if (Array.isArray(config.onTick)) {
      config.onTick.forEach(tick => {
        tick(n, this.iterationCount, this.animation, config.dataExport)
      })
    }

    return this
  }

  // HELPER

  // Get current N value
  get currentNValue(): number {
    return Num.modulate(
      Date.now(),
      [this.startTime, this.endTime],
      1, true
    )
  }

  private toggleDirection(): this {
    this.direction = !this.direction
    return this
  }

  private clearSessions(): this {
    clearTimeout(this.timeoutID)
    window.cancelAnimationFrame(this.RAFID)
    return this
  }

  // CALLBACK

  public runCallback(callbackName: string): this {
    const config: AnimationConfig = this.animation.config
    if (typeof config[callbackName] === 'function') {
      config[callbackName](this.animation, config.dataExport)
    } else if (Array.isArray(config[callbackName])) {
      config[callbackName].forEach(callback => {
        callback(this.animation, config.dataExport)
      })
    }
    return this
  }

}