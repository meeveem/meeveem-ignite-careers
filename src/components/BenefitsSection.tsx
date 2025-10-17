import { Card } from "@/components/ui/card";
import { SearchX, Radar, Eye, Scale, DoorOpen, Target } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const benefits = [
  {
    icon: SearchX,
    title: "Wasted hours on irrelevant jobs?",
    keyPhrase: "Stop scrolling endlessly.",
    description: " We match you with roles that actually fit, fast.",
  },
  {
    icon: Radar,
    title: "Missing the roles meant for you?",
    keyPhrase: "Don't miss out again.",
    description: " Discover real roles matched to your strengths.",
  },
  {
    icon: Eye,
    title: "Feeling invisible in the job market?",
    keyPhrase: "Be seen for your potential.",
    description: " We help employers look beyond your job titles.",
  },
  {
    icon: Scale,
    title: "Tired of unfair filters?",
    keyPhrase: "No buzzwords. No bias.",
    description: " Just fair matches based on what you can do.",
  },
  {
    icon: DoorOpen,
    title: "Wish you knew the work vibe?",
    keyPhrase: "See behind the job ad.",
    description: " Get the inside view before you hit apply.",
  },
  {
    icon: Target,
    title: "Bombarded with irrelevant jobs?",
    keyPhrase: "Take control.",
    description: " Get matched only to roles that truly fit you.",
  },
];

const BenefitsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6,
      }
    );

    cardRefs.current.forEach((card) => {
      if (card) observerRef.current?.observe(card);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleInteraction = () => {
    setIsInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 2000);
  };

  const scrollToCard = (index: number) => {
    handleInteraction();
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <section className="relative gradient-hero">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center max-w-3xl mx-auto mb-8 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Searching Smarter Starts Here</h2>
          <p className="text-xl text-muted-foreground">
            Endless scrolling, vague job descriptions and slow responses. Meeveem AI removes the guesswork and makes
            finding the right role fast, fair and personal.
          </p>
        </div>

        <div
          ref={containerRef}
          className="h-[80vh] md:h-[90vh] overflow-y-auto snap-y snap-mandatory scroll-smooth"
          onScroll={handleInteraction}
          onTouchStart={handleInteraction}
          onWheel={handleInteraction}
        >
          <div className="flex flex-col items-center">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const isActive = activeIndex === index;
              const isWhiteBackground = index % 2 === 0;

              return (
                <div
                  key={benefit.title}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className="snap-center flex items-center justify-center min-h-[80vh] md:min-h-[90vh] w-full py-8"
                  role="region"
                  aria-label={`Card ${index + 1}: ${benefit.title}`}
                >
                  <Card
                    className={`w-full max-w-[720px] px-6 sm:px-7 py-10 sm:py-12 rounded-2xl shadow-lg transition-all duration-500 ${
                      isActive ? "opacity-100 translate-y-0" : "opacity-40 translate-y-4"
                    }`}
                    style={{
                      backgroundColor: isWhiteBackground ? "#FFFFFF" : "#F8FAFC",
                      transitionProperty: "opacity, transform",
                      transitionTimingFunction: isActive ? "ease-out" : "ease-in",
                      transitionDuration: isActive ? "450ms" : "300ms",
                    }}
                  >
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div
                        className={`w-11 h-11 rounded-xl gradient-primary flex items-center justify-center transition-all ${
                          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}
                        style={{
                          transitionDelay: isActive ? "0ms" : "0ms",
                          transitionDuration: isActive ? "450ms" : "300ms",
                          transitionTimingFunction: isActive ? "ease-out" : "ease-in",
                        }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <h3
                        className={`text-[21px] sm:text-[22px] font-bold leading-snug transition-all ${
                          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}
                        style={{
                          color: "#1E293B",
                          transitionDelay: isActive ? "60ms" : "0ms",
                          transitionDuration: isActive ? "450ms" : "300ms",
                          transitionTimingFunction: isActive ? "ease-out" : "ease-in",
                        }}
                      >
                        {benefit.title}
                      </h3>

                      <div
                        className={`transition-all ${
                          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}
                        style={{
                          transitionDelay: isActive ? "120ms" : "0ms",
                          transitionDuration: isActive ? "450ms" : "300ms",
                          transitionTimingFunction: isActive ? "ease-out" : "ease-in",
                        }}
                      >
                        <p className="font-medium text-[17px] sm:text-[18px] mb-2" style={{ color: "#2563EB" }}>
                          {benefit.keyPhrase}
                        </p>
                        <p className="text-[15px] sm:text-[16px] leading-relaxed font-normal" style={{ color: "#475569" }}>
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 mt-6 mb-8">
          {benefits.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              aria-label={`Go to card ${index + 1}`}
              aria-current={activeIndex === index ? "true" : "false"}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "bg-primary scale-125"
                  : "bg-primary/40 hover:bg-primary/60"
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .snap-y {
            scroll-snap-type: y mandatory;
          }
          .snap-center {
            scroll-snap-align: center;
          }
          * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default BenefitsSection;
