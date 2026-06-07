import { useEffect, useState } from 'react'
import { LightPill } from '../pills/Pills.jsx'

// Time nav with three stacked pills: UTC clock, unix seconds, Swatch .beats (original `nh`).
export default function TimeNav() {
  const [utc, setUtc] = useState('00:00:00')
  const [epoch, setEpoch] = useState('0000000000')
  const [beats, setBeats] = useState('00:00:00')

  useEffect(() => {
    const calcBeats = () => {
      const u = new Date()
      const h =
        (((u.getUTCHours() + 1) % 24) * 3.6e6 +
          u.getUTCMinutes() * 6e4 +
          u.getUTCSeconds() * 1e3 +
          u.getUTCMilliseconds()) /
        86400
      return Math.floor(h * 100) / 100
    }
    const tick = () => {
      const u = new Date()
      const f = u.getTime()
      const tzOffset = u.getTimezoneOffset() * 6e4
      const c = Math.floor(Date.now() / 1e3)
      const p = calcBeats()
      const d = new Date(f + tzOffset).getHours()
      const v = new Date(f + tzOffset).getMinutes()
      const m = new Date(f + tzOffset).getSeconds()
      for (let x = 0; x < 3; x += 1) {
        let w
        if (x === 0) w = d
        else if (x === 1) w = (d - 8) % 24
        else w = (d + 9) % 24
        const b = `${w < 10 ? `0${w}` : w}:${v < 10 ? `0${v}` : v}:${m < 10 ? `0${m}` : m}`
        if (x === 0) setUtc(`${b} UTC`)
        else if (x === 1) setEpoch(`${c}`)
        else setBeats(`${p}.BEATS`)
      }
    }
    tick()
    const id = setInterval(tick, 1e3)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="_timeNav_s71o8_1">
      <LightPill parentStyles="_timePill_s71o8_5">{beats}</LightPill>
      <LightPill parentStyles="_timePill_s71o8_5">{epoch}</LightPill>
      <LightPill parentStyles="_timePill_s71o8_5">{utc}</LightPill>
    </div>
  )
}
