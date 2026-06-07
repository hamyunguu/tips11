import { useCallback, useEffect, useRef, useState } from 'react'
import { cx } from '../../lib/cx.js'
import { playSound } from '../../audio/sounds.js'
import { SnakeEngine, EMPTY, BODY, HEAD, FOOD } from './snakeEngine.js'

// Snake mini-game (original `al`).
export default function Snake({ onQuit }) {
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState('pre') // pre | playing | gameover
  const CELL = 20
  const GAP = 6
  const COLOR = '#ffa621'
  const engine = useRef(new SnakeEngine(50, 50)).current
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)

  const draw = useCallback(
    (grid) => {
      const ctx = ctxRef.current
      const canvas = canvasRef.current
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.fillStyle = COLOR
      ctx.strokeStyle = COLOR
      for (let row = 0; row < engine.rows; row += 1) {
        for (let col = 0; col < engine.cols; col += 1) {
          const cell = grid.get(col, row)
          if (cell === FOOD) {
            const g = ctx.createRadialGradient(
              col * CELL + CELL / 2,
              row * CELL + CELL / 2,
              0,
              col * CELL + CELL / 2,
              row * CELL + CELL / 2,
              CELL * 1.5,
            )
            g.addColorStop(0, COLOR)
            g.addColorStop(1, 'transparent')
            ctx.fillStyle = g
            ctx.arc(col * CELL + CELL / 2, row * CELL + CELL / 2, CELL * 1.5, 0, 2 * Math.PI)
            ctx.fill()
            ctx.fillStyle = COLOR
            ctx.fillRect(col * CELL, row * CELL, CELL - GAP / 2, CELL - GAP / 2)
          }
          if (cell === BODY || cell === HEAD) {
            ctx.fillStyle = COLOR
            ctx.fillRect(col * CELL, row * CELL, CELL - GAP / 2, CELL - GAP / 2)
          }
        }
      }
    },
    [engine.cols, engine.rows],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const resize = () => {
      if (canvas && container) {
        const { width, height } = container.getBoundingClientRect()
        const cols = Math.floor(width / CELL)
        const rows = Math.floor(height / CELL)
        engine.resize(cols, rows)
        canvas.width = width
        canvas.height = height
      }
    }
    if (canvas) ctxRef.current = canvas.getContext('2d') || undefined
    const offScore = engine.onScore((s) => {
      playSound('beepHigh')
      setScore(s)
    })
    const offStep = engine.onStep((g) => draw(g))
    const offLose = engine.onLose(() => {
      playSound('beepMid')
      setScore(engine.score)
      setPhase('gameover')
    })
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      engine.stop()
      offScore()
      offStep()
      offLose()
    }
  }, [engine, draw])

  useEffect(() => {
    switch (phase) {
      case 'playing':
        setScore(0)
        engine.resetGame()
        engine.start()
        break
      case 'pre':
      case 'gameover':
      default:
        engine.stop()
    }
  }, [engine, phase])

  const startPlaying = useCallback(() => setPhase('playing'), [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'h' || e.key === 'a') {
        engine.setDirection('left')
        e.preventDefault()
        e.stopPropagation()
      }
      if (e.key === 'ArrowUp' || e.key === 'k' || e.key === 'w') {
        engine.setDirection('up')
        e.preventDefault()
        e.stopPropagation()
      }
      if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'd') {
        engine.setDirection('right')
        e.preventDefault()
        e.stopPropagation()
      }
      if (e.key === 'ArrowDown' || e.key === 'j' || e.key === 's') {
        engine.setDirection('down')
        e.preventDefault()
        e.stopPropagation()
      }
      if (e.key === 'Enter' || phase !== 'playing') {
        setPhase('playing')
        e.preventDefault()
        e.stopPropagation()
      }
      if (e.key === 'Escape') {
        onQuit()
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [engine, phase, onQuit])

  return (
    <div className={cx('_container_saapz_1', '_snakeContainer_saapz_52')} ref={containerRef}>
      <canvas className="_canvas_saapz_8" ref={canvasRef} />
      {phase === 'pre' ? (
        <button className="_startButton_saapz_18" type="button" onClick={startPlaying}>
          START
        </button>
      ) : null}
      {phase === 'gameover' ? (
        <button className="_startButton_saapz_18" type="button" onClick={startPlaying}>
          PLAY AGAIN
        </button>
      ) : null}
      <div className="_score_saapz_40">SCORE [{score}]</div>
      <div className="_esc_saapz_45">Hit [ESC] to quit</div>
    </div>
  )
}
