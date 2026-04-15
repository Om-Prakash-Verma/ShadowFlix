"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from "motion/react";
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  href: string;
  match: (pathname: string) => boolean;
  className?: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  className?: string;
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  isActive: boolean;
};

function DockItem({
  children,
  className = "",
  label,
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  isActive,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const [rect, setRect] = useState({ x: 0, width: baseItemSize });

  useEffect(() => {
    if (!ref.current) return;

    const updateRect = () => {
      if (ref.current) {
        const domRect = ref.current.getBoundingClientRect();
        setRect({ x: domRect.x, width: domRect.width });
      }
    };

    updateRect();
    const observer = new ResizeObserver(updateRect);
    observer.observe(ref.current);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, []);

  const mouseDistance = useTransform(mouseX, (val) => {
    return val - rect.x - rect.width / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full border-2 shadow-[0_12px_36px_rgba(0,0,0,0.48)] transition-[border-color,background-image,box-shadow,color,background-color] duration-200 ${
        isActive ? "border-[#8400ff] bg-[linear-gradient(180deg,#1d0c3a,#0a0314)] text-white shadow-[0_0_24px_rgba(132,0,255,0.45)]" : "border-white/10 bg-[#0a0314] text-white/68 hover:border-[#8400ff]/40 hover:text-white"
      } ${className}`}
      tabIndex={0}
      role="button"
      aria-label={label}
      aria-haspopup="true"
    >
      {Children.map(children, (child) =>
        React.isValidElement(child) ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered }) : child,
      )}
    </motion.div>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = "", isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-8 left-1/2 w-fit whitespace-pre rounded-lg border border-white/10 bg-[#0a0314] px-3 py-1.5 text-xs font-semibold tracking-wide text-white shadow-[0_10px_20px_rgba(0,0,0,0.6)]`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = "" }: DockIconProps) {
  return <div className={`flex w-1/2 h-1/2 items-center justify-center ${className} [&>svg]:w-full [&>svg]:h-full`}>{children}</div>;
}

function FloatingDock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 350, damping: 24 },
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  baseItemSize = 50,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const router = useRouter();
  const pathname = usePathname();

  const isTouchDevice = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: none)").matches;
  }, []);

  return (
    <motion.div
      onMouseMove={({ clientX }) => {
        if (isTouchDevice) return;
        mouseX.set(clientX);
      }}
      onMouseLeave={() => {
        mouseX.set(Infinity);
      }}
      className={`${className} flex items-end w-fit gap-2 sm:gap-3 rounded-[32px] border-white/10 bg-[linear-gradient(180deg,rgba(10,3,20,0.86),rgba(10,3,20,0.94))] shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:backdrop-blur-3xl border pb-2 px-3 sm:pb-3 sm:px-4`}
      style={{ height: panelHeight }}
      role="toolbar"
      aria-label="Application dock"
    >
      {items.map((item, index) => {
        const isActive = item.match(pathname);
        return (
          <DockItem
            key={index}
            label={typeof item.label === "string" ? item.label : "Menu Item"}
            onClick={() => router.push(item.href)}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            isActive={isActive}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        );
      })}
    </motion.div>
  );
}

export function DockNavigation() {
  const [isMounted, setIsMounted] = useState(false);
  const [dimensions, setDimensions] = useState({
    magnification: 76,
    distance: 140,
    panelHeight: 74,
    baseItemSize: 54,
  });

  useEffect(() => {
    setIsMounted(true);
    const updateDimensions = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({
          magnification: 50,
          distance: 80,
          panelHeight: 56,
          baseItemSize: 42,
        });
      } else if (width < 1024) {
        setDimensions({
          magnification: 64,
          distance: 100,
          panelHeight: 64,
          baseItemSize: 48,
        });
      } else {
        setDimensions({
          magnification: 76,
          distance: 140,
          panelHeight: 76,
          baseItemSize: 56,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const items: DockItemData[] = [
    {
      label: "Home",
      href: "/",
      match: (p) => p === "/",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: "Trending",
      href: "/genre/trending",
      match: (p) => p.startsWith("/genre/trending"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
    {
      label: "Movies",
      href: "/top-movies",
      match: (p) => p.startsWith("/top-movies") || p.startsWith("/movie/"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" />
          <line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="2" y1="7" x2="7" y2="7" />
          <line x1="2" y1="17" x2="7" y2="17" />
          <line x1="17" y1="17" x2="22" y2="17" />
          <line x1="17" y1="7" x2="22" y2="7" />
        </svg>
      ),
    },
    {
      label: "TV Shows",
      href: "/top-tv-shows",
      match: (p) => p.startsWith("/top-tv-shows") || p.startsWith("/tv/"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
          <polyline points="17 2 12 7 7 2" />
        </svg>
      ),
    },
    {
      label: "Watchlist",
      href: "/watchlist",
      match: (p) => p.startsWith("/watchlist"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
  ];

  if (!isMounted) return null;

  return (
    <div id="global-dock" className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100] w-fit transition-all duration-300">
      <FloatingDock items={items} {...dimensions} />
    </div>
  );
}
