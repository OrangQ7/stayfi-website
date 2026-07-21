"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

type Mechanism = {
  title: string;
  eyebrow: string;
  body: string;
  metric: string;
  asset: string;
  alt: string;
};

const mechanisms: Mechanism[] = [
  {
    title: "Origination",
    eyebrow: "PMS + bank feeds",
    body: "Score booked seasonal revenue before capital moves.",
    metric: "10-25% advance",
    asset: "/stayfi/asset-data-widget.png",
    alt: "StayFi dark financial dashboard showing seasonal RevPAR data",
  },
  {
    title: "Issuance",
    eyebrow: "SPV-backed SRNs",
    body: "Mint permissioned revenue notes to whitelisted USDC investors.",
    metric: "ERC-3643",
    asset: "/stayfi/asset-keycard-tokenization.png",
    alt: "Hotel keycard merging with smart contract and USDC visual",
  },
  {
    title: "Settlement",
    eyebrow: "Escrow waterfall",
    body: "Route realized room revenue through programmable payouts.",
    metric: "monthly reconcile",
    asset: "/stayfi/waterfall-settlement.svg",
    alt: "Waterfall settlement UI with data streams flowing into investor wallets",
  },
  {
    title: "Backstop",
    eyebrow: "$STAY vault",
    body: "Backstop operational faults without insuring hotel demand.",
    metric: "first-loss ops",
    asset: "/stayfi/asset-alpine-resort.png",
    alt: "Digital shield protecting a seasonal resort asset",
  },
];

const marketStats = [
  ["TAM", "$20.4B", "European seasonal hotel financing gap"],
  ["SAM", "$3.6B", "Auditable high-seasonality first markets"],
  ["5Y SOM", "$122.5M", "Annual SRN origination target"],
  ["Hotels", "350", "Active properties at five-year scale"],
];

type SeasonalDeal = {
  id: string;
  name: string;
  location: string;
  season: string;
  status: string;
  srnSize: string;
  subscribed: string;
  advanceRate: string;
  occupancy: string;
  projectedRevenue: string;
  token: string;
  minimum: string;
  maturity: string;
  image: string;
  feeds: string[];
  waterfall: string[];
};

const seasonalDeals: SeasonalDeal[] = [
  {
    id: "alpenstern",
    name: "Hotel Alpenstern Zermatt",
    location: "Zermatt, Switzerland",
    season: "Winter 2026",
    status: "Whitelist open",
    srnSize: "1,200,000 USDC",
    subscribed: "72%",
    advanceRate: "18%",
    occupancy: "87%",
    projectedRevenue: "6.8M CHF",
    token: "SRN-ALP26",
    minimum: "25,000 USDC",
    maturity: "Apr 30, 2026",
    image: "/stayfi/hotel-alpenstern-zermatt.png",
    feeds: ["PMS bookings", "Stripe payouts", "Bank escrow", "Room tax trail"],
    waterfall: ["Escrow lockbox", "Servicer reserve", "SRN settlement", "Hotel residual"],
  },
  {
    id: "leman",
    name: "Lac Leman Boutique Hotel",
    location: "Geneva, Switzerland",
    season: "Summer 2026",
    status: "Funding",
    srnSize: "760,000 USDC",
    subscribed: "44%",
    advanceRate: "15%",
    occupancy: "81%",
    projectedRevenue: "4.1M CHF",
    token: "SRN-LEM26",
    minimum: "10,000 USDC",
    maturity: "Sep 15, 2026",
    image: "/stayfi/hotel-lac-leman.png",
    feeds: ["CRS pickup", "Card processor", "SPV bank feed", "Audit pack"],
    waterfall: ["Guest receipts", "Tax reserve", "USDC payout", "Operator balance"],
  },
  {
    id: "verbier",
    name: "Maison Verbier Lodge",
    location: "Valais, Switzerland",
    season: "Ski 2026",
    status: "Data room",
    srnSize: "980,000 USDC",
    subscribed: "18%",
    advanceRate: "20%",
    occupancy: "84%",
    projectedRevenue: "5.3M CHF",
    token: "SRN-VRB26",
    minimum: "50,000 USDC",
    maturity: "May 12, 2026",
    image: "/stayfi/hotel-verbier-lodge.png",
    feeds: ["Booking pace", "Bank statements", "Occupancy model", "SPV docs"],
    waterfall: ["Revenue capture", "Ops reserve", "Investor ledger", "Hotel sweep"],
  },
];

