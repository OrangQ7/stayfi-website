"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { ReactNode } from "react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

export function RouteMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(root.current, {
        autoAlpha: 0,
        y: 12,
        duration: 0.5,
        ease: "power2.out",
        clearProps: "transform,opacity,visibility",
      });
    });

    return () => media.revert();
  }, { scope: root });

  return <div className="motion-route" ref={root}>{children}</div>;
}
