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
        <a href="https://stripe.com" className="_logoPill_x2w7d_23">
          <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 14.25L13 11.4134V0.75L0 3.53405V14.25Z" fill="#EFEFEF" />
          </svg>
        </a>
        {isLive ? (
          <button type="button" className="_livePill_x2w7d_75">
            <svg className="_liveDot_x2w7d_48" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="5" cy="5.5" r="5" />
            </svg>
            <span>[recap]</span>
            <div className="_liveHover_x2w7d_29">
              BLACK FRIDAY/CYBER MONDAY IS OVER. SEE FINAL DATA TOTALS BELOW.
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
