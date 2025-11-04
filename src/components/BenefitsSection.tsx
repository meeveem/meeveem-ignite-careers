import { useState, useRef, useEffect, useCallback } from "react";
import { SearchX, Radar, Eye, Scale, DoorOpen, Target } from "lucide-react";
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

    computeStickyTop();
    window.addEventListener("resize", computeStickyTop);
    return () => window.removeEventListener("resize", computeStickyTop);
  }, []);

  // Handle scroll-based animation with Intersection Observer
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const handleScroll = () => {
      const section = document.getElementById("benefits");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Section is in viewport
      if (rect.top <= 0 && rect.bottom >= viewportHeight) {
        // Calculate how far we've scrolled into the section
        const scrolled = Math.abs(rect.top);
        const sectionScrollHeight = rect.height - viewportHeight;
        
        if (sectionScrollHeight > 0) {
          const progress = (scrolled / sectionScrollHeight) * (benefits.length - 1);
          const clampedProgress = Math.max(0, Math.min(benefits.length - 1, progress));
          
          setScrollProgress(clampedProgress);
          setCurrentIndex(Math.round(clampedProgress));
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile, prefersReducedMotion, benefits.length]);

  // Dot navigation
  const scrollToSlide = useCallback((index: number) => {
    const section = document.getElementById("benefits");
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const sectionScrollHeight = rect.height - viewportHeight;
    
    const targetProgress = index / (benefits.length - 1);
    const targetScroll = window.scrollY + rect.top + (targetProgress * sectionScrollHeight);

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  }, [benefits.length]);

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

  // Desktop: Scroll hijacking with overlay
  return (
    <section id="benefits" className="relative" style={{ height: `${benefits.length * 50}vh` }}>
      <div
        ref={stickyRef}
        className="sticky top-16 md:top-20 lg:top-24 h-[min(100svh,860px)] bg-white overflow-hidden"
        style={{ height: "min(100svh, 860px)" }}
      >
        {/* Overlay content (header, dots, text, images) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Header */}
          <div className="text-center pt-12 pb-8 px-6">
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
        </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
