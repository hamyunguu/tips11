import { useEffect } from 'react'
import { LightPill, DarkPill } from '../pills/Pills.jsx'
import { useMute } from '../../audio/sounds.js'
import TimeNav from './TimeNav.jsx'

// Top navigation (original `ph`): Stripe logo, live/connecting pill, time nav, audio toggle.
export default function TopNav({ isLive, isSmallScreen }) {
  const [muted, setMuted] = useMute()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'a') setMuted((m) => !m)
    }
    window.addEventListener('keypress', onKey)
    return () => window.removeEventListener('keypress', onKey)
  }, [setMuted])

  return (
    <nav className="_topNav_x2w7d_1">
      <div className="_left_x2w7d_17">
        <a
          href="#"
          className="_logoPill_x2w7d_23"
          aria-label="TIPS"
          style={{
            color: 'var(--color-light)',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '11.7px',
            letterSpacing: '0.06em',
          }}
        >
          TIPS
        </a>
        {isLive ? (
          <button type="button" className="_livePill_x2w7d_75">
            <svg className="_liveDot_x2w7d_48" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="5" cy="5.5" r="5" />
            </svg>
            <span>[tips]</span>
            <div className="_liveHover_x2w7d_29">
              EXPERIMENT FOR MANY WAYS TO BIND PAPER.
            </div>
          </button>
        ) : (
          <LightPill>
            <svg className="_offlineDot_x2w7d_53" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="5" cy="5.5" r="5" />
            </svg>
            <span>[connecting]</span>
          </LightPill>
        )}
        <TimeNav />
      </div>
      <div className="_right_x2w7d_18">
        <DarkPill handleClick={() => setMuted(!muted)}>
          {isSmallScreen ? 'Aud' : 'Audio'} [{muted ? 'off' : 'on'}]
        </DarkPill>
      </div>
    </nav>
  )
}
