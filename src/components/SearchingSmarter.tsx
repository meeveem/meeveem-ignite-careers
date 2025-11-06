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
      const imageEl = imageContainerRef.current;
      if (!imageEl) return;
      const imageRect = imageEl.getBoundingClientRect();
      const midY = imageRect.top + imageRect.height / 2;

      let closestIdx = 0;
      let closestDist = Number.POSITIVE_INFINITY;
      let closestHeight = 0;

      itemRefs.current.forEach((node, idx) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const cardMid = rect.top + rect.height / 2;
        const dist = Math.abs(cardMid - midY);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
          closestHeight = rect.height;
        }
      });

      if (closestDist === Number.POSITIVE_INFINITY) return;
      // Update the image only when the text card's center comes close
      // to the image center ("dead zone" prevents early switches).
      // Switch a bit earlier so the image changes before the next benefit fully appears
      const threshold = Math.min(closestHeight * 0.55, imageRect.height * 0.5, 220);
      setActiveIndex((prev) => (closestDist <= threshold ? closestIdx : prev));
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
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const calculatePadding = () => {
      const firstBenefit = itemRefs.current[0];
      const lastBenefit = itemRefs.current[BENEFITS.length - 1];
      if (!firstBenefit || !lastBenefit || window.innerWidth < 1024) {
        setPadTop(0);
        setPadBottom(0);
        return;
      }

      const viewportH = window.innerHeight;
      const targetCenter = viewportH / 2 + navOffset / 2; // sticky center in viewport
      const colTop = columnRef.current?.getBoundingClientRect().top ?? 0;

      const firstHeight = firstBenefit.offsetHeight;
      const newPadTop = Math.max(0, targetCenter - colTop - firstHeight / 2);

      const lastHeight = lastBenefit.offsetHeight;
      const newPadBottom = Math.max(0, targetCenter - colTop - lastHeight / 2);

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
            className="order-2 flex flex-col space-y-[60vh] lg:order-1"
            style={{
              paddingTop: padTop > 0 ? `${padTop}px` : undefined,
              paddingBottom: padBottom > 0 ? `${padBottom}px` : undefined,
            }}
          >
            {BENEFITS.map((benefit, index) => (
              <div
                key={benefit.title}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className={clsx(
                  "scroll-mt-32 flex items-center transition-transform duration-300"
                )}
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
            ))}
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
