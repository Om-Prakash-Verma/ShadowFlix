"use client";

import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";
import MagicBento, { MagicBentoItem } from "@/components/MagicBento";
import type { PlayerSource, PlayerSourceSection } from "@/types/player";

function getSourceMeta(source: PlayerSource) {
  return source.kind === "link" ? "External destination" : "Embedded playback";
}

export function PlayerModal({
  title,
  sections,
  triggerLabel = "Play",
  onOpen,
}: {
  title: string;
  sections: PlayerSourceSection[];
  triggerLabel?: string;
  onOpen?: () => void;
}) {
  const flatSources = useMemo(() => sections.flatMap((section) => section.sources), [sections]);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [sandboxed, setSandboxed] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeSourceId, setActiveSourceId] = useState<string | null>(flatSources[0]?.id ?? null);

  const activeSource = useMemo(
    () => flatSources.find((source) => source.id === activeSourceId) ?? flatSources[0] ?? null,
    [activeSourceId, flatSources],
  );

  const activeSection = useMemo(
    () => sections.find((section) => section.sources.some((source) => source.id === activeSource?.id)) ?? sections[0] ?? null,
    [activeSource?.id, sections],
  );

  useEffect(() => {
    setMounted(true);
    if (open) {
      document.body.classList.add("playing-fullscreen");
    } else {
      document.body.classList.remove("playing-fullscreen");
    }
    return () => {
      document.body.classList.remove("playing-fullscreen");
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onOpen?.();
          setOpen(true);
        }}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#8400ff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a855f7] sm:px-6"
      >
        {triggerLabel}
      </button>

      {open && mounted ? createPortal(
        <div className="fixed inset-0 z-[9999] overflow-hidden bg-black/94 backdrop-blur-md">
          <div className="flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-[radial-gradient(circle_at_top,rgba(132,0,255,0.12),transparent_30%),linear-gradient(180deg,#05020a,#010002)]">
            <div className="shrink-0 flex flex-col gap-4 border-b border-white/10 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.34em] text-white/45">Fullscreen Player</p>
                  <h2 className="mt-2 max-w-4xl text-xl font-bold text-white sm:text-2xl">{title}</h2>
                  {activeSource ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/58">
                      <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1">{activeSection?.title ?? "Source"}</span>
                      <span className="rounded-full border border-[#8400ff]/40 bg-[#8400ff]/14 px-3 py-1 text-white">{activeSource.name}</span>
                      <span>{getSourceMeta(activeSource)}</span>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSandboxed((value) => !value);
                      setReloadKey((value) => value + 1);
                    }}
                    className={cn(
                      "inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition",
                      sandboxed ? "border-[#8400ff] bg-[#8400ff]/18 text-white" : "border-white/15 bg-white/6 text-white/72",
                    )}
                  >
                    Sandbox {sandboxed ? "On" : "Off"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReloadKey((value) => value + 1)}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm font-medium text-white/78 transition hover:bg-white/10"
                  >
                    Reload
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm font-medium text-white/78 transition hover:bg-white/10"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
              <MagicBento
                className="flex-1 min-h-0 w-full gap-5 grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_360px] lg:grid-rows-1"
                enableStars
                enableSpotlight
                enableBorderGlow
                enableTilt={false}
                enableMagnetism={false}
                clickEffect={false}
               glowColor="132, 0, 255" spotlightRadius={800} particleCount={12}>
                <MagicBentoItem className="h-full min-h-0" cardClassName="p-0">
                  <div className="order-1 flex h-full min-h-0 w-full flex-col lg:order-none">
                    <div className="relative aspect-video w-full max-h-[48dvh] flex-none overflow-hidden sm:max-h-[52dvh] md:max-h-[56dvh] lg:h-full lg:max-h-none lg:min-h-0 lg:flex-1 lg:aspect-auto">
                      {activeSource ? (
                        activeSource.kind === "link" ? (
                          <div className="flex h-full flex-col items-center justify-center gap-5 px-6 py-10 text-center">
                            <div className="space-y-3">
                              <p className="text-xs uppercase tracking-[0.32em] text-white/42">External Source</p>
                              <h3 className="text-2xl font-bold text-white sm:text-3xl">{activeSource.name}</h3>
                              <p className="mx-auto max-w-xl text-sm leading-7 text-white/62 sm:text-base">
                                This source opens outside the player surface. It is useful for official destinations and provider hand-offs.
                              </p>
                            </div>
                            <a
                              href={activeSource.src}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#8400ff] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a855f7]"
                            >
                              Open Source
                            </a>
                          </div>
                        ) : (
                          <iframe
                            key={`${activeSource.id}-${reloadKey}-${sandboxed ? "safe" : "open"}`}
                            src={activeSource.src}
                            title={`${title} player`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            sandbox={sandboxed ? "allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation" : undefined}
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="block h-full w-full"
                          />
                        )
                      ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center text-white/62">
                          Choose a source below to start playback.
                        </div>
                      )}
                    </div>
                  </div>
                </MagicBentoItem>

                <MagicBentoItem className="h-full min-h-0" cardClassName="p-0">
                  <aside className="order-2 flex h-full min-h-0 flex-1 flex-col overflow-hidden">
                <div className="border-b border-white/8 px-4 py-4 sm:px-5">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-white/42">Sources</p>
                  <p className="mt-2 text-sm leading-6 text-white/58">
                    Switch between Third-Party Servers, trailers. Turn off sandbox if asked.
                  </p>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                  <div className="space-y-5">
                    {sections.length ? (
                      sections.map((section) => (
                        <div key={section.id} className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.28em] text-white/45">{section.title}</p>
                              {section.description ? <p className="mt-1 text-xs leading-5 text-white/40">{section.description}</p> : null}
                            </div>
                            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/58">
                              {section.sources.length}
                            </span>
                          </div>
                          <div className="space-y-2.5">
                            {section.sources.map((source) => {
                              const active = activeSource?.id === source.id;

                              return (
                                <button
                                  key={source.id}
                                  type="button"
                                  onClick={() => {
                                    setActiveSourceId(source.id);
                                    setReloadKey((value) => value + 1);
                                  }}
                                  className={cn(
                                    "w-full rounded-2xl border px-4 py-3 text-left transition",
                                    active
                                      ? "border-[#8400ff] bg-[linear-gradient(180deg,rgba(132,0,255,0.18),rgba(132,0,255,0.08))] text-white shadow-[0_0_0_1px_rgba(132,0,255,0.1)]"
                                      : "border-white/10 bg-white/[0.03] text-white/74 hover:bg-white/[0.06]",
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="truncate font-semibold text-white">{source.name}</p>
                                      <p className="mt-1 text-xs text-white/52">{getSourceMeta(source)}</p>
                                    </div>
                                    {active ? <span className="rounded-full bg-[#8400ff] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">Live</span> : null}
                                  </div>
                                  {source.label ? <p className="mt-3 text-xs leading-5 text-white/45">{source.label}</p> : null}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/62">
                        No trailer or provider sources were found for this title.
                      </div>
                    )}
                  </div>
                </div>
              </aside>
                </MagicBentoItem>
              </MagicBento>
            </div>
          </div>
        </div>,
        document.body
      ) : null}

    </>
  );
}
