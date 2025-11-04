import { useCallback, useEffect, useRef, useState } from "react";
import { DoorOpen, Eye, Radar, Scale, SearchX, Target } from "lucide-react";

import dashboardStep1 from "@/assets/dashboard-step1.png";
import dashboardStep2 from "@/assets/dashboard-step2.png";
import dashboardStep3 from "@/assets/dashboard-step3.png";
import dashboardStep4 from "@/assets/dashboard-step4.png";
import dashboardStep5 from "@/assets/dashboard-step5.png";
import dashboardStep6 from "@/assets/dashboard-step6.png";

const benefits = [
  {
    icon: SearchX,
    title: "Wasted hours on irrelevant jobs?",
    keyPhrase: "Stop scrolling endlessly.",
    description: "We match you with roles that actually fit, fast.",
    image: dashboardStep1,
  },
  {
    icon: Radar,
    title: "Missing the roles meant for you?",
    keyPhrase: "Don't miss out again.",
    description: "Discover real roles matched to your strengths.",
    image: dashboardStep2,
  },
  {
    icon: Eye,
    title: "Feeling invisible in the job market?",
    keyPhrase: "Be seen for your potential.",
    description: "We help employers look beyond your job titles.",
    image: dashboardStep3,
  },
  {
    icon: Scale,
    title: "Tired of unfair filters?",
    keyPhrase: "No buzzwords. No bias.",
    description: "Just fair matches based on what you can do.",
    image: dashboardStep4,
  },
  {
    icon: DoorOpen,
    title: "Wish you knew the work vibe?",
    keyPhrase: "See behind the job ad.",
    description: "Get the inside view before you hit apply.",
    image: dashboardStep5,
  },
  {
    icon: Target,
    title: "Bombarded with irrelevant jobs?",
    keyPhrase: "Take control.",
    description: "Get matched only to roles that truly fit you.",
    image: dashboardStep6,
  },
];

