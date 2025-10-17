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
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = cardRefs.current.map((card, index) => {
      if (!card) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => new Set(prev).add(index));
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: "0px",
        },
      );

      observer.observe(card);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  const firstRow = benefits.slice(0, 3);
  const secondRow = benefits.slice(3, 6);

  return (
    <section className="py-24 gradient-hero">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Searching Smarter Starts Here</h2>
          <p className="text-xl text-muted-foreground">
            Endless scrolling, vague job descriptions and slow responses. Meeveem AI removes the guesswork and makes
            finding the right role fast, fair and personal.
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-14">
          {/* First Row - White Background */}
          <div className="grid md:grid-cols-3 gap-8">
            {firstRow.map((benefit, index) => {
              const Icon = benefit.icon;
              const isVisible = visibleCards.has(index);
              return (
                <Card
                  key={benefit.title}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className={`py-8 px-7 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20 bg-white backdrop-blur-sm h-full ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
                    transitionDelay: isVisible ? `${index * 0.15}s` : "0s",
                  }}
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-[21px] font-bold mb-4 leading-snug" style={{ color: "#1E293B" }}>
                    {benefit.title}
                  </h3>
                  <p className="font-medium text-[17px] mb-2" style={{ color: "#2563EB" }}>
                    {benefit.keyPhrase}
                  </p>
                  <p className="text-[16px] leading-relaxed font-normal" style={{ color: "#475569" }}>
                    {benefit.description}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Second Row - Pale Blue Background, Staggered Up */}
          <div className="grid md:grid-cols-3 gap-8 -mt-5">
            {secondRow.map((benefit, index) => {
              const Icon = benefit.icon;
              const actualIndex = index + 3;
              const isVisible = visibleCards.has(actualIndex);
              return (
                <Card
                  key={benefit.title}
                  ref={(el) => (cardRefs.current[actualIndex] = el)}
                  className={`py-8 px-7 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20 backdrop-blur-sm h-full ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    backgroundColor: "#F8FAFC",
                    transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
                    transitionDelay: isVisible ? `${actualIndex * 0.15}s` : "0s",
                  }}
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-[21px] font-bold mb-4 leading-snug" style={{ color: "#1E293B" }}>
                    {benefit.title}
                  </h3>
                  <p className="font-medium text-[17px] mb-2" style={{ color: "#2563EB" }}>
                    {benefit.keyPhrase}
                  </p>
                  <p className="text-[16px] leading-relaxed font-normal" style={{ color: "#475569" }}>
                    {benefit.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
