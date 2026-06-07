import { Howl, Howler } from 'howler'
import { useEffect, useState } from 'react'
import { asset } from '../lib/asset.js'

// Sound bank (original `pi`). Sources point at the locally-mirrored mp3s
// under /assets/audio (same files as videos.stripeassets.com originals).
const A = asset('/assets/audio')
const bank = {
  open1: new Howl({ src: `${A}/open-1.mp3`, volume: 1 }),
  open2: new Howl({ src: `${A}/open-2.mp3`, volume: 1 }),
  flip1: new Howl({ src: `${A}/flip-1.mp3`, volume: 0.5 }),
  flip2: new Howl({ src: `${A}/flip-2.mp3`, volume: 0.5 }),
  slide1: new Howl({ src: `${A}/slide-1.mp3`, volume: 0.3 }),
  slide2: new Howl({ src: `${A}/slide-2.mp3`, volume: 0.3 }),
  slide3: new Howl({ src: `${A}/slide-3.mp3`, volume: 0.3 }),
  slide4: new Howl({ src: `${A}/slide-4.mp3`, volume: 0.3 }),
  turn2: new Howl({ src: `${A}/turn-2.mp3`, volume: 0.5 }),
  turn3: new Howl({ src: `${A}/turn-3.mp3`, volume: 0.5 }),
  turn4: new Howl({ src: `${A}/page-turn-01.mp3`, volume: 0.5 }),
  shuffleShort1: new Howl({ src: `${A}/shuffle-short-1.mp3`, volume: 1 }),
  shuffleShort2: new Howl({ src: `${A}/shuffle-short-2.mp3`, volume: 1 }),
  shuffleShort3: new Howl({ src: `${A}/shuffle-short-3.mp3`, volume: 1 }),
  shuffleLong1: new Howl({ src: `${A}/shuffle-long-1.mp3`, volume: 1 }),
  beepMid: new Howl({ src: `${A}/Retro2.mp3`, volume: 1 }),
  beepHigh: new Howl({ src: `${A}/Retro1.mp3`, volume: 1 }),
}

// play one sound at a given playback rate (original `dn`)
export function playSound(key, rate = 1) {
  const s = bank[key]
  if (!s) return
  s.rate(rate)
  const id = s.play()
  s.rate(rate, id)
}

// play a random sound from a list at a given rate (original `et`)
export function playRandomSound(keys, rate = 1) {
  const key = keys[Math.floor(Math.random() * keys.length)]
  const s = bank[key]
  if (!s) return
  const id = s.play()
  s.rate(rate, id)
}

// global mute toggle hook (original `ol`)
export function useMute() {
  const [muted, setMuted] = useState(false)
  useEffect(() => {
    Howler.mute(muted)
  }, [muted])
  return [muted, setMuted]
}
