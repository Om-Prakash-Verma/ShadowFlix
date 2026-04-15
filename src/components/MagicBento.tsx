"use client";

import { Children, isValidElement, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";

import { cn } from "@/lib/utils";

export interface MagicBentoItemProps {
  children: ReactNode;
  className?: string;
  cardClassName?: string;
  contentClassName?: string;
}

export interface MagicBentoProps {
  children: ReactNode;
  className?: string;
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 800;
const DEFAULT_GLOW_COLOR = "132, 0, 255";
const MOBILE_BREAKPOINT = 1024;

const createParticleElement = (x: number, y: number, color = DEFAULT_GLOW_COLOR) => {
  const element = document.createElement("div");
  element.className = "magic-bento-particle";
  element.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: rgba(${color}, 1);
    box-shadow: 0 0 8px rgba(${color}, 0.6);
    pointer-events: none;
    left: ${x}px;
    top: ${y}px;
    z-index: 1;
  `;

  return element;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.8,
});

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number, cachedRect?: DOMRect) => {
  const rect = cachedRect || card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

export function MagicBentoItem({ children }: MagicBentoItemProps) {
  return <>{children}</>;
}

MagicBentoItem.displayName = "MagicBentoItem";

function ParticleCard({
  children,
  className,
  disableAnimations,
  particleCount,
  glowColor,
  enableTilt,
  clickEffect,
  enableMagnetism,
}: {
  children: ReactNode;
  className?: string;
  disableAnimations: boolean;
  particleCount: number;
  glowColor: string;
  enableTilt: boolean;
  clickEffect: boolean;
  enableMagnetism: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const initializedParticlesRef = useRef<HTMLDivElement[]>([]);
  const hoveredRef = useRef(false);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutsRef.current = [];

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.24,
        ease: "power2.in",
        onComplete: () => particle.remove(),
      });
    });

    particlesRef.current = [];
  }, []);

  const ensureParticles = useCallback(() => {
    if (!cardRef.current || initializedParticlesRef.current.length) {
      return;
    }

    const { width, height } = cardRef.current.getBoundingClientRect();
    initializedParticlesRef.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor),
    );
  }, [particleCount, glowColor]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || disableAnimations) {
      return;
    }

    const handleMouseEnter = () => {
      hoveredRef.current = true;
      ensureParticles();

      initializedParticlesRef.current.forEach((particle, index) => {
        const timeoutId = setTimeout(() => {
          if (!hoveredRef.current || !cardRef.current) {
            return;
          }

          const clone = particle.cloneNode(true) as HTMLDivElement;
          cardRef.current.appendChild(clone);
          particlesRef.current.push(clone);

          gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28, ease: "back.out(1.4)" });
          gsap.to(clone, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            duration: 1.8 + Math.random() * 1.2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
          gsap.to(clone, {
            opacity: 0.24,
            duration: 1.4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        }, index * 70);

        timeoutsRef.current.push(timeoutId);
      });
    };

    const handleMouseLeave = () => {
      hoveredRef.current = false;
      clearAllParticles();

      gsap.to(card, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.28,
        ease: "power2.out",
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        gsap.to(card, {
          rotateX: ((y - centerY) / centerY) * -6,
          rotateY: ((x - centerX) / centerX) * 6,
          duration: 0.12,
          ease: "power2.out",
          transformPerspective: 1200,
        });
      }

      if (enableMagnetism) {
        gsap.to(card, {
          x: (x - centerX) * 0.025,
          y: (y - centerY) * 0.025,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (!clickEffect) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );

      const ripple = document.createElement("div");
      ripple.className = "magic-bento-ripple";
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        border-radius: 999px;
        pointer-events: none;
        z-index: 1;
        background: radial-gradient(circle, rgba(${glowColor}, 0.35) 0%, rgba(${glowColor}, 0.18) 35%, transparent 70%);
      `;

      card.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        },
      );
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("click", handleClick);

    return () => {
      hoveredRef.current = false;
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("click", handleClick);
      clearAllParticles();
    };
  }, [clearAllParticles, clickEffect, disableAnimations, enableMagnetism, enableTilt, ensureParticles, glowColor]);

  return (
    <div ref={cardRef} className={cn("magic-bento-card relative overflow-hidden", className)}>
      {children}
    </div>
  );
}

