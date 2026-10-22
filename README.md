# Hotel Intelligence — Canada, USA & Mexico

Next.js 14 + TypeScript + Tailwind rebuild of HISV (Hotel Data and Speculative Valuation), limited to North America.

## Pages

| Route | What it shows |
|---|---|
| `/` | 465 hotels: filter by country, market, tier; sort any column |
| `/reports/[id].pdf` | Per-hotel PDF report, generated on demand (opens when you click a hotel name) |
| `/hotel/[id]` | Web version of the same report (11 sections, see below) |
| `/markets` | Market averages calculated from the hotel and transaction data |
| `/transactions` | 224 hotel sales with buyer, seller, price, $/key and source link |

### Hotel report sections
1. Location & Accessibility
2. Property Identification (without Projected Stabilized Metrics)
3. Physical Attributes & Amenities
4. Verified & Quoted Room Rates
5. Market Context
6. Competitive Set & Market Position
7. Strengths & Weaknesses
8. Comparable Transactions
9. Verified Actual Guest Stays (HotelPlanner)
10. Convention & Event Demand
11. Data Sources

## Data

All data is static JSON in `data/`. Nothing is fetched at runtime.

- `data/hotels.json`: one row per hotel (keys, OTA low/high/blended ADR, occupancy, RevPAR, cap rate, est. value).
- `data/reports.json`: the report sections for every hotel (keyed by id), taken from the original HISV v11 report pages.
- `data/verified.json`: hotels re-checked against current sources (address, rooms, opening date, amenities, Kayak prices), with the source URLs and check date. Verified hotels show a green **Verified** badge and list their sources in the report's Data Sources section.
- PDFs are not stored in the repo. `app/reports/[file]/route.ts` builds each one on request with `@react-pdf/renderer` (fonts in `assets/fonts`), and Vercel caches it for a day.
- `data/transactions.json`: hotel sales. `url` is `null` when no article link was on record; the app labels those "No source".

OTA prices for verified hotels come from Kayak.com (USD), last-12-months figures: low = cheapest-month average, high = most-expensive-month average, blended ADR = average of the two.

Estimated value in the hotel list = keys × 365 × occupancy × blended OTA ADR × (1 + non-room ratio) × (1 − expense ratio) ÷ cap rate.

## Deploy

1. Upload the contents of this folder to a GitHub repository. It is about 30 files and every file is under 25 MB, so GitHub's web uploader works (drag the unzipped folder contents onto **Add file → Upload files**).
2. In Vercel, **Add New → Project**, import the repository, keep the Next.js defaults, and deploy.

Local: `npm install` then `npm run dev`.

Research data for preliminary investigation only. Not an appraisal. Contact: itchkochapps@gmail.com
