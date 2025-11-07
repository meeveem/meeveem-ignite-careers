import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { DoorOpen, Eye, Radar, Scale, SearchX, type LucideIcon } from "lucide-react";

import StopScrollingEndlessly from "@/assets/Stop Scrolling endlessly.png";
import UncoverCareersYouAlreadyQualifyFor from "@/assets/Uncover careers you already qualify for.png";
import ShowTheFullPicture from "@/assets/Show the full picture.png";
import LeaveBiasBehind from "@/assets/Leave Bias Behind.png";
import PeekInside from "@/assets/Peek Inside.png";

const iconBackground = "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary";

const BENEFITS: { icon: LucideIcon; title: string; body: string; image: string }[] = [
  {
    icon: SearchX,
    title: "Stop scrolling endlessly.",
    body: "We highlight roles that match your skills so your search stays focused and fast.",
    image: StopScrollingEndlessly,
  },
  {
    icon: Radar,
    title: "Unlock new careers.",
    body: "Your experience is the key to careers you didn't know existed.",
    image: UncoverCareersYouAlreadyQualifyFor,
  },
  {
    icon: Eye,
    title: "Reveal your true value.",
    body: "Let employers see beyond job titles and understand the value you bring.",
    image: ShowTheFullPicture,
  },
  {
    icon: Scale,
    title: "Leave bias behind.",
    body: "Experience matches based on ability, not buzzwords or outdated filters.",
    image: LeaveBiasBehind,
  },
  {
    icon: DoorOpen,
    title: "Peek inside the company.",
    body: "Preview team culture, projects, and goals before you ever hit apply.",
    image: PeekInside,
  },
];

