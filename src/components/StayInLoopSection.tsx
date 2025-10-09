import { Heart, Brain, Users, TrendingUp } from "lucide-react";

const StayInLoopSection = () => {
  const features = [
    {
      icon: Heart,
      title: "Built for Careers in HealthTech",
      description: "We're built for people ready to shape the future of HealthTech."
    },
    {
      icon: Brain,
      title: "Smarter Matches with AI",
      description: "No more endless searching. We connect you with roles that just make sense."
    },
    {
      icon: Users,
      title: "Many Skills, One Mission",
      description: "Sales, Tech, Marketing, Legal, every skill has a place in HealthTech."
    },
    {
      icon: TrendingUp,
      title: "Stay Ahead",
      description: "Stay ahead, stay inspired and never miss what's next."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Stay In The Loop
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Because your skills deserve a platform built for the future of HealthTech
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
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
