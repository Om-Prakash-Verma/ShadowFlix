"use client";

import { createElement, useEffect, useRef, useState, type CSSProperties, type Ref } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
}

export type SplitTextTarget = HTMLElement & {
  _rbSplitInstance?: GSAPSplitText;
  _rbSplitTween?: gsap.core.Tween;
};

export interface SplitTextAnimationOptions {
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: SplitTextProps["splitType"];
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  onComplete?: () => void;
}

const DEFAULT_FROM = { opacity: 0, y: 28 };
const DEFAULT_TO = { opacity: 1, y: 0 };

function resolveScrollStart(threshold: number, rootMargin: string) {
  const startPct = (1 - threshold) * 100;
  const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
  const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
  const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
  const sign =
    marginValue === 0
      ? ""
      : marginValue < 0
        ? `-=${Math.abs(marginValue)}${marginUnit}`
        : `+=${marginValue}${marginUnit}`;

  return `top ${startPct}%${sign}`;
}

function resolveTargets(splitInstance: GSAPSplitText, splitType: NonNullable<SplitTextProps["splitType"]>) {
  if (splitType.includes("chars") && splitInstance.chars?.length) {
    return splitInstance.chars;
  }

  if (splitType.includes("words") && splitInstance.words.length) {
    return splitInstance.words;
  }

  if (splitType.includes("lines") && splitInstance.lines.length) {
    return splitInstance.lines;
  }

  return splitInstance.chars || splitInstance.words || splitInstance.lines || [];
}

export function cleanupSplitText(target: SplitTextTarget) {
  target._rbSplitTween?.scrollTrigger?.kill();
  target._rbSplitTween?.kill();

  if (target._rbSplitInstance) {
    try {
      target._rbSplitInstance.revert();
    } catch {
      // Ignore split cleanup failures during route changes.
    }
  }

  delete target._rbSplitTween;
  delete target._rbSplitInstance;
  delete target.dataset.splitReady;
}

export function animateSplitTextElement(
  target: SplitTextTarget,
  {
    delay = 35,
    duration = 0.9,
    ease = "power3.out",
    splitType = "chars",
    from = DEFAULT_FROM,
    to = DEFAULT_TO,
    threshold = 0.12,
    rootMargin = "-80px",
    onComplete,
  }: SplitTextAnimationOptions = {},
) {
  cleanupSplitText(target);

  const splitInstance = new GSAPSplitText(target, {
    type: splitType,
    smartWrap: true,
    autoSplit: splitType === "lines",
    linesClass: "split-line",
    wordsClass: "split-word",
    charsClass: "split-char",
    reduceWhiteSpace: false,
  });

  const targets = resolveTargets(splitInstance, splitType);
  if (!targets.length) {
    splitInstance.revert();
    return null;
  }

  const tween = gsap.fromTo(
    targets,
    { force3D: true, willChange: "transform, opacity", ...from },
    {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      scrollTrigger: {
        trigger: target,
        start: resolveScrollStart(threshold, rootMargin),
        once: true,
        fastScrollEnd: true,
        anticipatePin: 0.4,
      },
      onComplete,
    },
  );

  target._rbSplitInstance = splitInstance;
  target._rbSplitTween = tween;
  target.dataset.splitReady = "true";

  return { splitInstance, tween };
}

const SplitText = ({
  text,
  className = "",
  delay = 50,
  duration = 1,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",
  onLetterAnimationComplete,
}: SplitTextProps) => {
  const ref = useRef<SplitTextTarget>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
      return;
    }

    document.fonts.ready.then(() => {
      if (mounted) {
        setFontsLoaded(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ref.current || !text || !fontsLoaded) {
      return;
    }

    animateSplitTextElement(ref.current, {
      delay,
      duration,
      ease,
      splitType,
      from,
      to,
      threshold,
      rootMargin,
      onComplete: onLetterAnimationComplete,
    });

    return () => {
      if (ref.current) {
        cleanupSplitText(ref.current);
      }
    };
  }, [text, delay, duration, ease, splitType, from, to, threshold, rootMargin, fontsLoaded, onLetterAnimationComplete]);

  return createElement(tag, {
    ref: ref as Ref<HTMLElement>,
    style: {
      textAlign,
      wordWrap: "break-word",
    },
    className: `split-parent whitespace-normal ${className}`,
    children: text,
  });
};

export default SplitText;
