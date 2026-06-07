import { usePage, useSnake } from '../../state/PageContext.jsx'
import { playSound } from '../../audio/sounds.js'
import Blinker from './Blinker.jsx'
import Snake from './Snake.jsx'
import Bouncer from './Bouncer.jsx'

// CRT console override (original `qd`).
export default function Console() {
  const { snakeEnabled, canEnableSnake, handleQuit } = useSnake()
  const { setOverride } = usePage()
  const blinkText = snakeEnabled ? 'SNEK' : 'TIPS'

  return (
    <>
      <Blinker blinkText={blinkText} />
      {snakeEnabled ? <Snake onQuit={handleQuit} /> : <Bouncer />}
      <div className="_footer_nag8h_260">
        {snakeEnabled ? null : (
          <button
            type="button"
            className="_close_nag8h_267"
            onClick={() => {
              playSound('beepMid')
              setOverride(false)
            }}
          >
            [CLOSE CONSOLE]
          </button>
        )}
        {canEnableSnake && !snakeEnabled ? (
          <div className="_snakePrompt_nag8h_291">Hit [ENTER] to play SNAKE</div>
        ) : null}
        {canEnableSnake ? null : (
          <div className="_gptn_nag8h_284">
            Powered by TIPS
            <br />
            Experiment for many ways to bind paper
          </div>
        )}
      </div>
    </>
  )
}