const portfolioRows = [
  ["SRN-ALP26", "320", "Active", "Feb 28, 2026", "18,420 USDC"],
  ["SRN-LEM26", "140", "Funding", "Jul 15, 2026", "Pending"],
  ["SRN-VRB26", "90", "Review", "Mar 31, 2026", "Pending"],
];

const subscribeSteps = [
  "Connect wallet",
  "Verify KYC / accreditation",
  "Choose USDC allocation",
  "Mint permissioned SRNs",
];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function useWindowScroll() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrollY(window.scrollY);
    };

    const schedule = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return scrollY;
}

function useSectionProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      if (!ref.current) {
        setProgress(0);
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const nextProgress = scrollable > 0 ? clamp(-rect.top / scrollable) : 0;

      setProgress(nextProgress);
    };

    const schedule = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return { progress, ref };
}

export default function Home() {
  const pageRef = useRef<HTMLElement | null>(null);
  const scrollY = useWindowScroll();
  const [selectedDealId, setSelectedDealId] = useState(seasonalDeals[0].id);
  const { progress: heroProgress, ref: heroRef } =
    useSectionProgress<HTMLElement>();
  const { progress: mechanismProgress, ref: mechanismRef } =
    useSectionProgress<HTMLElement>();
  const activeFloat = clamp(
    mechanismProgress * (mechanisms.length - 1),
    0,
    mechanisms.length - 1,
  );
  const activeIndex = Math.round(activeFloat);
  const selectedDeal =
    seasonalDeals.find((deal) => deal.id === selectedDealId) ??
    seasonalDeals[0];

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".js-home-enter", {
        autoAlpha: 0,
        y: 18,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.08,
        clearProps: "transform,opacity,visibility",
      });
    });

    return () => media.revert();
  }, { scope: pageRef });

  return (
    <main className="min-h-screen bg-black text-white" ref={pageRef}>
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/72 backdrop-blur-xl">
        <nav className="js-home-enter mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link className="flex items-center gap-2 text-sm font-black lowercase" href="/">
            <span className="grid h-5 w-5 place-items-center rounded-full border border-white/70 text-[10px] leading-none text-white">
              s
            </span>
            stayfi
          </Link>
          <div className="flex items-center gap-3 text-xs font-bold uppercase sm:gap-6">
            <Link className="hidden text-white/52 transition hover:text-white sm:block" href="/portfolio">Investor view</Link>
            <Link className="bg-[#0B63FF] px-4 py-2 text-white transition hover:bg-white hover:text-black" href="/originate">Start underwriting</Link>
          </div>
        </nav>
      </header>

      <section
        id="top"
        ref={heroRef}
        className="relative h-[220vh] bg-black"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0 bg-black" />
          <div className="grain absolute inset-0 opacity-10" />
          <HeroSandwich progress={heroProgress} scrollY={scrollY} />
          <div className="js-home-enter absolute left-[5vw] top-[8vh] z-10 w-[92vw]">
            <p className="mb-5 text-[11px] font-black uppercase tracking-[0.16em] text-white/42 sm:mb-7">
              Seasonal hospitality RWA protocol
            </p>
            <h1
              className="max-w-[78rem] text-[clamp(4.8rem,13.8vw,12.8rem)] font-black leading-[0.88] tracking-normal text-[#D4D4D4]"
              style={{
                transform: `translate3d(0, ${heroProgress * -88}px, 0)`,
              }}
            >
              liquid
              <br />
              seasonal
              <br />
              hotels
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto grid min-h-[72vh] max-w-7xl place-items-center px-5 py-24 sm:px-8">
        <div className="interactive-card w-full max-w-5xl border-t border-white/12 pt-9">
          <p className="text-xs font-black uppercase text-white/42">Mission</p>
          <h1
            className="mt-8 max-w-4xl text-5xl font-black leading-none text-white sm:text-7xl"
          >
            Turn booked seasonal revenue into liquid on-chain notes.
          </h1>
          <Link
            className="tech-action mt-9 inline-flex min-h-14 items-center bg-[#0B63FF] px-6 text-sm font-black uppercase tracking-[0.06em] text-white transition hover:bg-white hover:text-black"
            href="/originate"
          >
            Launch underwriting demo →
          </Link>
        </div>
      </section>

      <SeasonalNotesApp
        selectedDeal={selectedDeal}
        selectedDealId={selectedDealId}
        setSelectedDealId={setSelectedDealId}
      />

      <section
        id="mechanism"
        ref={mechanismRef}
        className="relative mx-auto h-auto max-w-7xl px-5 py-20 sm:px-8 lg:h-[330vh] lg:py-0"
      >
        <div className="hidden lg:sticky lg:top-0 lg:grid lg:h-screen lg:grid-cols-2 lg:items-center lg:gap-8">
          <ProtocolStack activeFloat={activeFloat} activeIndex={activeIndex} />
          <MechanismScrollCopy
            activeFloat={activeFloat}
            activeIndex={activeIndex}
          />
        </div>
        <div className="mt-12 space-y-10 lg:hidden">
          <p className="text-xs font-black uppercase text-white/42">Mechanism</p>
          {mechanisms.map((item, index) => (
            <article
              className="flex min-h-[74vh] flex-col justify-center border-t border-white/12 py-16"
              key={item.title}
            >
              <p className="text-sm font-black uppercase text-[#0B63FF]">
                0{index + 1} {item.eyebrow}
              </p>
              <h2 className="mt-5 text-5xl font-black leading-none text-white sm:text-7xl">
                {item.title}
              </h2>
              <p className="mt-7 max-w-xl text-xl leading-8 text-white/62">
                {item.body}
              </p>
              <div className="mt-8 inline-flex w-fit border border-[#0B63FF]/70 bg-[#0B63FF]/12 px-4 py-3 text-xs font-black uppercase text-[#87B7FF]">
                {item.metric}
              </div>
            </article>
          ))}
        </div>
      </section>

      <InvestorConsole selectedDeal={selectedDeal} />

      <section id="market" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="border-t border-white/12 pt-8">
          <p className="text-xs font-black uppercase text-white/42">
            Market
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {marketStats.map(([label, value, detail]) => (
              <div
                className="interactive-card min-h-44 border border-white/12 bg-white/[0.025] p-5"
                key={label}
              >
                <p className="text-xs font-black uppercase text-white/42">
                  {label}
                </p>
                <p className="mt-8 text-5xl font-black text-white">{value}</p>
                <p className="mt-4 text-sm leading-5 text-white/48">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="access" className="px-5 pb-8 sm:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#0B63FF] px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <h2 className="max-w-4xl text-5xl font-black leading-none sm:text-7xl lg:text-8xl">
              Build seasonal liquidity. explore StayFi.
            </h2>
            <div className="grid gap-3 lg:w-96 lg:justify-self-end">
              <Link className="tech-action flex h-14 items-center justify-center bg-white px-6 text-sm font-black uppercase text-[#0B63FF] transition hover:bg-[#E0FFB3]" href="/originate">
                Open underwriting workspace
              </Link>
              <Link className="tech-action flex h-14 items-center justify-center border border-white/60 px-6 text-sm font-black uppercase text-white transition hover:border-white hover:bg-white/10" href="/portfolio">
                View investor audit trail
              </Link>
            </div>
          </div>
        </div>
        <footer className="mx-auto flex max-w-7xl flex-col gap-7 py-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="text-6xl font-black leading-none text-white sm:text-8xl lg:text-[8rem]">
            finance the peak
          </p>
          <p className="max-w-sm text-sm leading-6 text-white/48">
            StayFi turns seasonal revenue into permissioned on-chain assets.
          </p>
        </footer>
      </section>
    </main>
  );
}

function SeasonalNotesApp({
  selectedDeal,
  selectedDealId,
  setSelectedDealId,
}: {
  selectedDeal: SeasonalDeal;
  selectedDealId: string;
  setSelectedDealId: (id: string) => void;
}) {
  const detailRef = useRef<HTMLDivElement | null>(null);
  const subscriptionProgress = Number.parseInt(selectedDeal.subscribed, 10);

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        detailRef.current,
        { autoAlpha: 0.35, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
        },
      );
      gsap.fromTo(
        ".js-progress-fill",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.75, ease: "power3.out" },
      );
      gsap.from(".js-deal-stat", {
        autoAlpha: 0,
        y: 8,
        duration: 0.35,
        ease: "power2.out",
        stagger: 0.045,
        clearProps: "transform,opacity,visibility",
      });
    });

    return () => media.revert();
  }, { dependencies: [selectedDealId], revertOnUpdate: true, scope: detailRef });

  return (
    <section id="app" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="border-t border-white/12 pt-8">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase text-[#87B7FF]">
              Product app demo
            </p>
            <h2 className="mt-5 max-w-3xl text-5xl font-black leading-none text-white sm:text-7xl">
              Live Seasonal Notes
            </h2>
          </div>
          <p className="max-w-2xl text-base font-bold leading-7 text-white/52 lg:justify-self-end">
            Browse hotel-backed SRNs, inspect PMS-verified seasonal revenue,
            and follow an auditable financing workflow. Demo data for product
            illustration only; no live investment is offered.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[0.84fr_1.16fr]">
          <div className="space-y-3">
            {seasonalDeals.map((deal) => {
              const isActive = deal.id === selectedDealId;

              return (
                <button
                  aria-pressed={isActive}
                  className={`interactive-card w-full border p-5 text-left transition ${
                    isActive
                      ? "border-[#0B63FF] bg-[#0B63FF]/12 shadow-[0_0_70px_rgba(11,99,255,0.18)]"
                      : "border-white/12 bg-white/[0.025] hover:border-white/28"
                  }`}
                  key={deal.id}
                  onClick={() => setSelectedDealId(deal.id)}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-[11px] font-black uppercase text-white/42">
                        {deal.location}
                      </p>
                      <h3 className="mt-3 text-2xl font-black leading-none text-white">
                        {deal.name}
                      </h3>
                    </div>
                    <span className="shrink-0 border border-white/14 px-3 py-2 text-[11px] font-black uppercase text-[#E0FFB3]">
                      {deal.status}
                    </span>
                  </div>
                  <div className="mt-7 grid grid-cols-3 gap-3 text-sm">
                    <DealMiniStat label="Size" value={deal.srnSize} />
                    <DealMiniStat label="Season" value={deal.season} />
                    <DealMiniStat label="Filled" value={deal.subscribed} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="deal-detail-panel border border-white/12 bg-[#050505] p-4 sm:p-6" ref={detailRef}>
            <div className="grid gap-6 lg:grid-cols-[0.86fr_1fr]">
              <div className="relative min-h-72 overflow-hidden border border-white/10 bg-black">
                <Image
                  alt={`${selectedDeal.name} asset preview`}
                  className="object-cover opacity-72"
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  src={selectedDeal.image}
                  unoptimized
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5">
                  <p className="text-[11px] font-black uppercase text-white/46">
                    {selectedDeal.token}
                  </p>
                  <p className="mt-2 text-3xl font-black leading-none text-white">
                    {selectedDeal.name}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="border border-[#E0FFB3]/50 bg-[#E0FFB3]/10 px-3 py-2 text-[11px] font-black uppercase text-[#E0FFB3]">
                    {selectedDeal.status}
                  </span>
                  <span className="border border-white/12 px-3 py-2 text-[11px] font-black uppercase text-white/52">
                    ERC-3643 permissioned
                  </span>
                </div>
                <h3 className="mt-6 text-4xl font-black leading-none text-white sm:text-5xl">
                  {selectedDeal.season} revenue note
                </h3>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <DealMetric className="js-deal-stat" label="SRN size" value={selectedDeal.srnSize} />
                  <DealMetric
                    className="js-deal-stat"
                    label="Advance rate"
                    value={selectedDeal.advanceRate}
                  />
                  <DealMetric
                    className="js-deal-stat"
                    label="Forecast occupancy"
                    value={selectedDeal.occupancy}
                  />
                  <DealMetric
                    className="js-deal-stat"
                    label="Projected revenue"
                    value={selectedDeal.projectedRevenue}
                  />
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-black uppercase text-white/44">
                    <span>Subscription progress</span>
                    <span>{selectedDeal.subscribed}</span>
                  </div>
                  <div className="mt-3 h-2 bg-white/10">
                    <div
                      className="js-progress-fill deal-progress-fill h-full bg-[#E0FFB3]"
                      style={{ width: `${subscriptionProgress}%` }}
                    />
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link
                    className="tech-action flex h-12 items-center justify-center bg-white px-5 text-center text-sm font-black uppercase text-black transition hover:bg-[#E0FFB3]"
                    href="/originate"
                  >
                    Start underwriting
                  </Link>
                  <Link
                    className="tech-action flex h-12 items-center justify-center border border-white/18 px-5 text-center text-sm font-black uppercase text-white/72 transition hover:border-white/40 hover:text-white"
                    href="/underwriting/alpenstern-2026-winter"
                  >
                    View sample evidence
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <InfoList title="Verified feeds" values={selectedDeal.feeds} />
              <InfoList title="Escrow waterfall" values={selectedDeal.waterfall} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DealMiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase text-white/34">{label}</p>
      <p className="mt-2 truncate font-black text-white/78">{value}</p>
    </div>
  );
}

function DealMetric({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`interactive-card border border-white/10 bg-white/[0.025] p-4 ${className}`}>
      <p className="text-[10px] font-black uppercase text-white/36">{label}</p>
      <p className="mt-3 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function InfoList({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="border border-white/10 bg-black/50 p-5">
      <p className="text-xs font-black uppercase text-white/42">{title}</p>
      <div className="mt-4 space-y-3">
        {values.map((value, index) => (
          <div className="flex items-center gap-3" key={value}>
            <span className="grid h-6 w-6 shrink-0 place-items-center border border-white/12 text-[10px] font-black text-[#87B7FF]">
              {index + 1}
            </span>
            <p className="text-sm font-bold text-white/68">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InvestorConsole({ selectedDeal }: { selectedDeal: SeasonalDeal }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border border-white/12 bg-[#050505] p-5 sm:p-6">
          <p className="text-xs font-black uppercase text-[#87B7FF]">
            Investor console
          </p>
          <h2 className="mt-5 text-5xl font-black leading-none text-white sm:text-6xl">
            Portfolio and settlement view
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <DealMetric label="Portfolio value" value="1,840,000 USDC" />
            <DealMetric label="Active SRNs" value="4 notes" />
            <DealMetric label="Next settlement" value="Feb 28, 2026" />
            <DealMetric label="Pending payout" value="42,800 USDC" />
          </div>
          <div className="mt-6 overflow-hidden border border-white/10">
            {portfolioRows.map(([asset, tokens, status, payment, payout]) => (
              <div
                className="grid grid-cols-[1fr_0.6fr_0.8fr] gap-4 border-b border-white/10 p-4 text-sm last:border-b-0 sm:grid-cols-[1fr_0.5fr_0.6fr_0.8fr_0.8fr]"
                key={asset}
              >
                <span className="font-black text-white">{asset}</span>
                <span className="text-white/54">{tokens}</span>
                <span className="font-bold text-[#E0FFB3]">{status}</span>
                <span className="hidden text-white/54 sm:block">{payment}</span>
                <span className="hidden text-white/54 sm:block">{payout}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="border border-white/12 bg-[#050505] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-white/42">
                  Subscribe flow
                </p>
                <h3 className="mt-4 text-3xl font-black leading-none text-white">
                  {selectedDeal.token} allocation
                </h3>
              </div>
              <span className="border border-[#E0FFB3]/50 px-3 py-2 text-xs font-black uppercase text-[#E0FFB3]">
                {selectedDeal.minimum} min
              </span>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-4">
              {subscribeSteps.map((step, index) => (
                <div className="border border-white/10 bg-white/[0.025] p-4" key={step}>
                  <p className="text-xl font-black text-[#87B7FF]">
                    0{index + 1}
                  </p>
                  <p className="mt-5 text-sm font-black leading-5 text-white">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/12 bg-[#050505] p-5 sm:p-6">
            <p className="text-xs font-black uppercase text-white/42">
              Compliance boundary
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Reg D / Reg S", "SPV per deal", "No demand guarantee"].map(
                (item) => (
                  <div
                    className="border border-white/10 bg-black/60 p-4 text-sm font-black uppercase text-white/68"
                    key={item}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
            <p className="mt-5 text-sm font-bold leading-6 text-white/46">
              SRNs represent seasonal revenue participation rights, not hotel
              equity. Figures shown are illustrative demo data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MechanismScrollCopy({
  activeFloat,
  activeIndex,
}: {
  activeFloat: number;
  activeIndex: number;
}) {
  return (
    <div
      className="relative h-[620px] overflow-hidden"
      data-timeline-stage={mechanisms[activeIndex].title}
    >
      <div className="absolute left-0 top-0 z-20 flex items-center gap-4">
        <p className="text-xs font-black uppercase text-white/42">Mechanism</p>
        <div className="h-px w-24 bg-white/14" />
        <p className="text-xs font-black uppercase text-[#87B7FF]">
          0{activeIndex + 1} / 04
        </p>
      </div>
      {mechanisms.map((item, index) => (
        <article
          key={item.title}
          className="absolute left-0 right-0 top-1/2 will-change-transform"
          style={{
            opacity: clamp(1 - Math.abs(index - activeFloat) * 1.05, 0, 1),
            transform: `translate3d(0, calc(-50% + ${(index - activeFloat) * 360}px), 0)`,
          }}
        >
          <p className="text-sm font-black uppercase text-[#87B7FF]">
            0{index + 1} {item.eyebrow}
          </p>
          <h2 className="mt-5 text-6xl font-black leading-none text-white xl:text-8xl">
            {item.title}
          </h2>
          <p className="mt-7 max-w-lg text-2xl font-bold leading-8 text-white/62">
            {item.body}
          </p>
        </article>
      ))}
    </div>
  );
}

function HeroSandwich({
  progress,
  scrollY,
}: {
  progress: number;
  scrollY: number;
}) {
  const eased = progress * progress * (3 - 2 * progress);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <HeroChain
        badgeLeft="46%"
        badgeType="money"
        className="left-[-30vw] top-[88%] z-[4] w-[168vw] opacity-[0.24]"
        id="hero-back-a"
        reverse
        rotate={-7}
        style={{
          transform: `translate3d(${scrollY * -0.035}px, ${eased * -250}px, 0) rotate(-7deg)`,
        }}
      />
      <HeroChain
        badgeLeft="43%"
        badgeType="money"
        className="left-[-28vw] top-[116%] z-[22] w-[166vw] opacity-90"
        id="hero-front-a"
        rotate={-11}
        style={{
          transform: `translate3d(${-130 - eased * 170}px, ${78 - eased * 590}px, 0) rotate(-11deg)`,
        }}
      />
      <HeroChain
        badgeLeft="64%"
        badgeType="house"
        className="left-[-18vw] top-[126%] z-[24] w-[154vw] opacity-82"
        id="hero-front-b"
        reverse
        rotate={6}
        style={{
          transform: `translate3d(${70 + eased * -220}px, ${72 - eased * 470}px, 0) rotate(6deg)`,
        }}
      />
      <HeroChain
        badgeLeft="34%"
        badgeType="house"
        className="left-[-34vw] top-[136%] z-[26] w-[176vw] opacity-[0.58]"
        id="hero-front-c"
        rotate={-4}
        style={{
          transform: `translate3d(${-80 + eased * 120}px, ${82 - eased * 380}px, 0) rotate(-4deg)`,
        }}
      />
    </div>
  );
}

function HeroChain({
  badgeLeft,
  badgeType,
  className,
  id,
  reverse,
  rotate,
  style,
}: {
  badgeLeft: string;
  badgeType: "house" | "money";
  className: string;
  id: string;
  reverse?: boolean;
  rotate: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`hero-chain-wrap pointer-events-none absolute h-28 ${className}`}
      style={style}
    >
      <ChainRail className="left-0 top-0 h-28 w-full" id={id} reverse={reverse} />
      <HeroIconBadge
        counterRotate={-rotate}
        kind={badgeType}
        left={badgeLeft}
      />
    </div>
  );
}

function HeroIconBadge({
  counterRotate,
  kind,
  left,
}: {
  counterRotate: number;
  kind: "house" | "money";
  left: string;
}) {
  return (
    <div
      className="absolute top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-[#2B2B2B] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_22px_46px_rgba(0,0,0,0.7)] sm:h-24 sm:w-24"
      style={{
        left,
        transform: `translate(-50%, -50%) rotate(${counterRotate}deg)`,
      }}
    >
      <svg
        aria-hidden="true"
        className="h-11 w-11"
        fill="none"
        stroke="#E0FFB3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        viewBox="0 0 64 64"
      >
        {kind === "house" ? (
          <>
            <path d="M10 30 32 13l22 17" />
            <path d="M17 29v23h30V29" />
            <path d="M27 52V39h10v13" />
          </>
        ) : (
          <>
            <path d="M12 20h40v27H12z" />
            <path d="M21 34h1" />
            <path d="M42 34h1" />
            <path d="M32 24v20" />
            <path d="M39 28c-3-4-14-4-14 2 0 8 14 3 14 10 0 6-11 6-15 1" />
          </>
        )}
      </svg>
    </div>
  );
}

function ChainRail({
  className,
  id,
  reverse = false,
  style,
}: {
  className: string;
  id: string;
  reverse?: boolean;
  style?: React.CSSProperties;
}) {
  const links = Array.from({ length: 30 }, (_, index) => index);
  const gradientId = `${id}-metal`;

  return (
    <svg
      aria-hidden="true"
      className={`chain-rail pointer-events-none absolute ${className}`}
      preserveAspectRatio="none"
      style={style}
      viewBox="0 0 1800 150"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#050505" />
          <stop offset="0.26" stopColor="#2F2F2F" />
          <stop offset="0.52" stopColor="#A8A8A8" />
          <stop offset="0.72" stopColor="#5A5A5A" />
          <stop offset="1" stopColor="#0C0C0C" />
        </linearGradient>
      </defs>
      <g
        className={reverse ? "chain-track chain-track-reverse" : "chain-track"}
      >
        {links.map((link) => {
          const x = link * 61 - 34;
          const rotation = link % 2 === 0 ? -13 : 13;

          return (
            <g
              className="chain-link"
              key={link}
              style={{ animationDelay: `${link * -0.12}s` }}
              transform={`translate(${x} 75) rotate(${rotation})`}
            >
              <rect
                fill="#070707"
                fillOpacity="0.42"
                height="34"
                rx="15"
                stroke={`url(#${gradientId})`}
                strokeWidth="10"
                width="92"
                x="-46"
                y="-17"
              />
              <rect
                fill="none"
                height="16"
                rx="8"
                stroke="#1B1B1B"
                strokeOpacity="0.86"
                strokeWidth="4"
                width="62"
                x="-31"
                y="-8"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function ProtocolStack({
  activeFloat,
  activeIndex,
}: {
  activeFloat: number;
  activeIndex: number;
}) {
  return (
    <div className="relative min-h-[620px] w-full" data-active={mechanisms[activeIndex].title}>
      <div className="absolute inset-0 rounded-full bg-[#0B63FF]/14 blur-[120px]" />
      <div className="relative h-[620px] overflow-hidden border border-white/12 bg-[#050505] p-4 shadow-[0_0_120px_rgba(11,99,255,0.14)] sm:p-6">
        {mechanisms.map((item, index) => {
          const distance = index - activeFloat;
          const isActive = Math.round(activeFloat) === index;

          return (
            <article
              className="absolute left-4 right-4 top-8 border border-white/12 bg-[#0A0A0A] p-4 shadow-[0_18px_44px_rgba(0,0,0,0.42)] transition-[opacity,transform] duration-500 sm:left-6 sm:right-6 sm:p-5"
              key={item.title}
              style={{
                opacity: isActive ? 1 : Math.max(0.18, 0.58 - Math.abs(distance) * 0.18),
                transform: `translate3d(${distance * 34}px, ${distance * 48}px, 0) rotate(${distance * 2.2}deg) scale(${isActive ? 1 : 0.9})`,
                zIndex: Math.round(30 - Math.abs(distance) * 3),
              }}
            >
              <Image
                alt={item.alt}
                className="aspect-[16/10] w-full border border-white/10 object-cover"
                height={400}
                priority={index === 0}
                src={item.asset}
                unoptimized
                width={640}
              />
              <div className="mt-5 flex items-start justify-between gap-5">
                <div>
                  <p className="text-[11px] font-black uppercase text-white/42">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-2 text-3xl font-black text-white">
                    {item.title}
                  </h3>
                </div>
                <span className="shrink-0 border border-[#0B63FF]/70 px-3 py-2 text-[11px] font-black uppercase text-[#87B7FF]">
                  {item.metric}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
