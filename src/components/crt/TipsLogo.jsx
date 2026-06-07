// TIPS wordmark (replaces the GPTN globe in the console screensaver).
export default function TipsLogo({ className }) {
  return (
    <svg viewBox="0 0 460 150" className={className} xmlns="http://www.w3.org/2000/svg">
      <text
        x="50%"
        y="52%"
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="sohne-mono, monospace"
        fontWeight="700"
        fontSize="130"
        letterSpacing="6"
        fill="currentColor"
      >
        TIPS
      </text>
    </svg>
  )
}
