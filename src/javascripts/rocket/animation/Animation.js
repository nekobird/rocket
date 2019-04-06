import {
  Num,
} from '../Rocket'

// AnimationProperties
// alternate
// delay
// duration
// exports
// numberOfIterations: number | 'infinite'
// onAnimationEnd
// onAnimationStart
// onIterationEnd
// onIterationStart
// onTick
// timingFunction

export class Animation {

  constructor(properties) {
    this.alternate = false
    this.delay = 0 // Delay before animation starts.
    this.duration = 2 // In seconds.

    // STATES
    this.isActive = false
    this.isAnimating = false
    this.isPaused = false
    this.isReversed = false

    this.iterationCount = 0
    this.iterationDelay = 0 // Delay before next iteration.
    this.numberOfIterations = 1

    this.exports = 0

    this.timingFunction = (t) => { return t }

    // HOOKS
    this.onAnimationStart = () => { }
    this.onAnimationEnd = () => { }
    this.onIterationEnd = () => { }
    this.onIterationStart = () => { }
    this.callback = () => { }
    this.onTick = (n, fn, data) => { }

    this.currentDirection = true
    this.currentProgress

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
    }
    else if (this.onTick.constructor === Array) {
      for (let onTick of this.onTick) {
        onTick(0, this, undefined)
      }
    }
    return this
  }

  goToEnd() {
    if (typeof this.onTick === 'function') {
      this.onTick(1, this, undefined)
    }
    else if (this.onTick.constructor === Array) {
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

    this.currentDirection = true

    this.iterationCount = 0

    this.startTime = 0
    this.pauseTime = 0
    this.endTime = 0

    this.currentProgress = 0
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
      .callOnAnimationEnd()
      .callback()
    return this
  }

  stopAndJumptToEnd() {
    this
      .reset()
      .goToEnd()
      .callOnAnimationEnd()
      .callback()
    return this
  }

  stopAndJumpToBeginning() {
    this
      .reset()
      .goToBeginning()
      .callOnAnimationEnd()
      .callback()
    return this
  }

  // A
  play(delay) {
    this.callOnAnimationStart()

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
      this.currentDirection = false
    }

    // If it's paused.
    if (this.isPaused === true) {
      let startTimeDelta = this.pauseTime - this.startTime
      let endTimeDelta = this.endTime - this.pauseTime

      let now = Date.now()

      this.startTime = now - startTimeDelta
      this.endTime = now + endTimeDelta

      this.isPaused = false
    }
    // If it's not paused.
    else {
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
    let frame = function () {

      // Tick, this also moves progress forward!
      this.tick()

      if (
        this.isActive === true &&
        this.isAnimating === true &&
        this.isPaused === false
      ) {

        if (this.currentProgress < 1) {
          // Loop again!
          this.loop()
          // Break here!
          return
        } else {
          // End iteration.
          this.iterationCount++
          this.callOnIterationEnd()

          // Stop animation if exceeds number of iterations.
          if (
            typeof this.numberOfIterations === 'number' &&
            this.iterationCount >= this.numberOfIterations
          ) {
            // End animation if iteration count reach number of iterations.
            this.stop()
            // Break function!
            return
          }

          // Toggle direction if it's alternating.
          if (
            this.alternate === true &&
            this.iterationCount % 2 !== 0
          ) {
            this.toggleDirection()
          }

          // Continue playing!
          // The cycle begins again.
          this.play(this.iterationDelay)
        }

      } // End if active, animating, and not paused.

    } // End frame.

    // Go!
    this.RAFID = window.requestAnimationFrame(
      frame.bind(this)
    )

    return this
  }

  // D
  tick() {
    // Update currentProgress.
    this.currentProgress = this.currentNValue

    // Modify N based on TimingFunction.
    let n = this.timingFunction(
      this.currentProgress
    )

    // Reverse N depending on current direction.
    if (this.currentDirection === false) {
      n = 1 - n
    }

    // Tick.
    if (typeof this.onTick === 'function') {
      this.onTick(
        n, this.iterationCount, this.exports
      )
    }
    else if (this.onTick.constructor === Array) {
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
    this.currentDirection = !this.currentDirection
    return this
  }

  // CALLBACKS

  callOnAnimationStart() {
    if (typeof this.onAnimationStart === 'function') {
      this.onAnimationStart(this)
    }
    else if (this.onAnimationStart.constructor === Array) {
      for (let onAnimationStart of this.onAnimationStart) {
        onAnimationStart(this)
      }
    }
    return this
  }

  callOnAnimationEnd() {
    if (typeof this.onAnimationEnd === 'function') {
      this.onAnimationEnd(this)
    }
    else if (this.onAnimationEnd.constructor === Array) {
      for (let onAnimationEnd of this.onAnimationEnd) {
        onAnimationEnd(this)
      }
    }
    return this
  }

  callOnIterationStart() {
    if (typeof this.onIterationStart === 'function') {
      this.onIterationStart(this)
    }
    else if (this.onIterationStart.constructor === Array) {
      for (let onIterationStart of this.onIterationStart) {
        onIterationStart(this)
      }
    }
    return this
  }

  callOnIterationEnd() {
    if (typeof this.onIterationEnd === 'function') {
      this.onIterationEnd(this)
    }
    else if (this.onIterationEnd.constructor === Array) {
      for (let onIterationEnd of this.onIterationEnd) {
        onIterationEnd(this)
      }
    }
    return this
  }

}