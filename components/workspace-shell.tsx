import Link from "next/link";
import type { ReactNode } from "react";

const stageLabels = [
  { id: "originate", label: "01 Originate" },
  { id: "underwriting", label: "02 Underwrite" },
  { id: "notes", label: "03 Note terms" },
  { id: "portfolio", label: "04 Portfolio" },
] as const;

export function WorkspaceShell({
  active,
  dealId = "alpenstern-2026-winter",
  children,
}: {
  active: (typeof stageLabels)[number]["id"];
  dealId?: string;
  children: ReactNode;
}) {
  const stages = stageLabels.map((stage) => ({
    ...stage,
    href:
      stage.id === "originate"
        ? "/originate"
        : stage.id === "underwriting"
          ? `/underwriting/${dealId}`
          : stage.id === "notes"
            ? `/notes/${dealId}`
            : `/portfolio/${dealId}`,
  }));
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/70 text-xs font-black">s</span>
            <span>
              <span className="block text-sm font-black lowercase">stayfi</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Underwriting workspace</span>
            </span>
          </Link>
          <span className="border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-amber-200">Synthetic demo · no real funds</span>
        </div>
      </header>

      <nav aria-label="Underwriting stages" className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 sm:px-8">
          {stages.map((stage) => (
            <Link
              className={`whitespace-nowrap border px-3 py-2 text-[11px] font-black uppercase tracking-[0.08em] transition ${active === stage.id ? "border-[#0B63FF] bg-[#0B63FF] text-white" : "border-white/10 text-white/42 hover:border-white/30 hover:text-white"}`}
              href={stage.href}
              key={stage.id}
            >
              {stage.label}
            </Link>
          ))}
        </div>
      </nav>

      {children}
    </main>
  );
}

export function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.025] p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">{label}</p>
      <p className="mt-5 text-3xl font-black text-white">{value}</p>
      {detail ? <p className="mt-2 text-sm leading-5 text-white/45">{detail}</p> : null}
    </div>
  );
}

export function PageIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="max-w-4xl">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#4D8CFF]">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-black leading-none sm:text-6xl">{title}</h1>
      <p className="mt-6 max-w-3xl text-base leading-7 text-white/55 sm:text-lg">{body}</p>
    </div>
  );
}
