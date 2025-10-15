import { useState } from "react";
import { Button } from "@/components/ui/button";
import CountdownTimer from "./CountdownTimer";
import heroImage from "@/assets/hero-candidate.jpg";
import dashboardPreview from "@/assets/dashboard-preview.png";
import { Sparkles, CheckCircle2 } from "lucide-react";
import EarlyAccessDialog from "./EarlyAccessDialog";
import HeroCarousel from "./HeroCarousel";

const HeroSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      {/* Diagonal Gradient Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#F4FAFF] via-[#E8F4FF] to-[#E2F1FF]"
        style={{
          background: 'linear-gradient(135deg, #F4FAFF 0%, #E8F4FF 50%, #E2F1FF 100%)'
        }}
      />
      
      {/* AI Network Lines - Bottom Right */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 400 400">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
            </pattern>
          </defs>
          <rect width="400" height="400" fill="url(#grid)" />
          {/* Connection nodes */}
          <circle cx="80" cy="80" r="4" className="fill-primary" />
          <circle cx="200" cy="150" r="4" className="fill-primary" />
          <circle cx="320" cy="220" r="4" className="fill-primary" />
          <circle cx="150" cy="280" r="4" className="fill-primary" />
          {/* Connection lines */}
          <line x1="80" y1="80" x2="200" y2="150" stroke="currentColor" strokeWidth="1" className="text-primary" opacity="0.3" />
          <line x1="200" y1="150" x2="320" y2="220" stroke="currentColor" strokeWidth="1" className="text-primary" opacity="0.3" />
          <line x1="320" y1="220" x2="150" y2="280" stroke="currentColor" strokeWidth="1" className="text-primary" opacity="0.3" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight">
              <span className="text-foreground">Find your perfect role in HealthTech</span>
              <br />
              <span className="text-primary">powered by AI</span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Our advanced AI matches you with HealthTech roles that truly fit your skills, goals and values.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center pt-6">
              <Button 
                variant="hero" 
                size="xl" 
                className="animate-scale-in text-lg px-12 py-8 animate-pulse shadow-2xl hover:shadow-primary/50" 
                style={{ animationDelay: '0.6s' }}
                onClick={() => setDialogOpen(true)}
              >
                Get Early Access
              </Button>
            </div>
          </div>

          {/* Right Image and Features */}
          <div className="space-y-8">
            <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
              {/* Subtle radial glow behind carousel */}
              <div 
                className="absolute inset-0 rounded-3xl opacity-15 blur-3xl"
                style={{
                  background: 'radial-gradient(circle at center, #AEE0FF 0%, transparent 70%)'
                }}
              />
              
              <div className="relative">
                <HeroCarousel 
                  images={[heroImage, dashboardPreview]}
                  autoPlayInterval={3000}
                  pauseDuration={5000}
                />
              </div>
            </div>

            {/* Key Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "Personalised AI Matches", subtitle: "Roles that fit your skills and goals" },
                { title: "Company Insights", subtitle: "Know each company before you apply" },
                { title: "Verified HealthTech Employers", subtitle: "Let smart matches come to you" },
                { title: "No Endless Searching", subtitle: "Let smart matches come to you" }
              ].map((feature, index) => (
                <div 
                  key={feature.title} 
                  className="flex items-start gap-3 animate-fade-in"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-foreground mb-1">{feature.title}</div>
                    <div className="text-sm text-muted-foreground">{feature.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <EarlyAccessDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  );
};

export default HeroSection;
