import { useEffect, useRef } from 'react'
import { usePage } from '../state/PageContext.jsx'
import { playSound } from '../audio/sounds.js'
import { remap } from '../lib/math.js'
import { Booklet } from '../three/Booklet.js'

// Canvas + booklet controller, synced to React state (original `op`).
// `bookletRef` is shared with the pan/overlay layer.
export default function Deck({ bookletRef }) {
  const canvasRef = useRef(null)
  const { pageIndex, isOpen, pageMeta, setPageIndex } = usePage()

  // React pageIndex -> controller
  useEffect(() => {
    if (bookletRef.current) bookletRef.current.setPageIndex(pageIndex)
  }, [pageIndex, bookletRef])

  // React isOpen -> controller
  useEffect(() => {
    if (bookletRef.current) bookletRef.current.setIsOpen(isOpen)
  }, [isOpen, bookletRef])

  // open/close sound
  useEffect(() => {
    playSound(isOpen ? 'open1' : 'open2', remap(Math.random(), 0, 1, 0.8, 1.3))
  }, [isOpen])

  // create controller once
  useEffect(() => {
    if (canvasRef.current && !bookletRef.current) {
      bookletRef.current = new Booklet(canvasRef.current, pageMeta)
      bookletRef.current.init()
      bookletRef.current.onPageIndexChange((i) => setPageIndex(i))
    }
    return () => {
      if (bookletRef.current) {
        bookletRef.current.destroy()
        bookletRef.current = null
      }
    }
  }, [bookletRef, pageMeta, setPageIndex])

  return <canvas ref={canvasRef} className="_canvas_mwpob_1" />
}
