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

const BenefitsSection = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInStepsZone, setIsInStepsZone] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionBottom = sectionTop + rect.height;
    const viewportBottom = window.innerHeight;

    const headerHeight = 0;
    const stepsHeight = window.innerHeight * 3.5;

    // Check if we're in the steps zone AND still within section bounds
    // Pin when section top reaches 15% of viewport to keep title visible
    const isPastHeader = sectionTop <= window.innerHeight * 0.15;
    const isBeforeEnd = sectionBottom > viewportBottom * 0.5;

    if (isPastHeader && isBeforeEnd && scrollProgress < 0.99) {
      setIsInStepsZone(true);

      const stepsScroll = Math.abs(sectionTop - window.innerHeight * 0.15);
      const progress = Math.min(1, Math.max(0, stepsScroll / stepsHeight));
      setScrollProgress(progress);
    } else {
      setIsInStepsZone(false);
      if (sectionTop > 0) {
        setScrollProgress(0.1);
      } else if (!isBeforeEnd) {
        setScrollProgress(1);
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
    const segmentStart = stepIndex * SEGMENT_DURATION;
    const segmentEnd = (stepIndex + 1) * SEGMENT_DURATION;
    const segmentMid = (segmentStart + segmentEnd) / 2;

    if (progress < segmentStart || progress > segmentEnd) return 0;

    // Fade in
    if (progress < segmentMid) {
      return (progress - segmentStart) / (SEGMENT_DURATION * 0.5);
    }
    // Fade out
    else {
      return 1 - (progress - segmentMid) / (SEGMENT_DURATION * 0.5);
    }
  };

  const calculateTextTranslate = (progress: number, stepIndex: number): number => {
    const segmentStart = stepIndex * SEGMENT_DURATION;
    const segmentEnd = (stepIndex + 1) * SEGMENT_DURATION;
    const segmentMid = (segmentStart + segmentEnd) / 2;

    if (progress < segmentStart) return 20;
    if (progress > segmentEnd) return -20;

    // Slide in
    if (progress < segmentMid) {
      return 20 * (1 - (progress - segmentStart) / (SEGMENT_DURATION * 0.5));
    }
    // Slide out
    else {
      return -20 * ((progress - segmentMid) / (SEGMENT_DURATION * 0.5));
    }
  };

  const calculateImageOpacity = (progress: number, stepIndex: number): number => {
    const segmentStart = stepIndex * SEGMENT_DURATION;
    const segmentEnd = (stepIndex + 1) * SEGMENT_DURATION;
    const segmentMid = (segmentStart + segmentEnd) / 2;

    if (progress < segmentStart || progress > segmentEnd) return 0;

    // Fade in
    if (progress < segmentMid) {
      return (progress - segmentStart) / (SEGMENT_DURATION * 0.5);
    }
    // Fade out
    else {
      return 1 - (progress - segmentMid) / (SEGMENT_DURATION * 0.5);
    }
  };

  const calculateImageScale = (progress: number, stepIndex: number): number => {
    const opacity = calculateImageOpacity(progress, stepIndex);
    return 0.98 + 0.02 * opacity;
  };

  const scrollToStep = (stepIndex: number) => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const rect = section.getBoundingClientRect();
    const currentScrollY = window.scrollY;

    const sectionTop = currentScrollY + rect.top;
    const headerHeight = window.innerHeight * 0.2;
    const targetProgress = (stepIndex + 0.5) / 6;
    const stepsHeight = window.innerHeight * 3.5;

    const targetScroll = sectionTop + headerHeight + targetProgress * stepsHeight;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
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

  const currentStepIndex = Math.round(scrollProgress * 6 - 0.5);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: "350vh" }}
      aria-label="Interactive product showcase"
    >
      {/* Scroll Indicator - Only visible when in steps zone */}
      {isInStepsZone && (
        <div
          className="fixed left-12 top-[45%] -translate-y-1/2 z-50 hidden lg:block"
          style={{
            opacity: isInStepsZone ? 1 : 0,
            transition: "opacity 0.3s ease-out",
            pointerEvents: isInStepsZone ? "auto" : "none",
          }}
        >
          <div className="flex flex-col gap-6">
            {benefits.map((benefit, idx) => {
              const isActive = currentStepIndex === idx;
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
      )}

      {/* Container sticky with header and cards */}
      <div
        className="sticky top-[10vh] md:top-[12vh] lg:top-[15vh] h-screen overflow-hidden"
        style={{
          position: "sticky",
          height: "100vh",
        }}
      >
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
                      transition: reducedMotion ? "none" : "opacity 0.6s ease-out, transform 0.6s ease-out",
                      pointerEvents: opacity > 0 ? "auto" : "none",
                      contentVisibility: Math.abs(idx - currentStepIndex) > 1 ? "hidden" : "auto",
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
                        transition: reducedMotion ? "none" : "opacity 0.6s ease-out, transform 0.6s ease-out",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                        contentVisibility: Math.abs(idx - currentStepIndex) > 1 ? "hidden" : "auto",
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
