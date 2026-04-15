import { AppLink } from "@/components/app-link";

type SupportLink = {
  label: string;
  href: string;
  eyebrow: string;
};

export function SupportPanel({
  eyebrow,
  title,
  description,
  links,
  tags,
}: {
  eyebrow: string;
  title: string;
  description: string;
  links: SupportLink[];
  tags?: string[];
}) {
  const footerTags = tags?.length ? tags : [""];
  const visibleLinks = links.slice(0, 4);
  const isTwoLinkLayout = visibleLinks.length <= 2;
  const linkGridClassName =
    visibleLinks.length <= 1
      ? "grid-cols-1"
      : visibleLinks.length === 2
        ? "grid-cols-2"
        : "grid-cols-2 sm:grid-cols-2";
  const linkCardMinHeightClassName =
    visibleLinks.length <= 2 ? "min-h-[136px]" : "min-h-[88px]";

  return (
    <section className="grid h-full grid-rows-[auto_auto_minmax(0,1fr)_auto] rounded-[28px]">
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/44 sm:text-xs sm:tracking-[0.34em]">{eyebrow}</p>
      <h2
        className="mt-2 min-h-[3rem] overflow-hidden text-[1.18rem] font-black leading-[1.02] text-white sm:min-h-[3.2rem] sm:text-[1.34rem]"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
        }}
      >
        {title}
      </h2>
      <div className="mt-2.5 grid min-h-0 grid-rows-[auto_minmax(0,1fr)]">
        <p
          className="min-h-[4.8rem] max-w-xl overflow-hidden text-[0.85rem] leading-6 text-white/66"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
          }}
        >
          {description}
        </p>
        <div className={`mt-3 grid min-h-0 gap-2 ${linkGridClassName} ${isTwoLinkLayout ? "content-end" : ""}`}>
          {visibleLinks.map((link) => (
            <AppLink
              key={link.href}
              href={link.href}
              className={`flex h-full flex-col justify-between rounded-[16px] border border-white/10 bg-white/[0.03] ${isTwoLinkLayout ? "px-4 py-4" : "px-3.5 py-3"} transition hover:border-[#8400ff]/45 hover:bg-[#8400ff]/10 ${linkCardMinHeightClassName}`}
            >
              <p className={`${isTwoLinkLayout ? "text-[10px]" : "text-[9px]"} uppercase tracking-[0.2em] text-white/40`}>{link.eyebrow}</p>
              <p
                className={`overflow-hidden font-semibold leading-[1.15] text-white ${isTwoLinkLayout ? "text-[1rem]" : "text-[0.92rem]"}`}
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                }}
              >
                {link.label}
              </p>
            </AppLink>
          ))}
        </div>
      </div>
      <div className="mt-3 flex min-h-[28px] flex-wrap content-end gap-1.5 self-end">
        {footerTags.map((tag, index) =>
          tag ? (
            <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-white/62">
              {tag}
            </span>
          ) : (
            <span key={`tag-spacer-${index}`} aria-hidden="true" className="invisible rounded-full border border-transparent px-2.5 py-1 text-[10px]">
              spacer
            </span>
          ),
        )}
      </div>
    </section>
  );
}
