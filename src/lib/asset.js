// Resolve a public-asset path against Vite's base URL so it works both in dev
// (base "/") and on GitHub Pages (base "/tips11/"). Vite rewrites CSS/HTML
// asset URLs automatically, but NOT hardcoded JS strings — use this for those.
export const asset = (p) => import.meta.env.BASE_URL + String(p).replace(/^\//, '')