const BenefitsSection = () => {
  // Start hidden: image appears only when first text enters view
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const articleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stickyTopPx, setStickyTopPx] = useState<number>(0);
  const [computedTopPx, setComputedTopPx] = useState<number>(0);
  const rightImageRef = useRef<HTMLDivElement>(null);
  const rightWrapperRef = useRef<HTMLDivElement>(null);
  const lastArticleRef = useRef<HTMLDivElement>(null); // legacy sentinel (unused after refactor but kept harmless)
  const leftColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateViewportFlags = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    updateViewportFlags();
    setReducedMotion(motionQuery.matches);

    window.addEventListener("resize", updateViewportFlags);
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", updateViewportFlags);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // Compute sticky top so image card never overlaps headline and stays professionally aligned
  useEffect(() => {
    const computeStickyTop = () => {
      const header = document.querySelector('[data-benefits-heading="true"]') as HTMLElement | null;
      const navOffset = 96; // approx nav height (lg:top-24)
      const minTop = Math.round(window.innerHeight * 0.28); // keep image higher than mid but not at the very top
      let headerBottom = 0;
      if (header) {
        const r = header.getBoundingClientRect();
        headerBottom = Math.max(0, r.bottom);
      }
      const desired = Math.max(minTop, headerBottom + 16, navOffset);
      setStickyTopPx(desired);
    };

    computeStickyTop();
    window.addEventListener("resize", computeStickyTop);
    return () => window.removeEventListener("resize", computeStickyTop);
  }, []);

  // Ensure the sticky image stops at the same level as the last text column bottom
  useEffect(() => {
    if (isMobile || reducedMotion) return;
    let ticking = false;

    const updateTop = () => {
      ticking = false;
      const baseTop = stickyTopPx || 0;
      const imageEl = rightImageRef.current;
      const leftCol = leftColumnRef.current;
      if (!imageEl || !leftCol) {
        setComputedTopPx(baseTop);
        return;
      }
      const imgRect = imageEl.getBoundingClientRect();
      const leftRect = leftCol.getBoundingClientRect();
      const imgHeight = imgRect.height || 0;
      // Desired top so that image bottom aligns with left column bottom.
      // Allow negative top so the card can move higher if needed and never overflow below the text.
      const desiredTop = leftRect.bottom - imgHeight;
      const clampedTop = Math.min(baseTop, desiredTop);
      setComputedTopPx(clampedTop);
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateTop);
        ticking = true;
      }
    };

    // Watch image size too (when switching slides or on first load)
    const imgRO = new ResizeObserver(() => updateTop());
    if (rightImageRef.current) imgRO.observe(rightImageRef.current);

    updateTop();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      imgRO.disconnect();
    };
  }, [stickyTopPx, isMobile, reducedMotion]);

  // Make the right wrapper exactly as tall as the left column, so sticky boundary ends exactly with text
  useEffect(() => {
    if (!leftColumnRef.current || !rightWrapperRef.current) return;
    const syncHeights = () => {
      const h = leftColumnRef.current?.getBoundingClientRect().height || 0;
      // Use explicit height (not min-height) to match the text column precisely
      rightWrapperRef.current!.style.height = `${Math.max(1, Math.round(h))}px`;
    };
    const ro = new ResizeObserver(syncHeights);
    ro.observe(leftColumnRef.current);
    syncHeights();
    window.addEventListener("resize", syncHeights);
    // Re-sync after images/fonts settle
    const t = setTimeout(syncHeights, 300);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncHeights);
      clearTimeout(t);
    };
  }, []);

  // Drive active card by the element whose center is closest to viewport center.
  // Reveal earlier, but avoid overlapping the heading area.
  useEffect(() => {
    if (isMobile || reducedMotion) return;

    let ticking = false;

    const updateActive = () => {
      ticking = false;
      const centerY = window.innerHeight / 2;
      const earlyThreshold = window.innerHeight * 0.6;
      const refs = articleRefs.current;
      if (!refs.length) return;

      const first = refs[0];
      if (!first) return;
      const firstRect = first.getBoundingClientRect();
      // Reveal a bit earlier, but not before first block reaches ~80vh
      if (firstRect.top > earlyThreshold) {
        if (activeIndex !== -1) setActiveIndex(-1);
        return;
      }

      // Also ensure we don't display while the header still occupies mid-screen
      const header = document.querySelector('[data-benefits-heading="true"]') as HTMLElement | null;
      const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
      if (headerBottom > window.innerHeight * 0.45) {
        if (activeIndex !== -1) setActiveIndex(-1);
        return;
      }

      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      refs.forEach((el, idx) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return; // not on screen
        const mid = r.top + r.height / 2;
        const d = Math.abs(mid - centerY);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = idx;
        }
      });
      if (bestIdx !== activeIndex) setActiveIndex(bestIdx);
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActive);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // Initial compute
    updateActive();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [activeIndex, isMobile, reducedMotion]);

  const scrollToStep = useCallback(
    (index: number) => {
      const target = articleRefs.current[index];
      if (!target) return;

      target.scrollIntoView({
        block: "center",
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion]
  );

  if (isMobile || reducedMotion) {
    return (
      <section className="py-24 bg-white" ref={sectionRef}>
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#0F172A" }}>
              Searching Smarter Starts Here
            </h2>
            <p className="text-lg lg:text-xl" style={{ color: "#334155" }}>
              Endless scrolling, vague job descriptions and slow responses. Meeveem AI removes
              the guesswork and makes finding the right role fast, fair and personal.
            </p>
          </div>
          <div className="space-y-16">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="grid lg:grid-cols-12 gap-12 items-center"
                  role="region"
                  aria-label={`Benefit ${index + 1}: ${benefit.title}`}
                >
                  <div className="lg:col-span-5">
                    <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3
                      className="text-[28px] sm:text-[32px] lg:text-[40px] font-bold mb-4"
                      style={{ lineHeight: "1.1", color: "#0F172A" }}
                    >
                      {benefit.title}
                    </h3>
                    <p
                      className="font-semibold text-[17px] sm:text-[18px] mb-3 px-3 py-1 rounded-md inline-block"
                      style={{ color: "#2563EB", backgroundColor: "rgba(37, 99, 235, 0.08)" }}
                    >
                      {benefit.keyPhrase}
                    </p>
                    <p
                      className="text-[16px] sm:text-[18px]"
                      style={{ lineHeight: "1.75", color: "#334155" }}
                    >
                      {benefit.description}
                    </p>
                  </div>
                  <div className="lg:col-span-7">
                    <img
                      src={benefit.image}
                      alt={`Dashboard showing ${benefit.title}`}
                      className="w-full rounded-[24px]"
                      style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="pt-0 pb-24 bg-white relative isolate"
      aria-label="Interactive product showcase"
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 relative z-20" data-benefits-heading="true">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#0F172A" }}>
              Searching Smarter Starts Here
            </h2>
            <p className="text-lg lg:text-xl" style={{ color: "#334155" }}>
              Endless scrolling, vague job descriptions and slow responses. Meeveem AI removes the
              guesswork and makes finding the right role fast, fair and personal.
            </p>
          </div>

        <div className="relative lg:grid lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] gap-12 lg:gap-16 xl:gap-24">

          <div ref={leftColumnRef} className="flex flex-col gap-24 lg:gap-32">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const isActive = index === activeIndex;
              return (
                <article
                  key={benefit.title}
                  data-index={index}
                  ref={(el) => {
                    articleRefs.current[index] = el;
                  }}
                  className="scroll-mt-[calc(8rem+4rem)] min-h-[70vh] flex items-center"
                >
                  {index === benefits.length - 1 && (
                    <div ref={lastArticleRef} className="absolute bottom-0 left-0 h-px w-px opacity-0 pointer-events-none" />
                  )}
                  <div
                    className={`transition-all duration-500 ${
                      isActive ? "opacity-100 translate-y-0" : "opacity-20 translate-y-6 pointer-events-none"
                    }`}
                    style={reducedMotion ? { transition: "none" } : undefined}
                  >
                    <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3
                      className="text-[26px] sm:text-[30px] lg:text-[36px] font-bold mb-4"
                      style={{ lineHeight: "1.1", color: "#0F172A" }}
                    >
                      {benefit.title}
                    </h3>
                    <p
                      className="font-semibold text-[16px] sm:text-[17px] mb-3 px-3 py-1 rounded-md inline-block"
                      style={{ color: "#2563EB", backgroundColor: "rgba(37, 99, 235, 0.08)" }}
                    >
                      {benefit.keyPhrase}
                    </p>
                    <p
                      className="text-[15px] sm:text-[16px]"
                      style={{ lineHeight: "1.75", color: "#334155" }}
                    >
                      {benefit.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <div ref={rightWrapperRef} className="relative">
            <div className="sticky flex justify-center items-center" style={{ top: computedTopPx || stickyTopPx || undefined }}>
              <div
                ref={rightImageRef}
                className="relative z-0 w-full max-w-[1200px] xl:max-w-[1280px] 2xl:max-w-[1400px] aspect-[16/9] rounded-[36px] bg-white shadow-[0_32px_80px_rgba(15,23,42,0.15)] overflow-hidden"
                style={{
                  // Hide the whole card until a section is active
                  opacity: activeIndex >= 0 ? 1 : 0,
                  transition: "opacity 300ms ease",
                }}
                aria-hidden={activeIndex < 0}
              >
                {benefits.map((benefit, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <img
                      key={benefit.title}
                      src={benefit.image}
                      alt={`Dashboard for ${benefit.title}`}
                      className={`absolute inset-0 w-full h-full object-contain object-center transition-all duration-700 ${
                        isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      }`}
                      style={reducedMotion ? { transition: "none" } : undefined}
                      loading={index === 0 ? "eager" : "lazy"}
                      aria-hidden={!isActive}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
