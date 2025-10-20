import { SearchX, Radar, Eye, Scale, DoorOpen, Target } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
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

const SEGMENT_DURATION = 1 / 6;

// Utility to get sticky top offset in pixels by reading CSS
const getStickyTopOffsetPx = (stickyEl: HTMLElement | null): number => {
  if (!stickyEl) {
    // Fallback based on viewport width
    const w = window.innerWidth;
    if (w >= 1024) return 96;  // lg: top-24 = 96px
    if (w >= 768) return 80;   // md: top-20 = 80px
    return 64;                 // base: top-16 = 64px
  }
  const top = getComputedStyle(stickyEl).top;
  const px = parseFloat(top);
  return Number.isFinite(px) ? px : 96;
};

const BenefitsSection = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInStepsZone, setIsInStepsZone] = useState(false);
  const [showDots, setShowDots] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lockedStepIndex, setLockedStepIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [noTransitionStep, setNoTransitionStep] = useState<number | null>(null);
  const noTransitionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    setIsMobile(window.innerWidth < 1024);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    
    mediaQuery.addEventListener("change", handleChange);
    window.addEventListener("resize", handleResize);
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Preload images
  useEffect(() => {
    benefits.forEach((benefit) => {
      const img = new Image();
      img.src = benefit.image;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (noTransitionTimerRef.current) window.clearTimeout(noTransitionTimerRef.current);
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionBottom = sectionTop + rect.height;
    const viewportBottom = window.innerHeight;

    const vh = window.innerHeight;
    const stickyOffset = getStickyTopOffsetPx(stickyRef.current);
    
    // Calculate actual scroll distance while pinned
    const stepsHeight = (rect.height - vh) + stickyOffset;

    // Check if we're in the steps zone AND still within section bounds
    const isPastHeader = sectionTop <= stickyOffset;
    const isBeforeEnd = sectionBottom > viewportBottom;

    if (isPastHeader && isBeforeEnd) {
      setIsInStepsZone(true);
      setShowDots(true);

      const stepsScroll = Math.abs(sectionTop - stickyOffset);
      const progress = Math.min(1, Math.max(0, stepsScroll / stepsHeight));
      setScrollProgress(progress);
    } else {
      setIsInStepsZone(false);
      if (sectionTop > 0) {
        setScrollProgress(0.1);
        setShowDots(true); // Fade back in when scrolling up
      } else if (!isBeforeEnd) {
        setScrollProgress(1);
        setShowDots(false); // Fade out when unpinning
      }
    }
  }, []);

  useEffect(() => {
    if (isMobile || reducedMotion) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, isMobile, reducedMotion]);

  const calculateTextOpacity = (progress: number, stepIndex: number): number => {
    if (lockedStepIndex !== null) return stepIndex === lockedStepIndex ? 1 : 0;
    const segStart = stepIndex * SEGMENT_DURATION;
    const segEnd = (stepIndex + 1) * SEGMENT_DURATION;
    const fadeInPortion = 0.15 * SEGMENT_DURATION;
    const fadeOutPortion = 0.15 * SEGMENT_DURATION;
    const holdStart = segStart + fadeInPortion;
    const holdEnd = segEnd - fadeOutPortion;

    if (progress < segStart || progress > segEnd) return 0;

    // Fade in
    if (progress < holdStart) {
      return (progress - segStart) / fadeInPortion;
    }
    
    // Hold at full opacity
    if (progress <= holdEnd) {
      return 1;
    }
    
    // Fade out (except for last card)
    if (stepIndex === benefits.length - 1) {
      return 1;
    }
    return 1 - (progress - holdEnd) / fadeOutPortion;
  };

  const calculateTextTranslate = (progress: number, stepIndex: number): number => {
    if (lockedStepIndex !== null) return 0;
    const segStart = stepIndex * SEGMENT_DURATION;
    const segEnd = (stepIndex + 1) * SEGMENT_DURATION;
    const fadeInPortion = 0.15 * SEGMENT_DURATION;
    const fadeOutPortion = 0.15 * SEGMENT_DURATION;
    const holdStart = segStart + fadeInPortion;
    const holdEnd = segEnd - fadeOutPortion;

    if (progress < segStart) return 20;
    if (progress > segEnd && stepIndex !== benefits.length - 1) return -20;

    // Slide in during fade-in
    if (progress < holdStart) {
      return 20 * (1 - (progress - segStart) / fadeInPortion);
    }
    
    // Hold at 0 during full opacity
    if (progress <= holdEnd) {
      return 0;
    }
    
    // Slide out during fade-out (except for last card)
    if (stepIndex === benefits.length - 1) {
      return 0;
    }
    return -20 * ((progress - holdEnd) / fadeOutPortion);
  };

  const calculateImageOpacity = (progress: number, stepIndex: number): number => {
    if (lockedStepIndex !== null) return stepIndex === lockedStepIndex ? 1 : 0;
    const segStart = stepIndex * SEGMENT_DURATION;
    const segEnd = (stepIndex + 1) * SEGMENT_DURATION;
    const fadeInPortion = 0.15 * SEGMENT_DURATION;
    const fadeOutPortion = 0.15 * SEGMENT_DURATION;
    const holdStart = segStart + fadeInPortion;
    const holdEnd = segEnd - fadeOutPortion;

    if (progress < segStart || progress > segEnd) return 0;

    // Fade in
    if (progress < holdStart) {
      return (progress - segStart) / fadeInPortion;
    }
    
    // Hold at full opacity
    if (progress <= holdEnd) {
      return 1;
    }
    
    // Fade out (except for last card)
    if (stepIndex === benefits.length - 1) {
      return 1;
    }
    return 1 - (progress - holdEnd) / fadeOutPortion;
  };

  const calculateImageScale = (progress: number, stepIndex: number): number => {
    if (lockedStepIndex !== null) return 1;
    const opacity = calculateImageOpacity(progress, stepIndex);
    return 0.98 + 0.02 * opacity;
  };

  const waitForScrollSettled = (targetY: number, timeoutMs = 1500) =>
    new Promise<void>((resolve) => {
      let lastY = window.scrollY;
      let stableFrames = 0;
      const start = performance.now();
      const check = () => {
        const y = window.scrollY;
        const nearTarget = Math.abs(y - targetY) < 1;
        const delta = Math.abs(y - lastY);
        lastY = y;
        if (nearTarget || delta < 0.5) {
          stableFrames++;
          if (stableFrames >= 2) return resolve();
        } else {
          stableFrames = 0;
        }
        if (performance.now() - start > timeoutMs) return resolve();
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    });

  const scrollToStep = async (stepIndex: number) => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const rect = section.getBoundingClientRect();
    const currentScrollY = window.scrollY;

    const sectionTop = currentScrollY + rect.top;
    
    const vh = window.innerHeight;
    const stickyOffset = getStickyTopOffsetPx(stickyRef.current);
    const stepsHeight = (rect.height - vh) + stickyOffset;
    
    const targetProgress = stepIndex * SEGMENT_DURATION + 0.5 * SEGMENT_DURATION;
    const targetScroll = sectionTop + stickyOffset + targetProgress * stepsHeight;

    if (noTransitionTimerRef.current) window.clearTimeout(noTransitionTimerRef.current);
    setNoTransitionStep(stepIndex);
    setLockedStepIndex(stepIndex);

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });

    await waitForScrollSettled(targetScroll);
    handleScroll();
    setLockedStepIndex(null);
    noTransitionTimerRef.current = window.setTimeout(() => {
      setNoTransitionStep(null);
    }, 300);
  };

  // Mobile/Reduced Motion Fallback
  if (isMobile || reducedMotion) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#0F172A" }}>
              Searching Smarter Starts Here
            </h2>
            <p className="text-lg lg:text-xl" style={{ color: "#334155" }}>
              Endless scrolling, vague job descriptions and slow responses. Meeveem AI removes the guesswork and makes
              finding the right role fast, fair and personal.
            </p>
          </div>
          <div className="space-y-16">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="grid lg:grid-cols-12 gap-12 items-center"
                  role="region"
                  aria-label={`Step ${index + 1}: ${benefit.title}`}
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

  const currentStepIndex = Math.min(
    benefits.length - 1,
    Math.max(0, Math.floor(scrollProgress / SEGMENT_DURATION + 1e-6))
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: "400vh" }}
      aria-label="Interactive product showcase"
    >

      {/* Container sticky with header and cards */}
      <div
        ref={stickyRef}
        className="sticky top-16 md:top-20 lg:top-24 h-screen overflow-hidden overscroll-contain"
        style={{
          position: "sticky",
          height: "100vh",
        }}
      >
        {/* Scroll Indicator - Absolute positioned within sticky container */}
        <div
          className="absolute left-12 top-[calc(8rem+2rem+4rem)] z-50 hidden lg:block transition-opacity duration-600"
          style={{
            opacity: isInStepsZone && showDots ? 1 : 0,
            pointerEvents: isInStepsZone && showDots ? "auto" : "none",
          }}
        >
          <div className="flex flex-col gap-6">
            {benefits.map((benefit, idx) => {
              const isActive = (lockedStepIndex ?? currentStepIndex) === idx;
              return (
                <button
                  key={idx}
                  onClick={() => scrollToStep(idx)}
                  className="group transition-all duration-300 hover:scale-110"
                  aria-label={`Navigate to step ${idx + 1}: ${benefit.keyPhrase}`}
                >
                  <div
                    className="w-3 h-3 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? "#2563EB" : "#CBD5E1",
                      transform: isActive ? "scale(1.25)" : "scale(1)",
                      boxShadow: isActive ? "0 0 12px rgba(37, 99, 235, 0.5)" : "none",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-8 max-w-[1100px] h-full flex flex-col">
          {/* Header inside sticky container */}
          <div className="pt-8 md:pt-10 pb-2 text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#0F172A" }}>
              Searching Smarter Starts Here
            </h2>
            <p className="text-lg lg:text-xl max-w-3xl mx-auto" style={{ color: "#334155" }}>
              Endless scrolling, vague job descriptions and slow responses. Meeveem AI removes the guesswork and makes
              finding the right role fast, fair and personal.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Textes stacked avec cross-fade - 5 colonnes */}
            <div className="lg:col-span-5 relative h-full flex items-center">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                const opacity = calculateTextOpacity(scrollProgress, idx);
                const translateY = calculateTextTranslate(scrollProgress, idx);

                return (
                  <div
                    key={idx}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{
                      opacity: opacity,
                      transform: `translateY(${translateY}px)`,
                      transition: lockedStepIndex !== null || noTransitionStep !== null || reducedMotion ? "none" : "opacity 0.6s ease-out, transform 0.6s ease-out",
                      pointerEvents: lockedStepIndex !== null ? (idx === lockedStepIndex ? "auto" : "none") : (opacity > 0 ? "auto" : "none"),
                      contentVisibility: lockedStepIndex !== null ? (idx === lockedStepIndex ? "auto" : "hidden") : (Math.abs(idx - currentStepIndex) <= 1 ? "auto" : "hidden"),
                      zIndex: lockedStepIndex === idx ? 10 : 0,
                    }}
                  >
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
                );
              })}
            </div>

            {/* Images stacked avec cross-fade - 7 colonnes */}
            <div className="lg:col-span-7 relative h-full flex items-center">
              <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
                {benefits.map((benefit, idx) => {
                  const opacity = calculateImageOpacity(scrollProgress, idx);
                  const scale = calculateImageScale(scrollProgress, idx);

                  return (
                    <img
                      key={idx}
                      src={benefit.image}
                      alt={`Dashboard for ${benefit.title}`}
                      className="absolute inset-0 w-full h-full object-contain rounded-[24px]"
                      style={{
                        opacity: opacity,
                        transform: `scale(${scale})`,
                        transition: lockedStepIndex !== null || noTransitionStep !== null || reducedMotion ? "none" : "opacity 0.6s ease-out, transform 0.6s ease-out",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                        contentVisibility: lockedStepIndex !== null ? (idx === lockedStepIndex ? "auto" : "hidden") : (Math.abs(idx - currentStepIndex) <= 1 ? "auto" : "hidden"),
                        pointerEvents: lockedStepIndex !== null ? (idx === lockedStepIndex ? "auto" : "none") : (opacity > 0 ? "auto" : "none"),
                        zIndex: lockedStepIndex === idx ? 10 : 0,
                      }}
                      loading={idx === 0 ? "eager" : "lazy"}
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
