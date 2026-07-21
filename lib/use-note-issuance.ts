"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createSRNIssuancePackage, sha256Json } from "@/lib/issuance-receipt";
import {
  isSRNIssuancePackage,
  issuanceStorageKey,
} from "@/lib/issuance-schema";
import type { UnderwritingReviewRecord } from "@/lib/review-schema";
import type { UnderwritingDossier } from "@/lib/underwriting-schema";

const loadingMarker = "__stayfi_issuance_loading__";
const missingMarker = "__stayfi_issuance_missing__";

function parsePackage(raw: string) {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isSRNIssuancePackage(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function useNoteIssuance(
  dealId: string,
  dossier: UnderwritingDossier | null = null,
  review: UnderwritingReviewRecord | null = null,
) {
  const eventName = `stayfi:issuance-updated:${dealId}`;
  const raw = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(eventName, onStoreChange);
      return () => window.removeEventListener(eventName, onStoreChange);
    },
    () => sessionStorage.getItem(issuanceStorageKey(dealId)) ?? missingMarker,
    () => loadingMarker,
  );
  const ready = raw !== loadingMarker;
  const issuance = useMemo(
    () => (ready && raw !== missingMarker ? parsePackage(raw) : null),
    [raw, ready],
  );
  const [fingerprintedDossier, setFingerprintedDossier] = useState<{
    source: UnderwritingDossier;
    sha256: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    if (dossier) {
      void sha256Json(dossier).then((fingerprint) => {
        if (active) setFingerprintedDossier({ source: dossier, sha256: fingerprint });
      });
    }
    return () => {
      active = false;
    };
  }, [dossier]);

  const dossierSha256 = fingerprintedDossier?.source === dossier
    ? fingerprintedDossier.sha256
    : null;

  const isCurrent = Boolean(
    issuance &&
    review &&
    dossierSha256 &&
    issuance.audit.review_receipt_sha256 === review.receipt_sha256 &&
    issuance.audit.dossier_sha256 === dossierSha256 &&
    review.dossier_sha256 === dossierSha256
  );

  async function prepareIssuance(input: {
    dossier: UnderwritingDossier;
    review: UnderwritingReviewRecord;
    spvDescriptor: string;
    escrowControlReference: string;
  }) {
    const prepared = await createSRNIssuancePackage({ dealId, ...input });
    sessionStorage.setItem(issuanceStorageKey(dealId), JSON.stringify(prepared));
    window.dispatchEvent(new Event(eventName));
    return prepared;
  }

  return { issuance, ready, isCurrent, prepareIssuance };
}