function GlobalSpotlight({
  gridRef,
  disableAnimations,
  enabled,
  spotlightRadius,
  glowColor,
}: {
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations: boolean;
  enabled: boolean;
  spotlightRadius: number;
  glowColor: string;
}) {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const cardDataRef = useRef<Array<{ element: HTMLElement; rect: DOMRect }>>([]);

  useEffect(() => {
    if (disableAnimations || !enabled || !gridRef.current) {
      return;
    }

    const grid = gridRef.current;
    if (window.matchMedia("(hover: none)").matches) {
      return;
    }

    const spotlight = document.createElement("div");
    spotlight.className = "magic-bento-spotlight";
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 999px;
      pointer-events: none;
      opacity: 0;
      z-index: 10;
      mix-blend-mode: screen;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, rgba(${glowColor}, 0.16) 0%, rgba(${glowColor}, 0.08) 20%, rgba(${glowColor}, 0.03) 42%, transparent 72%);
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const updateCardData = () => {
      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll<HTMLElement>(".magic-bento-card");
      cardDataRef.current = Array.from(cards).map((card) => ({
        element: card,
        rect: card.getBoundingClientRect(),
      }));
    };

    updateCardData();

    const resizeObserver = new ResizeObserver(() => {
      updateCardData();
    });
    resizeObserver.observe(grid);

    const handleMouseMove = (event: MouseEvent) => {
      if (!gridRef.current || !spotlightRef.current) {
        return;
      }

      const rect = gridRef.current.getBoundingClientRect();
      const insideGrid =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!insideGrid) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
        cardDataRef.current.forEach(({ element }) => element.style.setProperty("--glow-intensity", "0"));
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cardDataRef.current.forEach(({ element, rect: cardRect }) => {
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(event.clientX - centerX, event.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(distance, 0);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(element, event.clientX, event.clientY, glowIntensity, spotlightRadius, cardRect);
      });

      const opacity =
        minDistance <= proximity
          ? 0.78
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.78
            : 0;

      gsap.to(spotlightRef.current, {
        left: event.clientX,
        top: event.clientY,
        opacity,
        duration: 0.16,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      if (!spotlightRef.current || !gridRef.current) {
        return;
      }

      cardDataRef.current.forEach(({ element }) => {
        element.style.setProperty("--glow-intensity", "0");
      });
      gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      resizeObserver.disconnect();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      spotlightRef.current?.remove();
    };
  }, [disableAnimations, enabled, glowColor, gridRef, spotlightRadius]);

  return null;
}

function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobileState = () => {
      const isTouch = window.matchMedia("(hover: none)").matches;
      const isSmallScreen = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(isTouch || isSmallScreen);
    };
    
    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, []);

  return isMobile;
}

const STYLE_BLOCK = `
  .magic-bento-grid {
    --glow-x: 50%;
    --glow-y: 50%;
    --glow-intensity: 0;
    --glow-radius: 380px;
  }

  .magic-bento-card::before,
  .magic-bento-card::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
  }

  .magic-bento-card::before {
    background: linear-gradient(180deg, rgba(14,6,28,0.96), rgba(5,2,10,0.98));
    z-index: 0;
  }

  @media (hover: hover) {
    .magic-bento-card::before {
      background:
        radial-gradient(circle at top left, rgba(255,255,255,0.06), transparent 34%),
        linear-gradient(180deg, rgba(14,6,28,0.96), rgba(5,2,10,0.98));
    }

    .magic-bento-card::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      padding: 1px;
      background: radial-gradient(
        var(--glow-radius) circle at var(--glow-x) var(--glow-y),
        rgba(var(--magic-bento-glow), calc(var(--glow-intensity) * 0.8)) 0%,
        rgba(var(--magic-bento-glow), calc(var(--glow-intensity) * 0.35)) 30%,
        rgba(255,255,255,0.08) 58%,
        transparent 72%
      );
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: exclude;
      z-index: 0;
    }
  }

  .magic-bento-card-content {
    position: relative;
    z-index: 2;
    height: 100%;
  }

  .magic-bento-card-content :is(a, button, input, textarea, select, iframe) {
    pointer-events: auto;
    position: relative;
    z-index: 3;
  }

  /* Text Auto-Hide Desktop Logic (Always Visible but with Hover Effect) */
  @media (hover: hover) {
    .magic-bento-grid[data-text-auto-hide="true"] .magic-bento-card-content h2,
    .magic-bento-grid[data-text-auto-hide="true"] .magic-bento-card-content p:not(:first-child) {
      opacity: 1;
      transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .magic-bento-grid[data-text-auto-hide="true"] .magic-bento-card:hover .magic-bento-card-content h2,
    .magic-bento-grid[data-text-auto-hide="true"] .magic-bento-card:hover .magic-bento-card-content p:not(:first-child) {
      transform: translateY(-2px);
    }
  }
`;

export default function MagicBento({
  children,
  className,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
  textAutoHide = false,
}: MagicBentoProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  const items = Children.toArray(children).filter(isValidElement<MagicBentoItemProps>);

  return (
    <>
      <style>{STYLE_BLOCK}</style>

      {enableSpotlight ? (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      ) : null}

      <div 
        ref={gridRef} 
        data-text-auto-hide={textAutoHide}
        className={cn("magic-bento-grid grid grid-cols-1 gap-4 lg:grid-cols-12", className)}
        style={{ ["--magic-bento-glow" as string]: glowColor }}
      >
        {items.map((item, index) => {
          const { className: itemClassName, cardClassName, contentClassName, children: itemChildren } = item.props;

          return (
            <div key={index} className={cn("min-w-0", itemClassName)}>
              <ParticleCard
                className={cn(
                  "h-full rounded-[32px] sm:rounded-[40px] border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.34)]",
                  !enableBorderGlow && "border-white/8",
                  cardClassName,
                )}
                disableAnimations={!enableStars || shouldDisableAnimations}
                particleCount={particleCount}
                glowColor={glowColor}
                enableTilt={enableTilt && !shouldDisableAnimations}
                clickEffect={clickEffect && !shouldDisableAnimations}
                enableMagnetism={enableMagnetism && !shouldDisableAnimations}
              >
                <div data-no-split className={cn("magic-bento-card-content p-4 sm:p-5 lg:p-6", contentClassName)}>{itemChildren}</div>
              </ParticleCard>
            </div>
          );
        })}
      </div>
    </>
  );
}
