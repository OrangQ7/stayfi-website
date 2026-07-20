"use client";

import { useState } from "react";
import type { UnderwritingReviewRecord } from "@/lib/review-schema";
import type { UnderwritingDossier } from "@/lib/underwriting-schema";
import { useNoteIssuance } from "@/lib/use-note-issuance";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const confirmations = [
  { id: "dryRun", label: "This is a synthetic dry run: no wallet, contract deployment, mint, or transfer will occur." },
  { id: "eligibility", label: "Any future live issuance requires qualified investors, KYC/AML, and an on-chain whitelist." },
  { id: "risk", label: "The SRN is not the $STAY token and its outcome depends on hotel revenue performance." },
] as const;

export function IssuancePackagePanel({
  dealId,
  dossier,
  review,
}: {
  dealId: string;
  dossier: UnderwritingDossier;
  review: UnderwritingReviewRecord | null;
}) {
  const { issuance, isCurrent: current, prepareIssuance } = useNoteIssuance(dealId, dossier, review);
  const [spvDescriptor, setSpvDescriptor] = useState(`${dossier.hotel_profile.name} Seasonal Revenue SPV (synthetic draft)`);
  const [escrowControlReference, setEscrowControlReference] = useState("Regulated escrow / lockbox agreement pending");
  const [checked, setChecked] = useState<Record<(typeof confirmations)[number]["id"], boolean>>({ dryRun: false, eligibility: false, risk: false });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const approved = review?.decision === "conditionally_approved";
  const stale = Boolean(issuance && !current);
  const allChecked = Object.values(checked).every(Boolean);

  async function prepare() {
    if (!review || !approved) {
      setError("Record a conditionally approved human review first.");
      return;
    }
    if (spvDescriptor.trim().length < 8 || escrowControlReference.trim().length < 8) {
      setError("Add a clear synthetic SPV descriptor and escrow control reference.");
      return;
    }
    if (!allChecked) {
      setError("Complete all three issuance safeguards.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await prepareIssuance({ dossier, review, spvDescriptor, escrowControlReference });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not prepare the issuance package.");
    } finally {
      setSaving(false);
    }
  }

  function downloadPackage() {
    if (!issuance || !current) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(issuance, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `stayfi-srn-issuance-${dealId}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="mt-8 border border-[#0B63FF]/35 bg-[#0B63FF]/10 p-6 sm:p-7" id="issuance-package">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#75A7FF]">Day 3 · SRN issuance preparation</p>
          <h2 className="mt-3 text-3xl font-black">Prepare an auditable RWA package.</h2>
          <p className="mt-3 text-sm leading-6 text-white/55">Bind the approved dossier to a synthetic SPV, Base/USDC and ERC-3643 implementation targets, investor eligibility controls, and a proposed revenue lockbox. This prepares evidence; it does not issue a security.</p>
        </div>
        <div className={`border px-4 py-3 text-right ${current ? "border-emerald-300/30 bg-emerald-300/10" : stale ? "border-rose-300/30 bg-rose-300/10" : "border-amber-300/30 bg-amber-300/10"}`}>
          <p className="text-[10px] font-black uppercase text-white/40">Issuance state</p>
          <p className="mt-1 text-sm font-black">{current ? "Package prepared · not issued" : stale ? "Package stale · regenerate" : approved ? "Ready to prepare" : "Locked by review"}</p>
        </div>
      </div>

      {issuance && current ? (
        <div className="mt-5 grid gap-3 border border-white/10 bg-black/30 p-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="text-white/35">Target rails</p><p className="mt-1 font-bold text-white/75">Base · USDC · ERC-3643</p></div>
          <div><p className="text-white/35">Issuance fee</p><p className="mt-1 font-bold text-white/75">{money.format(issuance.fees.issuance_fee_usdc)} · {issuance.fees.issuance_fee_pct}%</p></div>
          <div><p className="text-white/35">On-chain transaction</p><p className="mt-1 font-bold text-amber-200">None · dry run</p></div>
          <div><p className="text-white/35">Prepared at</p><p className="mt-1 font-bold text-white/75">{new Date(issuance.prepared_at).toLocaleString()}</p></div>
          <div className="sm:col-span-2"><p className="text-white/35">Synthetic SPV descriptor</p><p className="mt-1 font-bold text-white/75">{issuance.legal_and_cash_controls.spv_descriptor}</p></div>
          <div className="sm:col-span-2"><p className="text-white/35">Escrow / lockbox control</p><p className="mt-1 font-bold text-white/75">{issuance.legal_and_cash_controls.escrow_control_reference}</p></div>
          <p className="break-all font-mono text-[10px] leading-5 text-white/40 sm:col-span-2 lg:col-span-3">Manifest SHA-256 · {issuance.manifest_sha256}</p>
          <button className="border border-white/20 px-3 py-2 font-black uppercase hover:bg-white hover:text-black" onClick={downloadPackage} type="button">Download JSON package</button>
        </div>
      ) : null}

      {stale ? <p className="mt-4 border border-rose-300/25 bg-rose-300/10 p-4 text-sm text-rose-100">The human-review receipt changed after this package was prepared. The old package is retained for traceability but cannot advance; prepare a new one.</p> : null}

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <label className="block text-xs font-black uppercase text-white/45">Synthetic SPV descriptor
            <input className="mt-2 w-full border border-white/15 bg-black/45 px-3 py-3 text-sm font-bold text-white outline-none focus:border-[#75A7FF] disabled:opacity-45" disabled={!approved} onChange={(event) => setSpvDescriptor(event.target.value)} value={spvDescriptor} />
          </label>
          <label className="block text-xs font-black uppercase text-white/45">Escrow / lockbox reference
            <input className="mt-2 w-full border border-white/15 bg-black/45 px-3 py-3 text-sm font-bold text-white outline-none focus:border-[#75A7FF] disabled:opacity-45" disabled={!approved} onChange={(event) => setEscrowControlReference(event.target.value)} value={escrowControlReference} />
          </label>
        </div>

        <div className="space-y-3">
          {confirmations.map((item) => (
            <label className={`flex gap-3 border border-white/10 bg-black/25 p-3 text-sm leading-5 text-white/65 ${approved ? "cursor-pointer" : "cursor-not-allowed opacity-45"}`} key={item.id}>
              <input checked={checked[item.id]} className="mt-1 accent-[#75A7FF]" disabled={!approved} onChange={(event) => setChecked((currentChecked) => ({ ...currentChecked, [item.id]: event.target.checked }))} type="checkbox" />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {error ? <p className="mt-4 text-sm font-bold text-rose-200" role="alert">{error}</p> : null}
      <button className="mt-5 min-h-12 bg-[#75A7FF] px-5 text-xs font-black uppercase text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45" disabled={!approved || saving} onClick={prepare} type="button">{saving ? "Fingerprinting package…" : current ? "Regenerate issuance package" : "Prepare synthetic issuance package"}</button>
      {!approved ? <p className="mt-3 text-xs text-white/40">Return to the underwriting screen and save a conditionally approved human decision to unlock this control.</p> : null}
    </section>
  );
}
