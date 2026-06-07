import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePage } from '../../state/PageContext.jsx'
import { cx } from '../../lib/cx.js'
import Console from './Console.jsx'

const LOGO_MARK = `===== === ====  ====  (TM)
  =    =  =   = =
  =    =  ====  ====
  =    =  =        =
  =   === =     ====

[ PAPER BINDING EXPERIMENT MONITOR ]`

const LOGO_META = `      TIPS MK II
SERIAL 42-42-42
        VER 1.0`

const BOOT_TEXT = `
TIPS BIOS -- V42.42
12 degrees POST driver

--- System health check start ---

PAPER FEED TRAY
  [LOADED]

INK RESERVOIR
  [FULL]

FOLDING UNIT
  [ALIGNED]

BINDING MODULE
  [READY]

TRIM BLADE
  [SHARP]

POST INITIALIZATION SEQUENCE
  [DONE]

--- System health check end ---

EXPERIMENT FOR MANY WAYS TO BIND PAPER

TIPS MK II BOOT READY`

// CRT terminal shell (original `Zd`).
// 60-tick boot (50ms) → 2s delay → done; flashOut fade reveals the 3D scene.
export default function CrtShell({ children, showFallback = false }) {
  const { override } = usePage()
  // DEV-only: `?fastboot` skips the boot sequence for quick iteration.
  const fastBoot =
    import.meta.env.DEV && typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('fastboot')
  const [done, setDone] = useState(fastBoot)
  const [tick, setTick] = useState(fastBoot ? 1000 : 0)
  const intervalRef = useRef()
  const TOTAL = 3000
  const STEP = 50

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (tick <= TOTAL / STEP) {
        setTick((t) => t + 1)
      } else {
        setTimeout(() => setDone(true), 2000)
        clearInterval(intervalRef.current)
      }
    }, STEP)
    return () => clearInterval(intervalRef.current)
  }, [tick])

  // progressive line reveal: print first (tick - offset) lines, "" until tick > offset
  const reveal = useCallback(
    (text, offset) => {
      if (offset > tick) return ''
      return text.split('\n').slice(0, tick - offset).join('\n')
    },
    [tick],
  )

  const booting = useMemo(() => tick < TOTAL / STEP, [tick])

  return (
    <>
      {booting ? null : (
        <div className={cx('_stream_nag8h_50', !booting && !override && '_streamShow_nag8h_54')}>
          {children}
        </div>
      )}
      <div
        className={cx(
          '_background_nag8h_29',
          showFallback && '_backgroundFallback_nag8h_42',
          !booting && !override && '_backgroundFade_nag8h_46',
        )}
      />
      <div className={cx('_container_nag8h_1', !booting && !override && '_containerFade_nag8h_24')}>
        <div className="_inner_nag8h_80">
          <div className="_grid_nag8h_100">
            <pre className="_logoMark_nag8h_58">{reveal(LOGO_MARK, 0)}</pre>
            <pre className="_logoMeta_nag8h_63">{reveal(LOGO_META, 10)}</pre>
            {override ? <Console /> : null}
            {booting && !done ? <pre className="_bootText_nag8h_70">{reveal(BOOT_TEXT, 15)}</pre> : null}
          </div>
        </div>
      </div>
    </>
  )
}
