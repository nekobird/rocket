import {
  Num,
} from '../Rocket'

interface AnimationConfig {
  alternate: boolean,
  delay: number,
  duration: number,
  exports: any,
  numberOfIterations: number | 'infinite',
  onComplete: Function | Array<Function>,
  onStart: Function | Array<Function>,
  onIterationComplete: Function | Array<Function>,
  onIterationStart: Function | Array<Function>,
  onTick: Function | Array<Function>,
  timingFunction: Function,
}

export class Animation {

  // STATES
  public isActive: boolean = false
  public isAnimating: boolean = false
  public isPaused: boolean = false
  public isReversed: boolean = false

  public alternate: boolean = false
  public delay: number = 0 // Delay before animation starts.
  public duration: number = 2 // In seconds.

  public iterationDelay = 0 // Delay before next iteration.
  public numberOfIterations = 1 // number | 'infinite'

  public iterationCount: number = 0

  public exports: any = undefined

  public timingFunction: Function = t => {
    return t
  }

  // HOOKS
  public onStart: Function | Array<Function> = () => { }
  public onComplete: Function | Array<Function> = () => { }

  public onIterationStart: Function | Array<Function> = () => { }
  public onIterationComplete: Function | Array<Function> = () => { }

  public callback: Function = () => { }
  public onTick: Function | Array<Function> = (n, fn, data) => { }

  private direction: boolean = true
  private progress: number

  private startTime: number
  private pauseTime: number
  private endTime: number

  private RAFID: number
  private timeoutID

  constructor(config?: AnimationConfig) {
    this.config = config
    return this
  }

  set config(config: AnimationConfig) {
    Object.assign(this, config)
  }

  public goToBeginning(): Animation {
    if (typeof this.onTick === 'function') {
      this.onTick(0, this, undefined)
    } else if (this.onTick.constructor === Array) {
      for (let onTick of this.onTick) {
        onTick(0, this, undefined)
      }
    }
    return this
  }

  public goToEnd(): Animation {
    if (typeof this.onTick === 'function') {
      this.onTick(1, this, undefined)
    } else if (this.onTick.constructor === Array) {
      for (let onTick of this.onTick) {
        onTick(1, this, undefined)
      }
    }
    return this
  }

  public reset(): Animation {
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

  public pause(): Animation {
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

  public stop(): Animation {
    this.reset()
    this.callOnComplete()
    this.callback()
    return this
  }

  public stopAndJumptToEnd(): Animation {
    this
      .reset()
      .goToEnd()
      .callOnComplete()
      .callback()
    return this
  }

  public stopAndJumpToBeginning(): Animation {
    this
      .reset()
      .goToBeginning()
      .callOnComplete()
      .callback()
    return this
  }

  // A
  public play(delay: number): Animation {
    this.callOnStart()

    // This is only called when it's not animating.
    this.isActive = true

    if (typeof delay !== 'number') {
      delay = this.delay
    }

    this.timeoutID = setTimeout(
      this.start.bind(this),
      delay * 1000
    )
    return this
  }

  // B, Similar to play but without the delay :D.
  public start(): Animation {
    this.isActive = true

    // Set beginning direction.
    if (this.isReversed === true) {
      this.direction = false
    }

    // Handle pause.
    if (this.isPaused === true) {
      let startTimeDelta = this.pauseTime - this.startTime
      let endTimeDelta = this.endTime - this.pauseTime

      let now = Date.now()

      this.startTime = now - startTimeDelta
      this.endTime = now + endTimeDelta

      this.isPaused = false
    } else {
      this.startTime = Date.now()
      this.endTime = this.startTime + (this.duration * 1000)
    }

    this.isAnimating = true

    this.callOnIterationStart()

    // Begin loop.
    this.loop()
    return this
  }

  // C
  private loop(): Animation {
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
          this.callOnIterationComplete()

          // Stop animation if exceeds number of iterations.
          // End animation if iteration count reach number of iterations.
          if (
            typeof this.numberOfIterations === 'number' &&
            this.iterationCount >= this.numberOfIterations
          ) {
            this.stop()
            return
          }

          // Continue playing!
          // The cycle begins again.
          // Toggle direction if it's alternating.
          if (this.alternate === true) {
            this.toggleDirection()
          }
          this.play(this.iterationDelay)
        }
      }

    } // End frame.

    // Go!
    this.RAFID = window.requestAnimationFrame(frame)
    return this
  }

  // D
  private tick(): Animation {
    // Update progress.
    this.progress = this.currentNValue

    // Modify N based on TimingFunction.
    let n = this.timingFunction(
      this.progress
    )

    // Reverse N depending on current direction.
    if (this.direction === false) {
      n = 1 - n
    }

    // Tick.
    if (typeof this.onTick === 'function') {
      this.onTick(
        n, this.iterationCount, this.exports
      )
    } else if (this.onTick.constructor === Array) {
      for (let onTick of this.onTick) {
        onTick(
          n, this.iterationCount, this.exports
        )
      }
    }

    return this
  }

  // HELPERS

  // Get current N value.
  get currentNValue(): number {
    return Num.modulate(
      Date.now(),
      [this.startTime, this.endTime],
      1, true
    )
  }

  clearSessions(): Animation {
    clearTimeout(this.timeoutID)
    window.cancelAnimationFrame(this.RAFID)
    return this
  }

  toggleDirection(): Animation {
    this.direction = !this.direction
    return this
  }

  // CALLBACKS

  private callOnStart(): Animation {
    if (typeof this.onStart === 'function') {
      this.onStart(this)
    } else if (this.onStart.constructor === Array) {
      for (let callback of this.onStart) {
        callback(this)
      }
    }
    return this
  }

  private callOnComplete(): Animation {
    if (typeof this.onComplete === 'function') {
      this.onComplete(this)
    } else if (this.onComplete.constructor === Array) {
      for (let callback of this.onComplete) {
        callback(this)
      }
    }
    return this
  }

  private callOnIterationStart(): Animation {
    if (typeof this.onIterationStart === 'function') {
      this.onIterationStart(this)
    } else if (this.onIterationStart.constructor === Array) {
      for (let callback of this.onIterationStart) {
        callback(this)
      }
    }
    return this
  }

  private callOnIterationComplete(): Animation {
    if (typeof this.onIterationComplete === 'function') {
      this.onIterationComplete(this)
    } else if (this.onIterationComplete.constructor === Array) {
      for (let callback of this.onIterationComplete) {
        callback(this)
      }
    }
    return this
  }

}