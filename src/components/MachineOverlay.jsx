import { useEffect, useRef, useState } from 'react'
import { usePage } from '../state/PageContext.jsx'
import { cx } from '../lib/cx.js'
import { playSound } from '../audio/sounds.js'
import { HIT_AREAS } from '../data/hitAreas.js'

// Machine overlay: invisible hit-areas over the machine video that reveal
// tooltips on hover and open booklet pages on click (original `Kh`).
export default function MachineOverlay({ setMachineRects }) {
  const { pageIndex, setPageIndex, isOpen, setIsOpen, pageMeta, setOverride } = usePage()
  const [revealAll, setRevealAll] = useState(false)
  const hitAreasRef = useRef(null)

  // measure hit-area screen rects -> report to parent (for zoom)
  useEffect(() => {
    const container = hitAreasRef.current
    if (!container) return
    const measure = () => {
      container.querySelectorAll('.hitArea').forEach((el, idx) => {
        const r = el.getBoundingClientRect()
        if (!el.parentElement?.parentElement?.parentElement) return
        const x = r.left + r.width / 2
        const y = r.top + r.height / 2
        setMachineRects((prev) => {
          const next = [...prev]
          next[idx] = { x, y, width: r.width, height: r.height }
          return next
        })
      })
    }
    const portrait = document.documentElement.clientWidth / document.documentElement.clientHeight < 1
    if (portrait) window.addEventListener('resize', measure)
    measure()
    return () => window.removeEventListener('resize', measure)
  }, [setMachineRects])

  // tooltip 3D tilt + connector line follow cursor
  useEffect(() => {
    const container = hitAreasRef.current
    if (!container) return
    const handlers = []
    container.querySelectorAll('.hitArea').forEach((el, idx) => {
      const onMove = (e) => {
        if (!e.currentTarget) return
        const tooltip = e.currentTarget.querySelector('.tooltip')
        const line = e.currentTarget.querySelector('.line')
        if (!tooltip || !line) return
        const target = e.currentTarget
        const rect = target.getBoundingClientRect()
        const dx = e.clientX - rect.left - rect.width / 2
        const dy = e.clientY - rect.top - rect.height / 2
        const ry = (dy / rect.height) * 10
        const rx = (dx / rect.width) * 10
        const isLeft = HIT_AREAS[idx].forceLeft || (parseInt(target.style.left, 10) < 50 && !HIT_AREAS[idx].forceRight)
        const lineScaleX = 0.75 - dx * (isLeft ? 0.001 : -0.001)
        const lineRot = target.style.left && isLeft ? (ry - rx - 30) * -1 : ry - rx * -1 - 30
        const ty = dy * 0.01
        const tx = dx * 0.01
        line.style.setProperty('--lineRotation', `${lineRot}deg`)
        line.style.setProperty('--lineScaleX', `${lineScaleX}`)
        tooltip.style.transform = `rotateX(${ry * -1}deg) rotateY(${rx}deg) translateX(${tx}vw) translateY(${ty}vw) translateZ(2.5vw)`
      }
      el.addEventListener('mousemove', onMove)
      handlers.push([el, onMove])
    })
    return () => handlers.forEach(([el, fn]) => el.removeEventListener('mousemove', fn))
  }, [])

  // hide tooltips/lines while the booklet is open
  useEffect(() => {
    const container = hitAreasRef.current
    container?.querySelectorAll('.hitArea').forEach((el) => {
      const tooltip = el.querySelector('.tooltip')
      if (tooltip) tooltip.style.opacity = isOpen ? '0' : '1'
      const line = el.querySelector('.line')
      if (line) line.style.opacity = isOpen ? '0' : '1'
    })
    if (isOpen) setRevealAll(false)
    else document.activeElement.blur()
  }, [isOpen])

  // 't' toggles reveal-all, Escape clears it
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 't') setRevealAll((v) => !v)
      if (e.key === 'Escape') setRevealAll(false)
    }
    window.addEventListener('keyup', onKey)
    return () => window.removeEventListener('keyup', onKey)
  }, [])

  // focus the hit-area matching the current page when open
  useEffect(() => {
    if (!isOpen) return
    hitAreasRef.current?.querySelectorAll('.hitArea').forEach((el, idx) => {
      if (HIT_AREAS[idx].pageNumber === pageIndex) el.focus()
    })
  }, [pageIndex, isOpen])

  // reveal-all visual state
  useEffect(() => {
    hitAreasRef.current?.querySelectorAll('.hitArea').forEach((el) => {
      el.style.opacity = revealAll ? '1' : ''
      el.style.filter = revealAll ? 'none' : ''
      const tooltip = el.querySelector('.tooltip')
      if (tooltip) tooltip.style.opacity = revealAll ? '1' : ''
      const line = el.querySelector('.line')
      if (line) line.style.opacity = revealAll ? '1' : ''
    })
  }, [revealAll])

  return (
    <div className="_machineOverlay_1yr6s_1" onClick={() => setIsOpen(false)}>
      <div className="_hitAreas_1yr6s_29" ref={hitAreasRef}>
        {HIT_AREAS.map((c, idx) => {
          const isLeft = c.forceLeft || (c.left < 50 && !c.forceRight)
          return (
            <button
              key={idx}
              type="button"
              className={cx('hitArea', '_hitArea_1yr6s_29', !isLeft && '_hitArea--right_1yr6s_100')}
              style={{
                top: `${c.top}%`,
                left: `${c.left}%`,
                width: `${c.width}%`,
                height: `${c.height}%`,
                borderColor: c.color,
              }}
              onClick={(e) => {
                if (c.url === 'CONSOLE') {
                  e.stopPropagation()
                  setOverride(true)
                  playSound('beepHigh')
                } else if (!c.url) {
                  e.stopPropagation()
                  if (pageIndex === c.pageNumber) setIsOpen((m) => !m)
                  else {
                    if (c.pageNumber === undefined) return
                    setPageIndex(c.pageNumber)
                    setIsOpen(true)
                  }
                }
              }}
            >
              {c.url === 'https://press.stripe.com' ? (
                <a href="https://press.stripe.com" target="_blank" rel="noreferrer" className="_decoyLink_1yr6s_240" />
              ) : null}
              {c.url === 'https://stripe.dev' ? (
                <a href="https://stripe.dev" target="_blank" rel="noreferrer" className="_decoyLink_1yr6s_240" />
              ) : null}
              {c.url === 'https://stripe.press/boom' ? (
                <a href="https://stripe.press/boom" target="_blank" rel="noreferrer" className="_decoyLink_1yr6s_240" />
              ) : null}
              {c.url === 'https://stripe.press/poor-charlies-almanack' ? (
                <a
                  href="https://stripe.press/poor-charlies-almanack"
                  target="_blank"
                  rel="noreferrer"
                  className="_decoyLink_1yr6s_240"
                />
              ) : null}
              <div className={cx('line', '_line_1yr6s_34')} style={c.tooltipTop ? { top: '4vw' } : {}} />
              <div className={cx('tooltip', '_tooltip_1yr6s_33')} style={c.tooltipTop ? { top: '0px' } : {}}>
                <div className="_tooltipCorners_1yr6s_157">
                  <div className="_tooltipCorner_1yr6s_157" />
                  <div className="_tooltipCorner_1yr6s_157" />
                  <div className="_tooltipCorner_1yr6s_157" />
                  <div className="_tooltipCorner_1yr6s_157" />
                </div>
                {c.pageNumber !== undefined ? (
                  <>
                    <div className="_tooltipHeader_1yr6s_206">
                      <div className="_fig_1yr6s_225">
                        Page{' '}
                        <span className="_figPill_1yr6s_231">
                          {c.pageNumber < 10 ? `0${c.pageNumber}` : c.pageNumber}
                        </span>
                      </div>{' '}
                      <div>{pageMeta[c.pageNumber]?.title}</div>
                    </div>
                    <div />
                    <div className="_tooltipFooter_1yr6s_213">{pageMeta[c.pageNumber]?.textContent}</div>
                  </>
                ) : (
                  <>
                    <div className="_tooltipHeader_1yr6s_206">
                      <div className="_fig_1yr6s_225">
                        Link <span className="_figPill_1yr6s_231">{c.linkNumber}</span>
                      </div>{' '}
                      <div>{c.title}</div>
                    </div>
                    <div className="_tooltipFooter_1yr6s_213">{c.description}</div>
                  </>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
