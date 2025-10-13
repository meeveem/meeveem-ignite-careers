import { Upload, Brain, Target } from "lucide-react";

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
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Here's how it works
          </h2>
          <p className="text-xl text-muted-foreground">
            Meeveem instantly powers up your search, matching you with hyper relevant roles and companies that fit you.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex flex-col md:flex-row items-center gap-8 animate-slide-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Number Badge */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                    <span className="text-3xl font-bold text-white">{step.number}</span>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-3 text-foreground">{step.title}</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
