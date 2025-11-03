import { Upload, Brain, Target, CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import StepsCarousel from "./StepsCarousel";

const steps = [
  {
    number: "1",
    icon: Upload,
    title: "Upload your CV",
    description: "Quick and easy - just drag and drop your CV to get started",
  },
  {
    number: "2",
    icon: Brain,
    title: "Get your smart profile and dashboard",
    description: "AI instantly creates your profile highlighting your unique strengths and skills",
  },
  {
    number: "3",
    icon: Target,
    title: "See your matches",
    description: "Browse hyper-relevant roles matched to your experience and career goals",
  },
];

const HowItWorksSection = () => {
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = stepRefs.current.map((step, index) => {
      if (!step) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleSteps((prev) => new Set(prev).add(index));
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: "0px",
        },
      );

      observer.observe(step);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <section
      id="how-it-works"
      className="pt-0 pb-24 bg-white relative z-0 overflow-hidden"
    >
      {/* Decorative blob */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Here's how it works</h2>
          <p className="text-xl text-muted-foreground">
            Meeveem instantly powers up your search, matching you with hyper relevant roles and companies that fit you.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Steps Column */}
            <div className="space-y-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isVisible = visibleSteps.has(index);
                return (
                  <div
                    key={step.number}
                    ref={(el) => (stepRefs.current[index] = el)}
                    className={`flex items-start gap-6 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[15px]"
                    }`}
                    style={{
                      transition:
                        "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                      transitionDelay: isVisible ? `${index * 0.2}s` : "0s",
                    }}
                  >
                    {/* Number Badge */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                      <span className="text-xl font-bold text-white">{step.number}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carousel Column */}
            <div className="lg:sticky lg:top-24">
              <StepsCarousel />
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mt-16 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>No spam, unsubscribe anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>Always 100% free</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
