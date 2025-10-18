import { SearchX, Radar, Eye, Scale, DoorOpen, Target } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [headerProgress, setHeaderProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const section = sectionRef.current;
          if (!section) return;

          const rect = section.getBoundingClientRect();
          const sectionHeight = section.offsetHeight;
          const viewportHeight = window.innerHeight;
          
          // Total scroll distance in the section
          const totalScroll = sectionHeight - viewportHeight;
          const currentScroll = -rect.top;
          
          // Phase 1: Header intro (0-100vh = 0-13.3%)
          // Phase 2: Header fade out (100-150vh = 13.3-20%)
          // Phase 3: Steps (150-750vh = 20-100%)
          
          const headerIntroEnd = viewportHeight; // 100vh
          const headerFadeEnd = viewportHeight * 1.5; // 150vh
          const stepsStart = viewportHeight * 1.5; // 150vh
          
          // Header progress: 0 (visible) to 1 (faded out)
          if (currentScroll < headerIntroEnd) {
            setHeaderProgress(0);
          } else if (currentScroll < headerFadeEnd) {
            const fadeProgress = (currentScroll - headerIntroEnd) / (headerFadeEnd - headerIntroEnd);
            setHeaderProgress(fadeProgress);
          } else {
            setHeaderProgress(1);
          }
          
          // Steps progress after header
          if (currentScroll >= stepsStart) {
            const stepsScroll = currentScroll - stepsStart;
            const stepsTotal = totalScroll - stepsStart;
            const stepsProgress = Math.max(0, Math.min(1, stepsScroll / stepsTotal));
            
            const newIndex = Math.min(5, Math.floor(stepsProgress * 6));
            setActiveIndex(newIndex);
          } else {
            setActiveIndex(0);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [reducedMotion]);

  const getStepProgress = (index: number) => {
    if (reducedMotion) return index === activeIndex ? 1 : 0;

    const section = sectionRef.current;
    if (!section) return 0;

    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    const totalScroll = sectionHeight - viewportHeight;
    const currentScroll = -rect.top;
    
    const stepsStart = viewportHeight * 1.5;
    if (currentScroll < stepsStart) return 0;
    
    const stepsScroll = currentScroll - stepsStart;
    const stepsTotal = totalScroll - stepsStart;
    const stepsProgress = Math.max(0, Math.min(1, stepsScroll / stepsTotal));
    
    const stepSize = 1 / 6;
    const stepStart = index * stepSize;
    const stepEnd = (index + 1) * stepSize;

    if (stepsProgress < stepStart) return 0;
    if (stepsProgress > stepEnd) return 0;

    const stepProgress = (stepsProgress - stepStart) / stepSize;
    return stepProgress;
  };

  const navigateToStep = (stepIndex: number) => {
    const section = sectionRef.current;
    if (!section) return;
    
    const viewportHeight = window.innerHeight;
    const stepsStart = viewportHeight * 1.5;
    const stepSize = (section.offsetHeight - viewportHeight - stepsStart) / 6;
    const targetScroll = section.offsetTop + stepsStart + (stepIndex * stepSize);
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  if (reducedMotion) {
    // Fallback: vertical stack
    return (
      <section className="py-24" style={{ backgroundColor: "#FFF9F2" }}>
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#1E293B" }}>
              Searching Smarter Starts Here
            </h2>
            <p className="text-lg lg:text-xl" style={{ color: "#475569" }}>
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
                  className="grid md:grid-cols-2 gap-12 items-center"
                  role="region"
                  aria-label={`Step ${index + 1}: ${benefit.title}`}
                >
                  <div className="max-w-[560px]">
                    <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3
                      className="text-[28px] sm:text-[32px] lg:text-[40px] font-bold mb-4"
                      style={{ lineHeight: "1.1", color: "#1E293B" }}
                    >
                      {benefit.title}
                    </h3>
                    <p className="font-semibold text-[17px] sm:text-[18px] mb-3" style={{ color: "#2563EB" }}>
                      {benefit.keyPhrase}
                    </p>
                    <p
                      className="text-[16px] sm:text-[18px]"
                      style={{ lineHeight: "1.75", color: "#475569" }}
                    >
                      {benefit.description}
                    </p>
                  </div>
                  <div>
                    <img
                      src={benefit.image}
                      alt={`Dashboard showing ${benefit.title}`}
                      className="w-full rounded-[24px]"
                      style={{ boxShadow: "0 12px 24px rgba(0,0,0,0.12)" }}
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
    <>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .scroll-section * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
      <section
        ref={sectionRef}
        className="scroll-section relative"
        style={{ height: "750vh", backgroundColor: "#FFFFFF" }}
        id="feature-scroll"
      >
        {/* Scroll Indicator */}
        <div 
          className="fixed left-12 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
          style={{
            opacity: headerProgress >= 0.5 ? 1 : 0,
            transition: 'opacity 0.3s ease-out'
          }}
        >
          <div className="flex flex-col gap-6">
            {benefits.map((benefit, idx) => {
              const isActive = activeIndex === idx && headerProgress >= 1;
              return (
                <button
                  key={idx}
                  onClick={() => navigateToStep(idx)}
                  className="group flex items-center gap-3 transition-all duration-300"
                  aria-label={`Navigate to ${benefit.title}`}
                >
                  <div 
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? "#2563EB" : "#CBD5E1",
                      transform: isActive ? "scale(1.5)" : "scale(1)",
                    }}
                  />
                  <span 
                    className="text-xs font-medium whitespace-nowrap transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                    style={{
                      color: isActive ? "#0F172A" : "#64748B",
                    }}
                  >
                    {benefit.keyPhrase}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="container mx-auto px-8 max-w-[1200px] py-[120px]">
            {/* Header - fades out during scroll */}
            <div 
              className="text-center max-w-3xl mx-auto mb-12 transition-all duration-500"
              style={{
                opacity: 1 - headerProgress,
                transform: `translateY(${headerProgress * -20}px)`,
                pointerEvents: headerProgress >= 1 ? 'none' : 'auto'
              }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#0F172A" }}>
                Searching Smarter Starts Here
              </h2>
              <p className="text-lg lg:text-xl" style={{ color: "#334155" }}>
                Endless scrolling, vague job descriptions and slow responses. Meeveem AI removes the guesswork and makes
                finding the right role fast, fair and personal.
              </p>
            </div>

            {/* Steps Grid - only visible after header fades */}
            <div 
              className="grid lg:grid-cols-12 gap-12 items-center"
              style={{
                opacity: Math.max(0, Math.min(1, (headerProgress - 0.5) * 2)),
                transform: `translateY(${Math.max(0, 30 * (1 - headerProgress * 2))}px)`
              }}
            >
              {/* Left: Text Steps */}
              <div className="lg:col-span-5 relative min-h-[400px]">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  const progress = getStepProgress(index);
                  const isActive = activeIndex === index && headerProgress >= 1;
                  
                  // Faster, snappier animations (10% instead of 15%)
                  const fadeIn = Math.min(1, progress / 0.1);
                  const fadeOut = progress > 0.9 ? Math.max(0, 1 - (progress - 0.9) / 0.1) : 1;
                  const opacity = Math.min(fadeIn, fadeOut);
                  
                  const translateY = progress < 0.1
                    ? 16 * (1 - fadeIn)
                    : progress > 0.9
                    ? 16 * (1 - fadeOut)
                    : 0;

                  return (
                    <div
                      key={index}
                      className="absolute inset-0 max-w-[560px]"
                      role="region"
                      aria-label={`Step ${index + 1}: ${benefit.title}`}
                      aria-live={isActive ? "polite" : "off"}
                      style={{
                        opacity: opacity * (headerProgress >= 1 ? 1 : 0),
                        transform: `translateY(${translateY}px)`,
                        transition: "opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                        pointerEvents: isActive ? "auto" : "none",
                        willChange: isActive ? "transform, opacity" : "auto",
                        contentVisibility: isActive ? "auto" : "hidden"
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center mb-6"
                        style={{
                          opacity: Math.min(1, (progress / 0.1) * 1.2),
                          transition: "opacity 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0s",
                        }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3
                        className="text-[28px] sm:text-[32px] lg:text-[40px] font-bold mb-4"
                        style={{
                          lineHeight: "1.1",
                          color: "#0F172A",
                          opacity: Math.min(1, (progress / 0.1) * 1.1),
                          transition: "opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1) 0.04s",
                        }}
                      >
                        {benefit.title}
                      </h3>
                      <p
                        className="font-semibold text-[17px] sm:text-[18px] mb-3 px-3 py-1 rounded-md inline-block"
                        style={{
                          color: "#2563EB",
                          backgroundColor: "rgba(37, 99, 235, 0.08)",
                          opacity: Math.min(1, (progress / 0.1) * 1.05),
                          transition: "opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.04s",
                        }}
                      >
                        {benefit.keyPhrase}
                      </p>
                      <p
                        className="text-[16px] sm:text-[18px]"
                        style={{
                          lineHeight: "1.75",
                          color: "#334155",
                          opacity: Math.min(1, (progress / 0.1)),
                          transition: "opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.04s",
                        }}
                      >
                        {benefit.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Right: Images */}
              <div className="lg:col-span-7 relative aspect-[4/3]">
                {benefits.map((benefit, index) => {
                  const progress = getStepProgress(index);
                  const isActive = activeIndex === index && headerProgress >= 1;
                  
                  // Faster radial mask reveal - complete by 30% of step
                  const maskStop = progress <= 0.3 
                    ? Math.min(100, (progress / 0.3) * 100)
                    : 100;
                  
                  // Simplified animations - no blur, just clean fade + scale
                  const fadeIn = Math.min(1, progress / 0.1);
                  const fadeOut = progress > 0.9 ? Math.max(0, 1 - (progress - 0.9) / 0.1) : 1;
                  const opacity = Math.min(fadeIn, fadeOut) * (headerProgress >= 1 ? 1 : 0);
                  
                  const scale = 0.95 + 0.05 * Math.min(1, progress / 0.15);
                  
                  // Subtle parallax
                  const parallax = isActive ? progress * 8 : 0;

                  return (
                    <div
                      key={index}
                      className="absolute inset-0"
                      style={{
                        opacity,
                        transform: `scale(${scale}) translateY(${-parallax}px)`,
                        transition: "opacity 0.25s ease-out, transform 0.35s ease-out",
                        willChange: isActive ? "transform, opacity" : "auto",
                        contentVisibility: isActive ? "auto" : "hidden"
                      }}
                    >
                      <img
                        src={benefit.image}
                        alt={`Dashboard for ${benefit.title}`}
                        className="w-full h-full object-cover rounded-[24px]"
                        style={{
                          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                          maskImage: `radial-gradient(circle at 50% 50%, #000 0%, #000 ${maskStop}%, transparent ${maskStop + 1}%)`,
                          WebkitMaskImage: `radial-gradient(circle at 50% 50%, #000 0%, #000 ${maskStop}%, transparent ${maskStop + 1}%)`,
                        }}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BenefitsSection;
