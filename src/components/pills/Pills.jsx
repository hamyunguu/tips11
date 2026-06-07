import { cx } from '../../lib/cx.js'

// Light pill (original `St`).
export function LightPill({ children, parentStyles = '', style = {}, handleClick }) {
  return (
    <button type="button" style={style} className={cx(parentStyles, '_lightPill_1fm4j_1')} onClick={handleClick || undefined}>
      {children}
    </button>
  )
}

// Dark pill with dissolve layer (original `It`).
export function DarkPill({ children, parentStyles = '', style = {}, handleClick }) {
  return (
    <button type="button" style={style} className={cx(parentStyles, '_darkPill_13e1e_1')} onClick={handleClick || undefined}>
      {children}
      <div className="_darkPillDissolve_13e1e_20">{children}</div>
    </button>
  )
}
