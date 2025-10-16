import { Card } from "@/components/ui/card";
import { Hourglass, Search, Eye, Scale, Building2, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const benefits = [
  {
    icon: Hourglass,
    title: "Wasted hours on irrelevant jobs?",
    description: "Stop scrolling endlessly. We match you with roles that actually fit, fast.",
    iconColor: "bg-blue-500",
  },
  {
    icon: Search,
    title: "Missing the roles meant for you?",
    description: "Don't miss out again. Discover real openings matched to your strengths.",
    iconColor: "bg-indigo-500",
  },
  {
    icon: Eye,
    title: "Feeling invisible in the job market?",
    description: "Be seen for your potential. We help employers look beyond your job titles.",
    iconColor: "bg-blue-500",
  },
  {
    icon: Scale,
    title: "Tired of unfair filters?",
    description: "No buzzwords. No bias. Just fair matches based on what you can do.",
    iconColor: "bg-indigo-500",
  },
  {
    icon: Building2,
    title: "Wish you knew more about the company?",
    description: "See behind the job ad. Get a real view of company culture before you apply.",
    iconColor: "bg-blue-500",
  },
  {
    icon: Shield,
    title: "Bombarded with irrelevant jobs?",
    description: "Take control. Get matched only to roles that truly fit you.",
    iconColor: "bg-indigo-500",
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isVisible = visibleCards.has(index);
            const isAlternate = index % 2 === 1;
            return (
              <Card
                key={benefit.title}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`p-7 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20 bg-white backdrop-blur-sm ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
                  transitionDelay: isVisible ? `${index * 0.15}s` : "0s",
                }}
              >
                <div className={`w-12 h-12 rounded-xl ${benefit.iconColor} flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-foreground leading-snug min-h-[3.5rem]">
                  {benefit.title}
                </h3>
                <p className="text-[15px] text-slate-600 leading-relaxed font-normal">
                  {benefit.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
