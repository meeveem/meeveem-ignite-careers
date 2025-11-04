import { Rocket, Eye, Compass, Wrench } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const StayInLoopSection = () => {
  const [visibleFeatures, setVisibleFeatures] = useState<boolean[]>([false, false, false, false]);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = featureRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleFeatures((prev) => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }
          });
        },
        { threshold: 0.2 },
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  const features = [
    {
      icon: Rocket,
      title: "Get Matched First",
      description: "Join the first wave of candidates to unlock AI-driven matches and stand out to HealthTech employers early",
    },
    {
      icon: Eye,
      title: "Access Exclusive Insights",
      description: "Get early access to industry insights, role trends, and inside information on HealthTech companies before jobs go public.",
    },
    {
      icon: Compass,
      title: "Stay Ahead Of The Curve",
      description: "HealthTech is evolving fast. Join early to stay informed, inspired, and read for new opportunities as soon as they open.",
    },
    {
      icon: Wrench,
      title: "Shape The Platform With Us",
      description: "As an early member, you'll help shape how Meeveem connects talent with HealthTech companies and redefine the future of hiring.",
    },
  ];

  return (
    <section id="join-early" className="py-24 gradient-hero">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">Join Early. Get Matched First.</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Unlock smarter job matching, exclusive updates and first access to roles at launch.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                ref={(el) => (featureRefs.current[index] = el)}
                className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
                style={{
                  opacity: visibleFeatures[index] ? 1 : 0,
                  transform: visibleFeatures[index] ? "translateY(0)" : "translateY(15px)",
                  transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
                  transitionDelay: `${index * 0.18}s`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StayInLoopSection;
