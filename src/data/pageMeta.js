// 24 booklet pages — texture (mirrored PNG), title, tooltip textContent.
// Verbatim from original `pageMeta`. Texture filenames preserve original hashes
// (pages 11/12/13 keep their %20-encoded spaces to match the mirrored files).
export const PAGE_META = [
  { texture: '/assets/00-intro-jklatvzn.png', title: 'BF/CM User Manual', textContent: 'A supplemental manual to help guide you' },
  { texture: '/assets/01-intro-page-d778gt84.png', title: 'Intro', textContent: 'X' },
  { texture: '/assets/02-toc-est9cawd.png', title: 'Table of Contents', textContent: 'X' },
  { texture: '/assets/03-transaction-volume-f71ncgdc.png', title: 'Transaction Volume', textContent: 'Cumulative payment volume' },
  { texture: '/assets/04-total-transactions-eh6a0hkt.png', title: 'Total Transactions', textContent: 'Total number of payment flows' },
  { texture: '/assets/05-transactions-per-minute-luj9fe0e.png', title: 'Transactions Per Minute', textContent: 'Average number of transactions processed each minute' },
  { texture: '/assets/06-top-currency-volumes-cdjxlivq.png', title: 'Top Currency Volumes', textContent: 'Currencies used to pay on Stripe, ranked by USD-equivalent volume' },
  { texture: '/assets/07-time-saved-with-link-hhh69wut.png', title: 'Time Saved with Link', textContent: 'Total time saved by customers paying with Link (Stripe’s accelerated checkout solution)' },
  { texture: '/assets/08-fraudulent-transaction-detector-kpnb09eu.png', title: 'Fraudulent Transactions Blocked', textContent: 'Number of transactions blocked by Stripe Radar' },
  { texture: '/assets/09-stripe-tax-calculations-ojoztttn.png', title: 'Tax Calculations', textContent: 'Number of transactions where Stripe Tax was used to automatically calculate local taxes' },
  { texture: '/assets/10-total-ARR-of-new-billing-subscriptions-jglh5kb6.png', title: 'Total ARR from new Billing Subscriptions', textContent: 'Total annualized revenue from subscriptions initiated or upgraded during BFCM' },
  { texture: '/assets/11-businesses%20having%20their%20best%20day-9cbzka1e.png', title: 'Businesses Having Their Best Day Ever', textContent: 'Number of businesses seeing their highest-revenue day in their history with Stripe' },
  { texture: '/assets/12-Cross-border%20transaction%20volume-dn5awqi6.png', title: 'Cross-border transactions', textContent: 'Total cumulative volume of payments where buyers and sellers are in different countries' },
  { texture: '/assets/13-Unique%20payment%20methods-ophnjt05.png', title: 'Unique Payment Methods', textContent: 'Number of unique payment methods (e.g., cards, bank accounts, wallets) used by shoppers' },
  { texture: '/assets/14-top-selling-cities-bp0qop1u.png', title: 'Top-Selling Cities', textContent: 'Metropolitan areas seeing the largest transaction volume' },
  { texture: '/assets/15-api-utilization-j68u9qup.png', title: 'Server utilization', textContent: 'Stripe API request load vs. current capacity' },
  { texture: '/assets/16-stripe-api-uptime-e1xeh5lo.png', title: 'API Uptime', textContent: 'Uptime of Stripe APIs' },
  { texture: '/assets/17-user-logo-page-1-ama85rix.png', title: 'Businesses using Stripe 1-25', textContent: '' },
  { texture: '/assets/18-user-logo-page-2-dmons2fs.png', title: 'Businesses using Stripe 26-50', textContent: '' },
  { texture: '/assets/19-terms-and-conditions-gi95m6t1.png', title: 'Terms and Conditions', textContent: '' },
  { texture: '/assets/20-intentionally-blank-f5rxv1zv.png', title: 'Intentionally Blank', textContent: '' },
  { texture: '/assets/21-shop-js06heic.png', title: 'BF/CM Shop', textContent: 'Purchase the official BF/CM hat while supplies last' },
  { texture: '/assets/22-intentionally-blank-fdtvx8n1.png', title: 'Questions and comments', textContent: '' },
  { texture: '/assets/23-back-cover-h9s1qby6.png', title: 'Back', textContent: '' },
]
