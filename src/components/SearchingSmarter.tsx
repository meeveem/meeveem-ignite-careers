import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { DoorOpen, Eye, Radar, Scale, SearchX, type LucideIcon } from "lucide-react";

import dashboardStep1 from "@/assets/dashboard-step1.png";
import dashboardStep2 from "@/assets/dashboard-step2.png";
import dashboardStep3 from "@/assets/dashboard-step3.png";
import dashboardStep4 from "@/assets/dashboard-step4.png";
import dashboardStep5 from "@/assets/dashboard-step5.png";

const iconBackground =
  "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary";

const BENEFITS: { icon: LucideIcon; title: string; body: string; image: string }[] = [
  {
    icon: SearchX,
    title: "Stop scrolling endlessly.",
    body: "We highlight roles that match your skills so your search stays focused and fast.",
    image: dashboardStep1,
  },
  {
    icon: Radar,
    title: "Discover the hidden fits.",
    body: "Surface tailored opportunities that align with your strengths and ambitions.",
    image: dashboardStep2,
  },
  {
    icon: Eye,
    title: "Show the full picture.",
    body: "Let employers see beyond job titles and understand the value you bring.",
    image: dashboardStep3,
  },
  {
    icon: Scale,
    title: "Leave bias behind.",
    body: "Experience matches based on ability, not buzzwords or outdated filters.",
    image: dashboardStep4,
  },
  {
    icon: DoorOpen,
    title: "Peek inside the role.",
    body: "Preview team culture, projects, and goals before you ever hit apply.",
    image: "/custom-image.png",
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
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const [lastStickyTop, setLastStickyTop] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReducedMotion = mediaQuery.matches;
    if (prefersReducedMotion) return;

    const sectionEl = document.getElementById("searching-smarter");
    if (!sectionEl || typeof sectionEl.scrollIntoView !== "function") return;

    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href="#searching-smarter"]')
    );

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
      const nav = document.querySelector('nav');
      const h = nav ? (nav as HTMLElement).getBoundingClientRect().height : 0;
      setNavOffset(Math.max(0, Math.round(h)));
    };

    measureNav();
    window.addEventListener('resize', measureNav);
    window.addEventListener('orientationchange', measureNav);
    const ro = new ResizeObserver(measureNav);
    const navEl = document.querySelector('nav');
    if (navEl) ro.observe(navEl);
    return () => {
      window.removeEventListener('resize', measureNav);
      window.removeEventListener('orientationchange', measureNav);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame = 0;

    // Only run the scroll-driven highlight on desktop (lg and up)
    if (window.innerWidth < 1024) return;

    const measure = () => {
      frame = 0;
      const viewportTop = navOffset;
      const viewportBottom = window.innerHeight - 1;
      const appearThreshold = 0.15; // 15% visibility feels snappier but avoids flicker

      const ratioAtIndex = (idx: number) => {
        const node = itemRefs.current[idx];
        if (!node) return 0;
        const rect = node.getBoundingClientRect();
        const overlap = Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, viewportTop);
        const visible = Math.max(0, overlap);
        return rect.height > 0 ? visible / rect.height : 0;
      };

      const nextIdx = Math.min(activeIndex + 1, BENEFITS.length - 1);
      const prevIdx = Math.max(activeIndex - 1, 0);

      if (nextIdx !== activeIndex && ratioAtIndex(nextIdx) >= appearThreshold) {
        setActiveIndex(nextIdx);
        return;
      }
      if (prevIdx !== activeIndex && ratioAtIndex(prevIdx) >= appearThreshold) {
        setActiveIndex(prevIdx);
        return;
      }
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
      const last = itemRefs.current[BENEFITS.length - 1];
      const col = columnRef.current;
      if (!first || !last || !col || window.innerWidth < 1024) {
        setPadTop(0);
        setPadBottom(0);
        return;
      }

      // Sticky image center in viewport coordinates (accounts for navbar)
      const stickyMidVp = navOffset + (window.innerHeight - navOffset) / 2;

      // Measure base content height of the column with no top/bottom padding
      const prevTop = col.style.paddingTop;
      const prevBottom = col.style.paddingBottom;
      col.style.paddingTop = "0px";
      col.style.paddingBottom = "0px";
      const baseHeight = col.scrollHeight;
      col.style.paddingTop = prevTop;
      col.style.paddingBottom = prevBottom;

      // Centers of first/last relative to column top (without padding)
      const firstCenterNoPad = first.offsetTop + first.offsetHeight / 2;
      const lastCenterNoPad = last.offsetTop + last.offsetHeight / 2;

      // Exact paddings so first starts centered and last ends centered
      const newPadTop = Math.max(0, Math.round(stickyMidVp - firstCenterNoPad));
      const newPadBottom = Math.max(
        0,
        Math.round(window.innerHeight + lastCenterNoPad - stickyMidVp - baseHeight)
      );

      setPadTop(newPadTop);
      setPadBottom(newPadBottom);
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
                    isLast && "lg:sticky"
                  )}
                  style={{
                    minHeight: `calc(100vh - ${navOffset}px - 72px)`, // allow a small bottom peek of next card
                    top: isLast ? lastStickyTop : undefined,
                  }}
                >
                  <div
                    className={clsx(
                      "w-full transition-all duration-300",
                      activeIndex === index && "scale-105"
                    )}
                  >
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
              style={{ top: navOffset, height: `calc(100vh - ${navOffset}px)` }}
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
                      activeIndex === index ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                  >
                    <img
                      src={benefit.image}
                      alt={`${benefit.title} illustration`}
                      className="h-full w-full object-contain"
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
