import {
  Num,
} from '../rocket'

import {
  AnimationConfig,
  DEFAULT_ANIMATION_CONFIG,
} from './animationConfig'

export class Animation {

  // STATES
  public isActive: boolean = false
  public isAnimating: boolean = false
  public isPaused: boolean = false
  public isReversed: boolean = false

  public iterationCount: number = 0

  private direction: boolean = true

  private progress: number

  private startTime: number
  private pauseTime: number
  private endTime: number

  private RAFID: number
  private timeoutID

  public config: AnimationConfig

  constructor(config?: AnimationConfig) {
    this.config = Object.assign({}, DEFAULT_ANIMATION_CONFIG)
    this.setConfig(config)
    return this
  }

  public setConfig(config: AnimationConfig): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config)
    }
    return this
  }

  public goToBeginning(): this {
    if (typeof this.config.onTick === 'function') {
      this.config.onTick(0, this, undefined)
    } else if (Array.isArray(this.config.onTick)) {
      this.config.onTick.forEach(tick => {
        tick(0, this, undefined)
      })
    }
    return this
  }

  public goToEnd(): this {
    if (typeof this.config.onTick === 'function') {
      this.config.onTick(1, this, undefined)
    } else if (Array.isArray(this.config.onTick)) {
      this.config.onTick.forEach(tick => {
        tick(1, this, undefined)
      })
    }
    return this
  }

  public reset(): this {
    this.clearSessions()
    this.isActive = false
    this.isAnimating = false
    this.isPaused = false
    this.direction = true
    this.iterationCount = 0
    this.startTime = 0
    this.pauseTime = 0
    this.endTime = 0
    this.progress = 0
    return this
  }

  public pause(): this {
    if (
      this.isActive === true &&
      this.isAnimating == true &&
      this.isPaused === false
    ) {
      this.clearSessions()
      this.isAnimating = false
      this.isPaused = true
      this.pauseTime = Date.now()
    }
    return this
  }

  public stop(): this {
    this.reset()
    this.callHook('onComplete')
    this.config.callback()
    return this
  }

  public stopAndJumptToEnd(): this {
    this
      .reset()
      .goToEnd()
      .callHook('onComplete')
    this.config.callback()
    return this
  }

  public stopAndJumpToBeginning(): this {
    this
      .reset()
      .goToBeginning()
      .callHook('onComplete')
    this.config.callback()
    return this
  }

  // A
  public play(delay: number): this {
    this.callHook('onStart')

    // This is only called when it's not animating
    this.isActive = true

    if (typeof delay !== 'number') {
      delay = this.config.delay
    }

    this.timeoutID = setTimeout(
      this.start.bind(this),
      delay * 1000
    )
    return this
  }

  // B, Similar to play but without the delay :D
  public start(): this {
    this.isActive = true

    // Set beginning direction
    if (this.isReversed === true) {
      this.direction = false
    }

    // Handle pause
    if (this.isPaused === true) {
      const startTimeDelta = this.pauseTime - this.startTime
      const endTimeDelta = this.endTime - this.pauseTime

      const now = Date.now()

      this.startTime = now - startTimeDelta
      this.endTime = now + endTimeDelta

      this.isPaused = false
    } else {
      this.startTime = Date.now()
      this.endTime = this.startTime + (this.config.duration * 1000)
    }

    this.isAnimating = true

    this.callHook('onIterationStart')

    // Begin loop
    this.loop()
    return this
  }

  // C
  private loop(): this {
    let frame = () => {

      // Tick, this also moves progress forward!
      this.tick()

      if (
        this.isActive === true &&
        this.isAnimating === true &&
        this.isPaused === false
      ) {
        if (this.progress < 1) {
          this.loop()
          return
        } else {
          // End iteration.
          this.iterationCount++
          this.callHook('onIterationComplete')

          // Stop animation if exceeds number of iterations.
          // End animation if iteration count reach number of iterations.
          if (
            typeof this.config.numberOfIterations === 'number' &&
            this.iterationCount >= this.config.numberOfIterations
          ) {
            this.stop()
            return
          }

          // Continue playing!
          // The cycle begins again.
          // Toggle direction if it's alternating.
          if (this.config.alternate === true) { this.toggleDirection() }
          this.play(this.config.iterationDelay)
        }
      }

    } // End frame.

    // Go!
    this.RAFID = window.requestAnimationFrame(frame)
    return this
  }

  // D
  private tick(): this {
    // Update progress.
    this.progress = this.currentNValue

    // Modify N based on TimingFunction.
    let n = this.config.timingFunction(
      this.progress
    )

    // Reverse N depending on current direction.
    if (this.direction === false) {
      n = 1 - n
    }

    // Tick
    if (typeof this.config.onTick === 'function') {
      this.config.onTick(n, this, this.config.dataExport)
    } else if (Array.isArray(this.config.onTick)) {
      this.config.onTick.forEach(tick => {
        tick(n, this, this.config.dataExport)
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

  private clearSessions(): this {
    clearTimeout(this.timeoutID)
    window.cancelAnimationFrame(this.RAFID)
    return this
  }

  private toggleDirection(): this {
    this.direction = !this.direction
    return this
  }

  // CALLBACK

  private callHook(hookName: string): this {
    if (typeof this.config[hookName] === 'function') {
      this.config[hookName](this)
    } else if (Array.isArray(this.config[hookName])) {
      this.config[hookName].forEach(callback => callback(this))
    }
    return this
  }

}