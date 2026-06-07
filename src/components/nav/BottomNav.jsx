import { useEffect, useRef, useState } from 'react'
import { usePage } from '../../state/PageContext.jsx'
import { clamp } from '../../lib/math.js'
import { LightPill, DarkPill } from '../pills/Pills.jsx'

// Bottom navigation (original `Lh`): default mode (privacy/manual/open) and
// manual mode (home/prev/title-marquee/next/close + page list) + info legend.
export default function BottomNav() {
  const { pageIndex, setPageIndex, isOpen, setIsOpen, pageMeta, snakeEnabled } = usePage()
  const [showList, setShowList] = useState(false)
  const listRefs = useRef([])
  const titleRef = useRef(null)
  const firstItemRef = useRef(null)

  // keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (snakeEnabled) return
      if (e.key === 'Escape') {
        document.activeElement.blur()
        setIsOpen(false)
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'n' || e.key === 'k') {
        if (e.shiftKey) setPageIndex(pageMeta.length - 1)
        else setPageIndex((v) => clamp(v + 1, 0, pageMeta.length - 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'p' || e.key === 'j') {
        if (e.shiftKey) setPageIndex(0)
        else setPageIndex((v) => clamp(v - 1, 0, pageMeta.length - 1))
      } else if (e.key === 'm' || e.key === ' ') {
        document.activeElement.blur()
        setIsOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setIsOpen, setPageIndex, pageMeta, snakeEnabled])

  // page list stacking
  useEffect(() => {
    if (showList) {
      listRefs.current.forEach((el, d) => {
        if (!el) return
        el.style.zIndex = `${listRefs.current.length - d}`
        el.style.transform = `translateY(${-26.7 * d}px)`
      })
    }
    if (!isOpen) setShowList(false)
  }, [showList, pageIndex, isOpen])

  // marquee width / offset
  useEffect(() => {
    const container = titleRef.current
    const first = firstItemRef.current
    if (container && first) {
      const cw = container.offsetWidth
      const fw = first.offsetWidth
      container.style.setProperty('--marqueeOffset', `${(fw + 21) * -1}px`)
      container.style.width = `${cw + fw}px`
    }
    return () => {
      if (container) {
        container.style.animation = ''
        container.style.width = ''
      }
    }
  }, [pageIndex, isOpen])

  const title = pageMeta[pageIndex].title

  return (
    <nav className="_bottomNav_176wj_2">
      {isOpen ? (
        <div className="_manualNav_176wj_19">
          <LightPill
            parentStyles="_homePill_176wj_111"
            handleClick={() => setPageIndex(pageIndex === 0 ? pageMeta.length - 1 : 0)}
          >
            {pageIndex === 0 ? '↻' : '↺'}
          </LightPill>
          <DarkPill handleClick={() => setPageIndex((p) => clamp(p - 1, 0, pageMeta.length - 1))}>[Prev]</DarkPill>
          <LightPill parentStyles="_pageTitlePill_176wj_53" handleClick={() => setShowList(!showList)}>
            <div className="_pageTitle_176wj_53" ref={titleRef}>
              <span ref={firstItemRef}>{title}</span>
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i}> • {title}</span>
              ))}
            </div>
          </LightPill>
          <DarkPill handleClick={() => setPageIndex((p) => clamp(p + 1, 0, pageMeta.length - 1))}>[Next]</DarkPill>
          <DarkPill handleClick={() => setIsOpen(false)}>
            <span className="_closeDesktop_176wj_93">[close]</span>
            <span className="_closeMobile_176wj_46">✕</span>
          </DarkPill>
          <div className="_pageList_176wj_59">
            {showList &&
              pageMeta.map((p, d) => (
                <div
                  key={p.title}
                  ref={(el) => {
                    if (el) listRefs.current[d] = el
                  }}
                >
                  <LightPill
                    handleClick={() => {
                      setPageIndex(d)
                      setShowList(false)
                    }}
                    style={{
                      backgroundColor: pageIndex === d ? 'black' : '',
                      color: pageIndex === d ? 'var(--color-light)' : '',
                    }}
                  >
                    {d < 10 ? `0${d}` : d}. {p.title}
                  </LightPill>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="_defaultNav_176wj_24">
          <div>
            <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer">
              [Privacy]
            </a>
          </div>
          <div className="_defaultNavRight_176wj_37">
            <LightPill handleClick={() => setIsOpen(true)}>
              <span>[m] manual</span>
            </LightPill>
            <DarkPill handleClick={() => setIsOpen(true)}>
              <span>[open]</span>
            </DarkPill>
          </div>
        </div>
      )}
      <div className="_infoContainer_176wj_100">
        <DarkPill>
          <span>
            <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.46875 0.5625V2.125H1.90625V0.5625H3.46875ZM4.25 9.15625H5.03125V10.7188H3.46875V9.9375H2.6875V9.15625H1.90625V5.25H0.34375V3.6875H3.46875V8.375H4.25V9.15625Z" />
            </svg>
          </span>
        </DarkPill>
        <div className="_infoWindow_176wj_122">
          <div className="_infoRow_176wj_146">[M]...............Show manual</div>
          <div className="_infoRow_176wj_146">[N].................Next page</div>
          <div className="_infoRow_176wj_146">[P].................Prev page</div>
          <div className="_infoRow_176wj_146">[A]................Mute audio</div>
        </div>
      </div>
    </nav>
  )
}
