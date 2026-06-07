import { BFCM_PATHS } from '../../data/bfcmPaths.js'

// BF/CM wordmark (original `Bd`).
export default function BfcmLogo({ className }) {
  return (
    <svg
      width="833"
      height="298"
      viewBox="0 0 833 298"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {BFCM_PATHS.map((d, i) => (
        <path key={i} d={d} fill="currentColor" />
      ))}
    </svg>
  )
}
