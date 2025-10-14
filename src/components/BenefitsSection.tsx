import { Card } from "@/components/ui/card";
import { Cpu, Search, Award, Scale, Eye, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const benefits = [
  {
    icon: Cpu,
    title: "Instant CV Analysis",
    description: "Upload your CV and see your best-fit roles instantly.",
  },
  {
    icon: Search,
    title: "Discover roles you didn't know existed",
    description: "Find hidden HealthTech roles that match your skills automatically.",
  },
  {
    icon: Award,
    title: "Show your real strengths",
    description: "We highlight what you're best at, so employers see your true potential.",
  },
  {
    icon: Scale,
    title: "Fair, bias-free matching",
    description: "AI matching focused on skills, not background or keywords.",
  },
  {
    icon: Eye,
    title: "See inside every company",
    description: "Get insights on culture, teams, and real day to day work before applying.",
  },
  {
    icon: Shield,
    title: "You're always in control",
    description: "You decide who sees your profile and when to apply.",
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
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Why Job Searching is Broken, and how Meeveem Fixes It</h2>
          <p className="text-xl text-muted-foreground">
            Endless scrolling, vague job descriptions and slow responses. Meeveem AI removes the guesswork and makes
            finding the right role fast, fair and personal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isVisible = visibleCards.has(index);
            return (
              <Card
                key={benefit.title}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20 bg-card/50 backdrop-blur-sm ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
                  transitionDelay: isVisible ? `${index * 0.15}s` : "0s",
                }}
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-6 shadow-glow">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
