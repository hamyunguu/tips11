// Hit-area layout — PRINT-SHOP REBRAND (clean hero: Canon MFP, front).
// Coordinates are % of the 16:9 machine stage (`_hitAreas_1yr6s_29`), which
// the printer image is cover-fit into (NO transform), so these % map to the
// same printer parts on every screen/aspect ratio. The printer sits on the
// LEFT, so every area uses `forceRight` to render its tooltip into the empty
// right space. Each opens a booklet page; the power button toggles the console.
export const HIT_AREAS = [
  // top document-feeder lid
  { className: 'feederLid', pageNumber: 3, top: 12, left: 6, width: 42, height: 12, forceRight: true },
  // scanner / second-tier body band
  { className: 'scannerBody', pageNumber: 4, top: 24, left: 6, width: 42, height: 12, forceRight: true },
  // printout output slot (dark recess)
  { className: 'outputSlot', pageNumber: 5, top: 36, left: 6, width: 42, height: 14, color: '#dbb486', forceRight: true },
  // touchscreen control panel
  { className: 'touchscreen', pageNumber: 2, top: 26, left: 38, width: 11, height: 16, color: '#b5b693', forceRight: true },
  // control buttons row beneath the screen
  { className: 'controlButtons', pageNumber: 6, top: 42.5, left: 38, width: 11, height: 4, forceRight: true },
  // left side panel
  { className: 'sidePanel', pageNumber: 7, top: 36, left: 5, width: 3, height: 50, forceRight: true },
  // main front cover
  { className: 'frontCover', pageNumber: 10, top: 50, left: 6, width: 42, height: 26, forceRight: true },
  // power button (toggles the BFCM console / snake)
  {
    className: 'powerButton',
    linkNumber: '01',
    top: 55,
    left: 43,
    width: 2.8,
    height: 6,
    isNoZoom: true,
    forceRight: true,
    title: 'Power',
    description: 'Toggle the console',
    url: 'CONSOLE',
  },
  // tray handle / mid output cover
  { className: 'midCover', pageNumber: 14, top: 76, left: 6, width: 42, height: 5, color: '#b5b693', forceRight: true },
  // bottom paper cassette tray
  { className: 'cassetteTray', pageNumber: 16, top: 80, left: 6, width: 42, height: 12, forceRight: true },
]
