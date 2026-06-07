import { useCallback, useEffect, useRef, useState } from 'react'
import { usePage } from '../state/PageContext.jsx'
import { HIT_AREAS } from '../data/hitAreas.js'
import TopNav from './nav/TopNav.jsx'
import BottomNav from './nav/BottomNav.jsx'
import Video from './Video.jsx'
import MachineOverlay from './MachineOverlay.jsx'
import ManualOverlay from './ManualOverlay.jsx'
import Deck from './Deck.jsx'

// Orchestration wrapper (original `ap` + `Xh`): wires booklet pan handlers,
// tracks live/zoom state, and lays out nav + machine + drag + canvas.
export default function Stage({ bookletRef }) {
  const { pageIndex, isOpen } = usePage()
  const [isLive, setIsLive] = useState(false)
  const [machineRects, setMachineRects] = useState([])
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  const uiRef = useRef(null)
  const machineTranslateRef = useRef(null)
  const machineContainerRef = useRef(null)
  const zoomRef = useRef({ x: 0, y: 0, scale: 1, manualWidth: 0 })

  // pan handlers proxied to the booklet controller
  const handlePan = (_, info) => {
    bookletRef.current?.handlePan(info.delta.x, 1 - info.point.y / window.innerHeight)
  }
  const handlePanStart = useCallback(
    (_, info) => {
      bookletRef.current?.handlePanStart(info.offset.x)
    },
    [bookletRef],
  )
  const handlePanEnd = useCallback(() => {
    bookletRef.current?.handlePanEnd()
  }, [bookletRef])
  const handleMouseEnter = useCallback(() => bookletRef.current?.handleMouseEnter(), [bookletRef])
  const handleMouseLeave = useCallback(() => bookletRef.current?.handleMouseLeave(), [bookletRef])

  // reveal UI once live
  useEffect(() => {
    if (isLive && uiRef.current) uiRef.current.style.opacity = '1'
    else document.body.classList.remove('isLive')
  }, [isLive])

  // zoom machineContainer into the current page's hit-area when open
  useEffect(() => {
    if (!machineContainerRef.current || !machineTranslateRef.current || machineRects.length === 0 || isSmallScreen)
      return
    let idx = HIT_AREAS.findIndex((a) => a.pageNumber === pageIndex)
    if (idx === -1) idx = 0
    const zoomable = !HIT_AREAS[idx].isNoZoom
    const reserved = isOpen ? window.innerHeight * 0.5 : 0
    const rect = machineRects[idx]
    if (!rect) return
    const tx = isOpen && zoomable ? window.innerWidth / 2 - rect.x : 0
    const scale = isOpen && zoomable ? Math.min(2, Math.max(1, ((window.innerWidth - reserved) / rect.width) * 0.845)) : 1
    let lo = 0
    if (rect.height > window.innerHeight && isOpen && zoomable) lo = window.innerHeight - rect.height
    let hi = 0
    if (rect.height < window.innerHeight && isOpen && zoomable) hi = (window.innerHeight - rect.height) / -2
    const ty = isOpen && zoomable ? Math.max(lo, Math.min(hi, window.innerHeight / 2 - rect.y)) : 0
    machineContainerRef.current.style.transformOrigin = `${rect.x}px ${rect.y}px`
    zoomRef.current = { x: tx, y: ty, scale, manualWidth: reserved }
    machineContainerRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`
    machineTranslateRef.current.style.transform = `translateX(${reserved * -0.5}px)`
  }, [isOpen, pageIndex, machineRects, isSmallScreen])

  // track portrait/small screen
  useEffect(() => {
    const update = () => setIsSmallScreen(window.innerWidth < window.innerHeight)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="_ui_3unaz_1" ref={uiRef}>
      <TopNav isLive={isLive} isSmallScreen={isSmallScreen} />
      <BottomNav />
      <div className="_machineTranslate_3unaz_7" ref={machineTranslateRef}>
        <div className="_machineContainer_3unaz_18" ref={machineContainerRef}>
          <Video onLiveChange={setIsLive} />
          <MachineOverlay setMachineRects={setMachineRects} />
        </div>
      </div>
      {isOpen ? (
        <ManualOverlay
          handlePan={handlePan}
          handlePanStart={handlePanStart}
          handlePanEnd={handlePanEnd}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
      ) : null}
      <Deck bookletRef={bookletRef} />
    </div>
  )
}
