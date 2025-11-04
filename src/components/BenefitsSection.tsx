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
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [stickyTopPx, setStickyTopPx] = useState<number>(120);

  const sectionRef = useRef<HTMLElement>(null);
  const articleRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Simple sticky positioning based on header
  useEffect(() => {
    if (isMobile || reducedMotion) return;

    const updateStickyPosition = () => {
      const header = document.querySelector('[data-benefits-heading="true"]') as HTMLElement | null;
      if (!header) return;

      const headerRect = header.getBoundingClientRect();
      const navHeight = 96;
      const minTop = Math.max(navHeight, headerRect.bottom + 24);
      setStickyTopPx(minTop);
    };

    updateStickyPosition();
    window.addEventListener('scroll', updateStickyPosition, { passive: true });
    window.addEventListener('resize', updateStickyPosition);

    return () => {
      window.removeEventListener('scroll', updateStickyPosition);
      window.removeEventListener('resize', updateStickyPosition);
    };
  }, [isMobile, reducedMotion]);

  // Simplified active detection - reveal when first article is 50% visible
  useEffect(() => {
    if (isMobile || reducedMotion) return;

    let ticking = false;

    const updateActive = () => {
      ticking = false;
      const refs = articleRefs.current;
      if (!refs.length) return;

      const first = refs[0];
      const last = refs[refs.length - 1];
      if (!first || !last) return;

      const firstRect = first.getBoundingClientRect();
      const lastRect = last.getBoundingClientRect();
      const viewportCenter = window.innerHeight * 0.4;

      // Check if we're in the section range
      const inSection = firstRect.top < window.innerHeight && lastRect.bottom > 0;

      if (inSection) {
        let bestIdx = 0;
        let bestDist = Number.POSITIVE_INFINITY;

        refs.forEach((el, idx) => {
          if (!el) return;
          const r = el.getBoundingClientRect();

          const mid = r.top + r.height / 2;
          const d = Math.abs(mid - viewportCenter);

          if (d < bestDist) {
            bestDist = d;
            bestIdx = idx;
          }
        });

        if (bestIdx !== activeIndex) setActiveIndex(bestIdx);
      } else {
        if (activeIndex !== -1) setActiveIndex(-1);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActive);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
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
      <section className="py-8 bg-white" ref={sectionRef}>
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="text-center max-w-3xl mx-auto mb-8">
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
      className="py-8 bg-white relative isolate"
      aria-label="Interactive product showcase"
    >
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-8 relative z-20" data-benefits-heading="true">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#0F172A" }}>
            Searching Smarter Starts Here
          </h2>
          <p className="text-lg lg:text-xl" style={{ color: "#334155" }}>
            Endless scrolling, vague job descriptions and slow responses. Meeveem AI removes the
            guesswork and makes finding the right role fast, fair and personal.
          </p>
        </div>

        <div className="relative lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-14">
          {/* Left column: Text content */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const isActive = index === activeIndex;

              return (
                <article
                  key={benefit.title}
                  ref={(el) => {
                    articleRefs.current[index] = el as HTMLDivElement | null;
                  }}
                  className="min-h-[60vh] flex items-center"
                >
                  <div
                    className={`transition-all duration-300 ${
                      isActive ? "opacity-100 scale-100" : "opacity-60 scale-95"
                    }`}
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

          {/* Right column: Sticky image */}
          <div className="hidden lg:block">
            <div
              className="sticky flex items-center justify-center"
              style={{
                top: `${stickyTopPx}px`,
                height: 'calc(100vh - 160px)',
              }}
            >
              <div
                className="relative w-full aspect-[4/3] rounded-[24px] bg-white shadow-2xl overflow-hidden"
              >
                {benefits.map((benefit, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <img
                      key={benefit.title}
                      src={benefit.image}
                      alt={`Dashboard for ${benefit.title}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                        isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      }`}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
