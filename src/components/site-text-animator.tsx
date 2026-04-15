"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { animateSplitTextElement, cleanupSplitText, type SplitTextTarget } from "@/components/SplitText";

const TEXT_SELECTOR = [
  "main h1",
  "main h2",
  "main h3",
  "main h4",
  "main p",
  "main li",
].join(", ");

function shouldAnimateElement(element: HTMLElement) {
  if (element.closest("[data-no-split]")) {
    return false;
  }

  if (element.closest("a, button")) {
    return false;
  }

  if (element.closest("[role='dialog'], [aria-modal='true']")) {
    return false;
  }

  const directChildren = Array.from(element.children);
  if (
    directChildren.some((child) =>
      child.matches("h1, h2, h3, h4, p, a, button, li, ul, ol, section, article, div, img, svg, input, textarea, iframe"),
    )
  ) {
    return false;
  }

  const text = element.textContent?.replace(/\s+/g, " ").trim() ?? "";
  if (text.length < 3) {
    return false;
  }

  if (element.matches("p, li") && text.length < 32) {
    return false;
  }

  return true;
}

export function SiteTextAnimator() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;
    const activeTargets: SplitTextTarget[] = [];

    const setupAnimations = async () => {
      try {
        await document.fonts.ready;
      } catch {
        // Continue even if font loading APIs are unavailable.
      }

      if (cancelled) {
        return;
      }

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isTouch = window.matchMedia("(hover: none)").matches;
      const isMobileOrTablet = window.innerWidth <= 1024;
      
      if (prefersReducedMotion || isTouch || isMobileOrTablet) {
        return;
      }

      const isLowPowerDevice = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 8;
      const elements = Array.from(document.querySelectorAll<HTMLElement>(TEXT_SELECTOR)).filter(shouldAnimateElement);

      for (const element of elements) {
        if (cancelled) {
          return;
        }

        const target = element as SplitTextTarget;
        const text = target.textContent?.trim() ?? "";
        const useWordSplit = isLowPowerDevice || target.matches("p, li") || text.length > 36;

        const animation = animateSplitTextElement(target, {
          splitType: useWordSplit ? "words" : "chars",
          delay: useWordSplit ? 14 : 10,
          duration: useWordSplit ? 0.56 : 0.68,
          from: { opacity: 0, y: useWordSplit ? 10 : 14 },
          to: { opacity: 1, y: 0 },
          threshold: 0.18,
          rootMargin: "-24px",
        });

        if (animation) {
          activeTargets.push(target);
        }
      }

      ScrollTrigger.refresh();
    };

    rafId = window.requestAnimationFrame(() => {
      void setupAnimations();
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      activeTargets.forEach((target) => cleanupSplitText(target));
    };
  }, [pathname]);

  return null;
}
