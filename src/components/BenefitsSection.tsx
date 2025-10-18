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
          
          // Calculate scroll progress (0 to 1) within the section
          const scrollProgress = Math.max(
            0,
            Math.min(1, -rect.top / (sectionHeight - viewportHeight))
          );

          // Determine active step (0-5)
          const newIndex = Math.min(
            5,
            Math.floor(scrollProgress * 6)
          );
          
          setActiveIndex(newIndex);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, [reducedMotion]);

  const getStepProgress = (index: number) => {
    if (reducedMotion) return index === activeIndex ? 1 : 0;

    const section = sectionRef.current;
    if (!section) return 0;

    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    const scrollProgress = Math.max(0, Math.min(1, -rect.top / (sectionHeight - viewportHeight)));
    const stepSize = 1 / 6;
    const stepStart = index * stepSize;
    const stepEnd = (index + 1) * stepSize;

    if (scrollProgress < stepStart) return 0;
    if (scrollProgress > stepEnd) return 0;

    const stepProgress = (scrollProgress - stepStart) / stepSize;
    return stepProgress;
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
        style={{ height: "600vh", backgroundColor: "#FFF9F2" }}
        id="feature-scroll"
      >
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="container mx-auto px-8 max-w-[1200px] py-[120px]">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#1E293B" }}>
                Searching Smarter Starts Here
              </h2>
              <p className="text-lg lg:text-xl" style={{ color: "#475569" }}>
                Endless scrolling, vague job descriptions and slow responses. Meeveem AI removes the guesswork and makes
                finding the right role fast, fair and personal.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Left: Text Steps */}
              <div className="lg:col-span-5 relative min-h-[400px]">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  const progress = getStepProgress(index);
                  const isActive = activeIndex === index;
                  
                  // Entry/exit animations
                  const fadeIn = Math.min(1, progress / 0.15);
                  const fadeOut = progress > 0.85 ? Math.max(0, 1 - (progress - 0.85) / 0.15) : 1;
                  const opacity = Math.min(fadeIn, fadeOut);
                  
                  const translateY = progress < 0.15
                    ? 16 * (1 - fadeIn)
                    : progress > 0.85
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
                        opacity,
                        transform: `translateY(${translateY}px)`,
                        transition: "opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1), transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
                        pointerEvents: isActive ? "auto" : "none",
                        willChange: isActive ? "transform, opacity" : "auto",
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center mb-6"
                        style={{
                          opacity: Math.min(1, (progress / 0.15) * 1.2),
                          transition: "opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1) 0s",
                        }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3
                        className="text-[28px] sm:text-[32px] lg:text-[40px] font-bold mb-4"
                        style={{
                          lineHeight: "1.1",
                          color: "#1E293B",
                          opacity: Math.min(1, (progress / 0.15) * 1.1),
                          transition: "opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.06s",
                        }}
                      >
                        {benefit.title}
                      </h3>
                      <p
                        className="font-semibold text-[17px] sm:text-[18px] mb-3"
                        style={{
                          color: "#2563EB",
                          opacity: Math.min(1, (progress / 0.15) * 1.05),
                          transition: "opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.12s",
                        }}
                      >
                        {benefit.keyPhrase}
                      </p>
                      <p
                        className="text-[16px] sm:text-[18px]"
                        style={{
                          lineHeight: "1.75",
                          color: "#475569",
                          opacity: Math.min(1, (progress / 0.15)),
                          transition: "opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.18s",
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
                  const isActive = activeIndex === index;
                  
                  // Radial mask reveal
                  const maskStop = Math.min(140, progress * 140);
                  
                  // Opacity, blur, scale
                  const opacity = Math.min(1, progress / 0.15) * Math.max(0, 1 - Math.max(0, progress - 0.85) / 0.15);
                  const blur = Math.max(0, 12 * (1 - progress / 0.2));
                  const scale = 0.96 + 0.04 * Math.min(1, progress / 0.2);

                  return (
                    <div
                      key={index}
                      className="absolute inset-0"
                      style={{
                        opacity,
                        filter: `blur(${blur}px)`,
                        transform: `scale(${scale})`,
                        transition: "opacity 0.3s ease-out, filter 0.4s ease-out, transform 0.4s ease-out",
                        willChange: isActive ? "transform, opacity, filter" : "auto",
                      }}
                    >
                      <img
                        src={benefit.image}
                        alt={`Dashboard for ${benefit.title}`}
                        className="w-full h-full object-cover rounded-[24px]"
                        style={{
                          boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
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
