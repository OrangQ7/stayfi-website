# Day 3 — auditable SRN issuance preparation

Day 3 converts a conditionally approved underwriting result into a downloadable, fingerprinted Seasonal Revenue Note (SRN) issuance package.

## What the user can do

1. Finish the Day 2 human-review gate with **Conditionally approved**.
2. Open the linked note draft.
3. Review or edit the synthetic SPV descriptor and proposed escrow / lockbox reference.
4. Confirm the dry-run, investor-eligibility, and performance-risk safeguards.
5. Prepare and download the SRN issuance JSON package.
6. Open the portfolio page and verify that the same manifest fingerprint appears there.

If the evidence dossier or human-review decision is later changed, the existing issuance package becomes stale because its stored dossier or review-receipt hash no longer matches.

## Whitepaper alignment

The package records the whitepaper's target structure:

- deal-specific SPV and a Revenue Participation Agreement still required;
- Base as the target settlement network;
- USDC as the target settlement asset;
- ERC-3643 as the target permissioned-token standard;
- qualified, KYC/AML-checked and whitelisted investors;
- a deal-specific escrow / lockbox and revenue waterfall;
- a 2% issuance fee, 1% settlement fee and 0.25% secondary-transfer fee;
- SRN exposure remains separate from the `$STAY` utility/governance token.

## Deliberate safety limits

This hackathon control is `prepared_not_issued`. It does not connect a wallet, deploy a contract, mint a token, transfer USDC, create a legal SPV, execute an RPA, complete KYC, or connect a regulated escrow account. `transaction_hash` is always `null`.

Those missing production controls are displayed in the package rather than hidden. This makes the demo traceable without representing synthetic activity as a real securities transaction. The SHA-256 values are change-detection fingerprints, not digital signatures or proof of reviewer identity.

## Verification

Run:

```bash
npm run eval:issuance
npm run typecheck
npm run lint
npm run build
```

The issuance evaluator checks deterministic fingerprints, changed-input detection, the fee calculation, the non-issued state, and the hard block on a declined review.
