import { useEffect, useRef } from 'react'
import { asset } from '../lib/asset.js'

// Looping "machine" background video (original `Ah`). On mount it signals
// live, fades itself in, and parallax-pans with the mouse on portrait screens.
export default function Video({ onLiveChange }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const onMove = (e) => {
      if (!ref.current) return
      if (window.innerWidth / window.innerHeight < 1) {
        const overflow = ref.current.offsetWidth - window.innerWidth
        ref.current.style.transform = `translateX(${(-e.clientX / window.innerWidth) * overflow}px)`
      } else {
        ref.current.style.transform = 'none'
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    onLiveChange(true)
  }, [onLiveChange])

  useEffect(() => {
    if (ref.current) {
      ref.current.style.opacity = '1'
      ref.current.style.filter = 'none'
      ref.current.style.transform = 'none'
    }
  }, [])

  return (
    <div className="_videoContainer_1xyyf_1" ref={ref}>
      <img className="printerMachine" src={asset('/assets/printer.jpg')} alt="Office printer" draggable={false} />
    </div>
  )
}