const SearchingSmarter = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [padTop, setPadTop] = useState(0);
  const [padBottom, setPadBottom] = useState(0);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const columnRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [navOffset, setNavOffset] = useState(0);
  const [stickyHeight, setStickyHeight] = useState<number | undefined>(undefined);
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const [lastStickyTop, setLastStickyTop] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReducedMotion = mediaQuery.matches;
    if (prefersReducedMotion) return;

    const sectionEl = document.getElementById("searching-smarter");
    if (!sectionEl || typeof sectionEl.scrollIntoView !== "function") return;

    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href="#searching-smarter"]'));

    if (!anchors.length) return;

    const handleClick = (event: Event) => {
      event.preventDefault();
      sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
      if (typeof history !== "undefined" && typeof history.pushState === "function") {
        history.pushState(null, "", "#searching-smarter");
      } else {
        window.location.hash = "searching-smarter";
      }
    };

    anchors.forEach((anchor) => anchor.addEventListener("click", handleClick));

    return () => {
      anchors.forEach((anchor) => anchor.removeEventListener("click", handleClick));
    };
  }, []);

  // Measure fixed navbar height to truly center the sticky image in the visible area
  useEffect(() => {
    if (typeof window === "undefined") return;

    const measureNav = () => {
      const nav = document.querySelector("nav");
      const h = nav ? (nav as HTMLElement).getBoundingClientRect().height : 0;
      setNavOffset(Math.max(0, Math.round(h)));
    };

    measureNav();
    window.addEventListener("resize", measureNav);
    window.addEventListener("orientationchange", measureNav);
    const ro = new ResizeObserver(measureNav);
    const navEl = document.querySelector("nav");
    if (navEl) ro.observe(navEl);
    return () => {
      window.removeEventListener("resize", measureNav);
      window.removeEventListener("orientationchange", measureNav);
      ro.disconnect();
    };
  }, []);

  // Compute a capped sticky height to avoid large bottom gaps on very tall screens
  useEffect(() => {
    if (typeof window === "undefined") return;
    const calc = () => {
      const avail = Math.max(0, window.innerHeight - navOffset);
      // Cap the sticky area to avoid huge whitespace on very tall screens
      const capped = Math.min(avail, 900); // 900px cap; adjust if needed
      setStickyHeight(capped);
    };
    calc();
    window.addEventListener("resize", calc);
    window.addEventListener("orientationchange", calc);
    return () => {
      window.removeEventListener("resize", calc);
      window.removeEventListener("orientationchange", calc);
    };
  }, [navOffset]);

  // Preload all images to avoid blank frames during cross-fades
  useEffect(() => {
    BENEFITS.forEach((b) => {
      const img = new Image();
      img.src = b.image;
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame = 0;

    // Only run the scroll-driven highlight on desktop (lg and up)
    if (window.innerWidth < 1024) return;

    const measure = () => {
      frame = 0;
      const viewportTop = navOffset; // exclude navbar area
      const viewportBottom = window.innerHeight; // full viewport bottom

      let bestIdx = activeIndex;
      let bestRatio = -1;

      for (let i = 0; i < BENEFITS.length; i++) {
        const node = itemRefs.current[i];
        if (!node) continue;
        const rect = node.getBoundingClientRect();
        const overlap = Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, viewportTop);
        const visible = Math.max(0, overlap);
        const ratio = rect.height > 0 ? visible / rect.height : 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestIdx = i;
        }
      }

      // Fallback when nothing intersects (very fast scroll): choose item closest to center
      if (bestRatio <= 0) {
        const center = viewportTop + (window.innerHeight - viewportTop) / 2;
        let closest = Number.POSITIVE_INFINITY;
        for (let i = 0; i < BENEFITS.length; i++) {
          const node = itemRefs.current[i];
          if (!node) continue;
          const r = node.getBoundingClientRect();
          const mid = r.top + r.height / 2;
          const dist = Math.abs(mid - center);
          if (dist < closest) {
            closest = dist;
            bestIdx = i;
          }
        }
      }

      if (bestIdx !== activeIndex) setActiveIndex(bestIdx);
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    measure();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [navOffset, activeIndex]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const calculatePadding = () => {
      const first = itemRefs.current[0];
      const col = columnRef.current;
      if (!first || !col || window.innerWidth < 1024) {
        setPadTop(0);
        return;
      }

      // Sticky image center in viewport coordinates (accounts for navbar)
      const stickyMidVp = navOffset + (window.innerHeight - navOffset) / 2;
      // First center relative to column top (no padding dependency)
      const firstCenterNoPad = first.offsetTop + first.offsetHeight / 2;
      const newPadTop = Math.max(0, Math.round(stickyMidVp - firstCenterNoPad));
      setPadTop(newPadTop);
      // We do not add extra bottom padding; last item handles centering via sticky top
      setPadBottom(0);
    };

    calculatePadding();
    const ro = new ResizeObserver(calculatePadding);
    if (columnRef.current) ro.observe(columnRef.current);
    window.addEventListener("resize", calculatePadding);
    window.addEventListener("orientationchange", calculatePadding);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", calculatePadding);
      window.removeEventListener("orientationchange", calculatePadding);
    };
  }, [navOffset]);

  // Compute sticky top for the last benefit so its center aligns with the image center
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => {
      const el = lastItemRef.current;
      if (!el) return;
      const h = el.offsetHeight || 0;
      const stickyTop = navOffset + (window.innerHeight - navOffset) / 2 - h / 2;
      setLastStickyTop(Math.max(navOffset, Math.round(stickyTop)));
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    const ro = new ResizeObserver(update);
    if (lastItemRef.current) ro.observe(lastItemRef.current);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      ro.disconnect();
    };
  }, [navOffset]);

  return (
    <section id="searching-smarter" className="w-full bg-white">
      <div className="container mx-auto px-4 pt-8 md:pt-10 lg:pt-12 pb-2 md:pb-4 lg:pb-6">
        <div className="mx-auto mb-8 md:mb-10 max-w-3xl text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Searching Smarter Starts Here</h2>
          <p className="text-xl text-muted-foreground">
            Endless scrolling, vague job descriptions, and slow responses stop here. Meeveem AI removes the guesswork so
            you can focus on the roles that fit your potential.
          </p>
        </div>

        {/* Mobile & tablet: image followed by its benefit text */}
        <div className="lg:hidden flex flex-col gap-14">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="flex flex-col gap-4">
              <div className="relative w-full aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <img
                  src={benefit.image}
                  alt={`${benefit.title} illustration`}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-4 text-left">
                <span className={iconBackground}>
                  <benefit.icon className="h-6 w-6" aria-hidden />
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-900">{benefit.title}</h3>
                  <p className="text-base md:text-lg leading-relaxed text-slate-600">{benefit.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: sticky image on the right, text list on the left (50/50 columns) */}
        <div className="hidden lg:grid grid-cols-2 gap-12">
          <div
            ref={columnRef}
            className="order-2 flex flex-col space-y-8 lg:order-1"
            style={{
              paddingTop: padTop > 0 ? `${padTop}px` : undefined,
              paddingBottom: padBottom > 0 ? `${padBottom}px` : undefined,
            }}
          >
            {BENEFITS.map((benefit, index) => {
              const isLast = index === BENEFITS.length - 1;
              return (
                <div
                  key={benefit.title}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                    if (isLast) lastItemRef.current = node;
                  }}
                  className={clsx(
                    "scroll-mt-32 flex items-center justify-center transition-transform duration-300",
                    isLast && "lg:sticky",
                  )}
                  style={{
                    minHeight: stickyHeight ? Math.max(0, stickyHeight - 72) : undefined,
                    top: isLast ? lastStickyTop : undefined,
                  }}
                >
                  <div className={clsx("w-full transition-all duration-300", activeIndex === index && "scale-105")}>
                    <div className="flex flex-col gap-4 text-left">
                      <span className={iconBackground}>
                        <benefit.icon className="h-6 w-6" aria-hidden />
                      </span>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-xl md:text-2xl font-semibold text-slate-900">{benefit.title}</h3>
                        <p className="text-base md:text-lg leading-relaxed text-slate-600">{benefit.body}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="order-1 lg:order-2 lg:col-span-1 lg:self-stretch">
            <div
              className="mx-auto w-full lg:sticky flex items-center justify-center"
              style={{ top: navOffset, height: stickyHeight ? `${stickyHeight}px` : undefined }}
            >
              <div
                ref={imageContainerRef}
                className="relative mx-auto w-full max-w-[80vh] aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
              >
                {BENEFITS.map((benefit, index) => (
                  <div
                    key={benefit.title}
                    className={clsx(
                      "absolute inset-0 transition-opacity duration-700 ease-out",
                      activeIndex === index ? "opacity-100" : "opacity-0 pointer-events-none",
                    )}
                    style={{ willChange: "opacity" }}
                  >
                    <img
                      src={benefit.image}
                      alt={`${benefit.title} illustration`}
                      className="h-full w-full object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchingSmarter;
