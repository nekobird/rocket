import {
  Num,
} from '../Rocket'

// AnimationProperties
// alternate
// delay
// duration
// exports
// numberOfIterations: number | 'infinite'
// onComplete
// onStart
// onIterationComplete
// onIterationStart
// onTick
// timingFunction

export class Animation {

  constructor(properties) {
    // STATES
    this.isActive = false
    this.isAnimating = false
    this.isPaused = false
    this.isReversed = false

    this.alternate = false
    this.delay = 0 // Delay before animation starts.
    this.duration = 2 // In seconds.

    this.iterationCount = 0
    this.iterationDelay = 0 // Delay before next iteration.
    this.numberOfIterations = 1 // number | 'infinite'

    this.exports = 0

    this.timingFunction = t => {
      return t
    }

    // HOOKS
    this.onStart = () => {}
    this.onComplete = () => {}

    this.onIterationStart = () => {}
    this.onIterationComplete = () => {}

    this.callback = () => {}
    this.onTick = (n, fn, data) => {}

    this.direction = true
    this.progress

    this.startTime
    this.pauseTime
    this.endTime

    this.RAFID
    this.timeoutID

    this.properties = properties
    return this
  }

  set properties(properties) {
    for (let key in properties) {
      this[key] = properties[key]
    }
  }

  goToBeginning() {
    if (typeof this.onTick === 'function') {
      this.onTick(0, this, undefined)
    } else if (this.onTick.constructor === Array) {
      for (let onTick of this.onTick) {
        onTick(0, this, undefined)
      }
    }
    return this
  }

  goToEnd() {
    if (typeof this.onTick === 'function') {
      this.onTick(1, this, undefined)
    } else if (this.onTick.constructor === Array) {
      for (let onTick of this.onTick) {
        onTick(1, this, undefined)
      }
    }
    return this
  }

  reset() {
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

  pause() {
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

  stop() {
    this
      .reset()
      .callOnComplete()
      .callback()
    return this
  }

  stopAndJumptToEnd() {
    this
      .reset()
      .goToEnd()
      .callOnComplete()
      .callback()
    return this
  }

  stopAndJumpToBeginning() {
    this
      .reset()
      .goToBeginning()
      .callOnComplete()
      .callback()
    return this
  }

  // A
  play(delay) {
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
  start() {
    this.isActive = true

    // Set beginning direction.
    if (this.isReversed === true) {
      this.direction = false
    }

    // If it's paused.
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
  loop() {
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
  tick() {
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
  get currentNValue() {
    return Num.modulate(
      Date.now(),
      [this.startTime, this.endTime],
      1, true
    )
  }

  clearSessions() {
    clearTimeout(this.timeoutID)
    window.cancelAnimationFrame(this.RAFID)
    return this
  }

  toggleDirection() {
    this.direction = !this.direction
    return this
  }

  // CALLBACKS

  callOnStart() {
    if (typeof this.onStart === 'function') {
      this.onStart(this)
    } else if (this.onStart.constructor === Array) {
      for (let onStart of this.onStart) {
        onStart(this)
      }
    }
    return this
  }

  callOnComplete() {
    if (typeof this.onComplete === 'function') {
      this.onComplete(this)
    } else if (this.onComplete.constructor === Array) {
      for (let onComplete of this.onComplete) {
        onComplete(this)
      }
    }
    return this
  }

  callOnIterationStart() {
    if (typeof this.onIterationStart === 'function') {
      this.onIterationStart(this)
    } else if (this.onIterationStart.constructor === Array) {
      for (let onIterationStart of this.onIterationStart) {
        onIterationStart(this)
      }
    }
    return this
  }

  callOnIterationComplete() {
    if (typeof this.onIterationComplete === 'function') {
      this.onIterationComplete(this)
    } else if (this.onIterationComplete.constructor === Array) {
      for (let onIterationComplete of this.onIterationComplete) {
        onIterationComplete(this)
      }
    }
    return this
  }

}