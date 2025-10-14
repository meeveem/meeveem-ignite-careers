import { Card } from "@/components/ui/card";
import { Cpu, Search, Award, Scale, Eye, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const benefits = [
  {
    icon: Cpu,
    title: "Stop wasting hours on irrelevant jobs",
    description: "Our AI analyses your CV in seconds and finds HealthTech roles tailored to your strengths and experience.",
  },
  {
    icon: Search,
    title: "Find roles you never knew existed",
    description: "Meeveem understands what makes you stand out and finds HealthTech roles that match you skills, opening door you hadn't considered.",
  },
  {
    icon: Award,
    title: "Stand out for what really matters",
    description: "Tired of being overlooked because of titles or keywords? Our AI highlights your true strengths so employers see your potential, not just your past roles.",
  },
  {
    icon: Scale,
    title: "Fair matches. Zero bias",
    description: "No background filters of keyword traps. Meeveem AI matches based on your skills and ability, giving everyone a fair chance to be seen.",
  },
  {
    icon: Eye,
    title: "Know the company before you apply",
    description: "We show you what it's really like inside each company, so you can choose where you'll fit best.",
  },
  {
    icon: Shield,
    title: "Take control of your job search",
    description: "You decide who sees your profile and when to apply. No spam, just roles that fit you.",
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
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Job Searching Is Broken. Meeveem Fixes It</h2>
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
