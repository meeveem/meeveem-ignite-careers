import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, SearchX, Radar, Eye, Scale, DoorOpen, Target } from "lucide-react";
import dashboardStep1 from "@/assets/dashboard-step1.png";
import dashboardStep2 from "@/assets/dashboard-step2.png";
import dashboardStep3 from "@/assets/dashboard-step3.png";
import dashboardStep4 from "@/assets/dashboard-step4.png";
import dashboardStep5 from "@/assets/dashboard-step5.png";
import dashboardStep6 from "@/assets/dashboard-step6.png";

interface Benefit {
  icon: any;
  title: string;
  keyPhrase: string;
  description: string;
  image: string;
}

const benefits: Benefit[] = [
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
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const stickyRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Detect mobile and reduced motion preference
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    const checkMotion = () => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
    };

    checkMobile();
    checkMotion();

    window.addEventListener("resize", checkMobile);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", checkMotion);

    return () => {
      window.removeEventListener("resize", checkMobile);
      mediaQuery.removeEventListener("change", checkMotion);
    };
  }, []);

  // Preload images
  useEffect(() => {
    benefits.forEach((benefit) => {
      const img = new Image();
      img.src = benefit.image;
    });
  }, []);

  // Handle internal scroll
  const handleInternalScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const viewH = el.clientHeight;
    const scrollTop = el.scrollTop;
    const progress = scrollTop / viewH;

    setScrollProgress(progress);
    setCurrentIndex(Math.round(progress));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isMobile || prefersReducedMotion) return;

    el.addEventListener("scroll", handleInternalScroll, { passive: true });
    handleInternalScroll(); // Initial call

    return () => {
      el.removeEventListener("scroll", handleInternalScroll);
    };
  }, [isMobile, prefersReducedMotion, handleInternalScroll]);

  // Wheel handler: prioritize internal scroll
  const handleWheel = useCallback((e: React.WheelEvent) => {
    const el = scrollRef.current;
    if (!el || isMobile || prefersReducedMotion) return;

    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) {
      e.preventDefault();
      el.scrollTop += e.deltaY;
    }
  }, [isMobile, prefersReducedMotion]);

  // Touch handler: prioritize internal scroll
  const touchStartY = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el || isMobile || prefersReducedMotion) return;

    const deltaY = touchStartY.current - e.touches[0].clientY;
    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    if ((deltaY > 0 && !atBottom) || (deltaY < 0 && !atTop)) {
      e.preventDefault();
    }
  }, [isMobile, prefersReducedMotion]);

  // Dot navigation
  const scrollToSlide = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const viewH = el.clientHeight;
    el.scrollTo({
      top: index * viewH,
      behavior: "smooth",
    });
  }, []);

  // Calculate opacity and transform based on scroll progress
  const calculateTextOpacity = (index: number): number => {
    const distance = Math.abs(scrollProgress - index);
    if (distance > 1) return 0;
    return Math.pow(1 - distance, 0.9);
  };

  const calculateTextTranslate = (index: number): number => {
    const distance = Math.abs(scrollProgress - index);
    if (distance > 1) return 20;
    return 20 * distance;
  };

  const calculateImageOpacity = (index: number): number => {
    const distance = Math.abs(scrollProgress - index);
    if (distance > 1) return 0;
    return Math.pow(1 - distance, 1.2);
  };

  const calculateImageScale = (index: number): number => {
    const distance = Math.abs(scrollProgress - index);
    if (distance > 1) return 0.98;
    return 0.98 + 0.02 * (1 - distance);
  };

  // Mobile/Reduced Motion Fallback
  if (isMobile || prefersReducedMotion) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
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
                      alt={benefit.title}
                      className="w-full h-auto rounded-lg shadow-sm"
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

  // Desktop: Internal scroll with overlay
  return (
    <section id="benefits" className="relative">
      <div
        ref={stickyRef}
        className="sticky top-16 md:top-20 lg:top-24 h-[min(100svh,860px)] bg-white overflow-hidden"
        style={{ height: "min(100svh, 860px)" }}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Overlay content (header, dots, text, images) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Header */}
          <div className="text-center pt-12 pb-8">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 pointer-events-auto" style={{ color: "#0F172A" }}>
              Searching Smarter Starts Here
            </h2>
            <p className="text-lg lg:text-xl max-w-3xl mx-auto pointer-events-auto" style={{ color: "#334155" }}>
              Endless scrolling, vague job descriptions and slow responses. Meeveem AI removes the guesswork and makes
              finding the right role fast, fair and personal.
            </p>
          </div>

          {/* Dot Navigation */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto z-10">
            {benefits.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "scale-125"
                    : "hover:bg-gray-400"
                }`}
                style={{
                  backgroundColor: currentIndex === index ? "#2563EB" : "#D1D5DB",
                }}
                aria-label={`Go to benefit ${index + 1}`}
              />
            ))}
          </div>

          {/* Content Grid */}
          <div className="container mx-auto px-6 h-full flex items-center max-w-[1200px]">
            <div className="grid lg:grid-cols-12 gap-12 w-full items-center">
              {/* Text Column */}
              <div className="lg:col-span-5 relative h-[300px]">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  const opacity = calculateTextOpacity(index);
                  const translateY = calculateTextTranslate(index);

                  return (
                    <div
                      key={index}
                      className="absolute inset-0 pointer-events-auto"
                      style={{
                        opacity,
                        transform: `translateY(${translateY}px)`,
                        transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
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

              {/* Image Column */}
              <div className="lg:col-span-7 relative h-[400px]">
                {benefits.map((benefit, index) => {
                  const opacity = calculateImageOpacity(index);
                  const scale = calculateImageScale(index);

                  return (
                    <div
                      key={index}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        opacity,
                        transform: `scale(${scale})`,
                        transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
                      }}
                    >
                      <img
                        src={benefit.image}
                        alt={benefit.title}
                        className="rounded-lg shadow-sm w-full h-full object-contain"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scroll indicator (only visible on first slide) */}
          {currentIndex === 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto animate-bounce">
              <span className="text-sm" style={{ color: "#64748B" }}>
                Scroll to explore
              </span>
              <ChevronDown className="w-5 h-5" style={{ color: "#64748B" }} />
            </div>
          )}
        </div>

        {/* Internal scroller (invisible, drives the timeline) */}
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto"
          style={{
            scrollSnapType: "y mandatory",
            scrollBehavior: "smooth",
          }}
          tabIndex={0}
        >
          {benefits.map((_, index) => (
            <div
              key={index}
              className="h-full w-full"
              style={{ scrollSnapAlign: "start" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
