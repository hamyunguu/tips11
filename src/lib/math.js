// math helpers — mirror original `Q` (clamp) and `z` (linear remap)
export const clamp = (t, lo, hi) => Math.min(Math.max(t, lo), hi)
export const remap = (t, e, n, r, i) => r + ((t - e) * (i - r)) / (n - e)
export const lerp = (a, b, t) => a + (b - a) * t
export const expLerp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt))
