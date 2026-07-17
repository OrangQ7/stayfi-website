# Fjordlight complex underwriting evaluation

This is a fully synthetic software test. It does not describe a real hotel, guest, insurer, bank account, security, or investment.

## Upload package

Upload the six files in `public/eval-data/fjordlight-complex/` together:

1. `fjordlight-property-profile.pdf` — authoritative 96-room property profile and source hierarchy.
2. `fjordlight-pms-export.xlsx` — five-sheet workbook with formulas, monthly controls, raw booking exceptions, and a duplicated booking.
3. `fjordlight-bank-ledger.csv` — historical PMS revenue of 5.2M USDC and verified inflow of 4.784M USDC, an 8% gap.
4. `fjordlight-ota-settlements.csv` — settlement ledger with a disputed January chargeback of 42,000 USDC.
5. `fjordlight-financing-request.docx` — requested 612,000 USDC funding against 720,000 USDC face value; deliberately states 100 revenue rooms.
6. `fjordlight-insurance-scan.pdf` — image-only scan whose policy expires one day before the season and whose boiler service falls during operations.

The six files total about 344 KB and are below the app’s 4 MB package limit.

## Human gold answer

The canonical human-authored answer is `data/evals/fjordlight-complex-gold.json`. A complete reference dossier is in `data/evals/fjordlight-complex-reference-dossier.json`.

Key targets:

- 96 sellable rooms; season 2027-11-01 through 2028-03-31.
- Forward net booked revenue: 5,600,000 USDC.
- Weighted occupancy: 81.003289%.
- Historical PMS lodging revenue: 5,200,000 USDC.
- Verified lodging inflow: 4,784,000 USDC; reconciliation gap: 8%.
- Proposed funding: 612,000 USDC; face: 720,000 USDC; discount: 15%; revenue share: 8%; maturity: 2028-04-30.
- Acceptable conservative risk band: B- or C; human review must be required.
- Required discrepancies: duplicated BKG-3118, 96 versus 100 rooms, 8% bank gap, pre-season insurance expiry, and disputed 42,000 USDC OTA chargeback.
- Required missing items: current insurance renewal evidence and FY2026 audited financial statements.

## Automatic score

The result page detects the six-file manifest and displays a deterministic report:

- Property identity: 15 points.
- Financial normalization: 35 points.
- Proposed terms: 15 points.
- Risks and review: 20 points.
- Auditability: 15 points.

`PASS` is 90–100, `REVIEW` is 75–89.9, and `FAIL` is below 75. This score measures extraction and evidence quality; it is not model confidence or an investment decision.

Run `npm run eval:fjordlight` to verify that the reference dossier scores exactly 100/PASS.
