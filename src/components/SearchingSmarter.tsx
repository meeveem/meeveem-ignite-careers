import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { DoorOpen, Eye, Radar, Scale, SearchX, Target, type LucideIcon } from "lucide-react";

import dashboardStep1 from "@/assets/dashboard-step1.png";
import dashboardStep2 from "@/assets/dashboard-step2.png";
import dashboardStep3 from "@/assets/dashboard-step3.png";
import dashboardStep4 from "@/assets/dashboard-step4.png";
import dashboardStep5 from "@/assets/dashboard-step5.png";
import dashboardStep6 from "@/assets/dashboard-step6.png";

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
    image: dashboardStep5,
  },
  {
    icon: Target,
    title: "Stay in control.",
    body: "Keep your inbox relevant with alerts that only surface the right roles.",
    image: dashboardStep6,
  },
];

const SearchingSmarter = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const columnRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const stickyWrapperRef = useRef<HTMLDivElement>(null);
  const firstWrapperRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const lastCardRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const imageEl = imageContainerRef.current;
      if (!imageEl) return;
      const imageRect = imageEl.getBoundingClientRect();
      const midY = imageRect.top + imageRect.height / 2;

      let closestIdx = 0;
      let closestDist = Number.POSITIVE_INFINITY;

      itemRefs.current.forEach((node, idx) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const cardMid = rect.top + rect.height / 2;
        const dist = Math.abs(cardMid - midY);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      });

      if (closestDist === Number.POSITIVE_INFINITY) return;
      setActiveIndex((prev) => (prev === closestIdx ? prev : closestIdx));
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

    const updateLayout = () => {
      const imageEl = imageContainerRef.current;
      const columnEl = columnRef.current;
      const firstWrapperEl = firstWrapperRef.current;
      const firstCardEl = firstCardRef.current;
      const lastCardEl = lastCardRef.current;
      const stickyEl = stickyWrapperRef.current;

      if (firstWrapperEl && !firstWrapperEl.style.paddingTop) {
        firstWrapperEl.style.paddingTop = "3rem";
      }

      if (imageEl && firstCardEl && firstWrapperEl) {
        const offset = Math.max(0, (imageEl.offsetHeight - firstCardEl.offsetHeight) / 2);
        firstWrapperEl.style.paddingTop = `${offset}px`;
      }

      if (columnEl) {
        columnEl.style.paddingBottom = "";
      }

      if (imageEl && lastCardEl && columnEl) {
        const rawOffset = Math.max(0, (imageEl.offsetHeight - lastCardEl.offsetHeight) / 2);
        const offset = Math.min(rawOffset, 12);
        columnEl.style.paddingBottom = `${offset}px`;
      }

      if (imageEl && stickyEl) {
        const viewportHeight = window.innerHeight || 0;
        const topValue = Math.max(0, viewportHeight / 2 - imageEl.offsetHeight / 2);
        stickyEl.style.top = `${topValue}px`;
      }
    };

    let frame = 0;

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateLayout();
      });
    };

    updateLayout();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(schedule);
      if (imageContainerRef.current) resizeObserver.observe(imageContainerRef.current);
      if (firstCardRef.current) resizeObserver.observe(firstCardRef.current);
      if (lastCardRef.current) resizeObserver.observe(lastCardRef.current);
      if (columnRef.current) resizeObserver.observe(columnRef.current);
    }

    window.addEventListener("resize", schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section id="searching-smarter" className="w-full bg-white">
      <div className="container mx-auto px-4 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Searching Smarter Starts Here</h2>
          <p className="text-xl text-muted-foreground">
            Endless scrolling, vague job descriptions, and slow responses stop here. Meeveem AI removes the guesswork so
            you can focus on the roles that fit your potential.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div
            ref={columnRef}
            className="order-2 flex flex-col space-y-16 md:space-y-20 lg:order-1"
          >
            {BENEFITS.map((benefit, index) => (
              <div
                key={benefit.title}
                ref={(node) => {
                  itemRefs.current[index] = node;
                  if (index === 0) {
                    firstWrapperRef.current = node;
                  }
                }}
                className={clsx(
                  "scroll-mt-32 flex items-center transition-transform duration-300",
                  index === 0 ? "pt-12 md:pt-16 lg:pt-20" : undefined,
                  index === BENEFITS.length - 1 ? "min-h-[32vh] md:min-h-[36vh] lg:min-h-[40vh]" : "min-h-[55vh] md:min-h-[60vh] lg:min-h-[64vh]",
                  activeIndex === index ? "scale-[1.01]" : "scale-100"
                )}
              >
                <div
                  ref={
                    index === 0 ? firstCardRef : index === BENEFITS.length - 1 ? lastCardRef : undefined
                  }
                  className={clsx(
                    "w-full max-w-xl rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm transition-all duration-300",
                    activeIndex === index && "ring-1 ring-primary/30"
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
            <div ref={stickyWrapperRef} className="mx-auto w-full lg:sticky" style={{ top: "20vh" }}>
              <div
                ref={imageContainerRef}
                className="relative w-full max-w-[1100px] aspect-[16/9] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
              >
                {BENEFITS.map((benefit, index) => (
                  <div
                    key={benefit.title}
                    className={clsx(
                      "absolute inset-0 transition-all duration-400 ease-out",
                      activeIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
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
