// Snake engine — verbatim port of original `nl` (grid), `rl` (snake), `il` (engine).
export const EMPTY = 0
export const BODY = 1
export const HEAD = 2
export const FOOD = 3

class Grid {
  constructor(cols, rows) {
    this.cols = cols
    this.rows = rows
    this.cells = new Uint8Array(cols * rows)
  }
  resize(cols, rows) {
    this.cols = cols
    this.rows = rows
    this.cells = new Uint8Array(cols * rows)
  }
  get(x, y) {
    return this.cells[y * this.cols + x]
  }
  set(x, y, v) {
    this.cells[y * this.cols + x] = v
  }
  reset() {
    this.cells.fill(EMPTY)
  }
}

class Snake {
  constructor(startPoint, startingLength = 3) {
    this.body = []
    this.startingLength = startingLength
    this.startPoint = startPoint
    this.reset()
  }
  reset() {
    this.body = [this.startPoint]
    for (let i = 1; i < this.startingLength; i += 1) {
      this.body.push([this.startPoint[0] - i, this.startPoint[1]])
    }
  }
  step(dir, grow) {
    this.body.unshift([this.head[0] + dir[0], this.head[1] + dir[1]])
    if (!grow) this.body.pop()
  }
  get head() {
    return this.body[0]
  }
  get tail() {
    return this.body[this.body.length - 1]
  }
}

export class SnakeEngine {
  constructor(cols, rows) {
    this.cols = cols
    this.rows = rows
    this.direction = [1, 0]
    this.grid = new Grid(cols, rows)
    this.snake = new Snake([10, 10], 5)
    this.resetGame()
    this.stepListeners = new Set()
    this.scoreListeners = new Set()
    this.loseListeners = new Set()
    this.stepDuration = 200
    this.stepId = 0
    this.score = 0
    this.currentStep = 0
  }
  resetGame() {
    this.grid.reset()
    this.snake.reset()
    this.direction = [1, 0]
    this.currentStep = 0
    this.score = 0
    this.stepDuration = 200
    this.spawnFood()
  }
  start() {
    this.stepId = setTimeout(() => this.step(), this.stepDuration)
  }
  stop() {
    clearTimeout(this.stepId)
  }
  resize(cols, rows) {
    this.cols = cols
    this.rows = rows
    this.grid.resize(cols, rows)
    this.resetGame()
  }
  setDirection(d) {
    let n
    if (d === 'up') n = [0, -1]
    else if (d === 'down') n = [0, 1]
    else if (d === 'left') n = [-1, 0]
    else n = [1, 0]
    if (n[0] + this.direction[0] !== 0 && n[1] + this.direction[1] !== 0) this.direction = n
  }
  step() {
    this.currentStep += 1
    const head = [this.snake.head[0] + this.direction[0], this.snake.head[1] + this.direction[1]]
    if (head[0] < 0 || head[0] >= this.cols || head[1] < 0 || head[1] >= this.rows) {
      this.lose()
      return
    }
    switch (this.grid.get(...head)) {
      case FOOD:
        this.score += 1
        this.scoreListeners.forEach((cb) => cb(this.score))
        this.stepDuration = Math.max(80, this.stepDuration - 5)
        this.snake.step(this.direction, true)
        this.grid.set(...this.snake.head, BODY)
        this.spawnFood()
        break
      case EMPTY:
        this.grid.set(...this.snake.tail, EMPTY)
        this.grid.set(...this.snake.head, HEAD)
        this.snake.step(this.direction, false)
        this.grid.set(...this.snake.head, BODY)
        break
      case HEAD:
      case BODY:
      default:
        this.lose()
        return
    }
    this.stepListeners.forEach((cb) => cb(this.grid))
    this.stepId = setTimeout(() => this.step(), this.stepDuration)
  }
  spawnFood() {
    const x = Math.floor(Math.random() * this.cols)
    const y = Math.floor(Math.random() * this.rows)
    if (this.grid.get(x, y) === EMPTY) this.grid.set(x, y, FOOD)
    else this.spawnFood()
  }
  lose() {
    this.stop()
    this.loseListeners.forEach((cb) => cb())
  }
  onStep(cb) {
    this.stepListeners.add(cb)
    return () => this.stepListeners.delete(cb)
  }
  onLose(cb) {
    this.loseListeners.add(cb)
    return () => this.loseListeners.delete(cb)
  }
  onScore(cb) {
    this.scoreListeners.add(cb)
    return () => this.scoreListeners.delete(cb)
  }
}
