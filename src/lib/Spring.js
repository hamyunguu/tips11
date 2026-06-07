import { expLerp } from './math.js'

// Critically-damped exponential smoothing (original `Ee`).
export class Spring {
  constructor(value = 0, target = 0, opts) {
    this.value = value
    this.target = target
    this.stiffness = opts?.stiffness ? opts.stiffness * 10 : 10
  }
  setTarget(t) {
    this.target = t
  }
  setPosition(v) {
    this.value = v
  }
  skipToTarget(v) {
    if (v !== undefined) this.target = v
    this.value = this.target
  }
  update(dt) {
    this.value = expLerp(this.value, this.target, this.stiffness, dt)
    if (Math.abs(this.value - this.target) < 1e-4) this.value = this.target
  }
}
