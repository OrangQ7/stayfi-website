"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  isUnderwritingDossier,
  underwritingStorageKey,
  type StoredUnderwritingRun,
} from "@/lib/underwriting-schema";

function parseStoredRun(raw: string | null): StoredUnderwritingRun | null {
  try {
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredUnderwritingRun;
    if (!isUnderwritingDossier(parsed.dossier) || !parsed.meta) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function useStoredUnderwritingRun(dealId: string) {
  const loadingMarker = "__stayfi_loading__";
  const missingMarker = "__stayfi_missing__";
  const raw = useSyncExternalStore(
    () => () => undefined,
    () => sessionStorage.getItem(underwritingStorageKey(dealId)) ?? missingMarker,
    () => loadingMarker,
  );
  const ready = raw !== loadingMarker;
  const run = useMemo(
    () => (ready && raw !== missingMarker ? parseStoredRun(raw) : null),
    [missingMarker, raw, ready],
  );

  return { run, ready };
}
