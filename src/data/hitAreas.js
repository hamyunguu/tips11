// Hit-area layout — PRINT-SHOP REBRAND (clean hero: Canon MFP, enlarged & front).
// Coordinates are % of the 16:9 machine stage (`_hitAreas_1yr6s_29`), which
// shares the printer image's footprint. The printer sits on the LEFT, so every
// area uses `forceRight: true` to render its tooltip into the empty right space.
// Each opens a booklet page; the power button toggles the CRT console.
export const HIT_AREAS = [
  // top document-feeder lid
  { className: 'feederLid', pageNumber: 3, top: 6, left: 11, width: 41, height: 10, forceRight: true },
  // scanner / second-tier body band
  { className: 'scannerBody', pageNumber: 4, top: 16, left: 11, width: 41, height: 11, forceRight: true },
  // printout output slot (dark recess)
  { className: 'outputSlot', pageNumber: 5, top: 30, left: 11, width: 41, height: 15, color: '#dbb486', forceRight: true },
  // touchscreen control panel
  { className: 'touchscreen', pageNumber: 2, top: 19, left: 45, width: 17, height: 18, color: '#b5b693', forceRight: true },
  // control buttons row beneath the screen
  { className: 'controlButtons', pageNumber: 6, top: 38, left: 45, width: 17, height: 5, forceRight: true },
  // left side panel
  { className: 'sidePanel', pageNumber: 7, top: 30, left: 8.5, width: 3, height: 47, forceRight: true },
  // main front cover
  { className: 'frontCover', pageNumber: 10, top: 46, left: 11, width: 46, height: 27, forceRight: true },
  // power button (toggles the BFCM console / snake)
  {
    className: 'powerButton',
    linkNumber: '01',
    top: 51,
    left: 51.5,
    width: 2.8,
    height: 6,
    isNoZoom: true,
    forceRight: true,
    title: 'Power',
    description: 'Toggle the console',
    url: 'CONSOLE',
  },
  // tray handle / mid output cover
  { className: 'midCover', pageNumber: 14, top: 73, left: 11, width: 46, height: 6, color: '#b5b693', forceRight: true },
  // bottom paper cassette tray
  { className: 'cassetteTray', pageNumber: 16, top: 79, left: 11, width: 46, height: 13, forceRight: true },
]
