import { useState } from "react";
import { Button } from "@/components/ui/button";
import CountdownTimer from "./CountdownTimer";
import heroImage from "@/assets/hero-candidate.webp";
import { Sparkles, CheckCircle2 } from "lucide-react";
import EarlyAccessDialog from "./EarlyAccessDialog";

const HeroSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <section className="relative pt-28 md:pt-32 pb-16 overflow-hidden">
      {/* Diagonal Gradient Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#F4FAFF] via-[#E8F4FF] to-[#E2F1FF]"
        style={{
          background: 'linear-gradient(135deg, #F4FAFF 0%, #E8F4FF 50%, #E2F1FF 100%)'
        }}
      />
      
      {/* AI Network Lines - Bottom Right */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-10" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 400 400" role="presentation" focusable="false">
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

        <div className="grid items-center max-w-7xl mx-auto
          gap-6 md:gap-8 lg:gap-8 xl:gap-10
          lg:grid-cols-2 lg:[grid-template-columns:1.15fr_1fr]
          xl:[grid-template-columns:1.1fr_1fr]">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-7 lg:space-y-8 motion-safe:animate-slide-up">
            <h1
              className="font-extrabold leading-tight tracking-tight text-balance xl:leading-[1.05]
              text-[clamp(2rem,6.5vw,3.75rem)] md:text-[clamp(2.75rem,5vw,4.25rem)] xl:text-[clamp(3.25rem,3.8vw,4.75rem)] 2xl:text-[4.75rem]
              max-w-none"
            >
              <span className="block md:whitespace-nowrap">
                <span className="text-foreground">Your </span>
                <span className="text-gradient">HealthTech</span>
              </span>
              <span className="block text-foreground md:whitespace-nowrap">journey starts here</span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Built by recruiters. AI precision. Perfect matches.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center md:justify-start pt-3 md:pt-5">
              <Button 
                variant="hero" 
                size="xl" 
                className="animate-scale-in text-lg px-10 md:px-12 py-7 md:py-8
                transition-all duration-200 shadow-lg hover:shadow-primary/40
                hover:translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0" 
                style={{ animationDelay: '0.6s' }}
                onClick={() => setDialogOpen(true)}
              >
                Get Early Access
              </Button>
            </div>
          </div>

          {/* Right Image and Features */}
          <div className="space-y-8 w-full lg:justify-self-start lg:max-w-[560px] xl:max-w-[620px] 2xl:max-w-[680px]">
            <div className="relative motion-safe:animate-scale-in" style={{ animationDelay: '0.3s' }}>
              {/* Subtle radial glow behind image */}
              <div 
                className="absolute inset-0 rounded-3xl opacity-15 blur-3xl"
                style={{
                  background: 'radial-gradient(circle at center, #AEE0FF 0%, transparent 70%)'
                }}
              />
              
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-card/60">
                <img
                  src={heroImage}
                  alt="Healthcare professional working with technology"
                  className="w-full h-auto object-cover"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  sizes="(min-width: 1536px) 720px, (min-width: 1280px) 640px, (min-width: 1024px) 560px, 100vw"
                />
              </div>
            </div>

            {/* Key Features Grid (hidden on mobile) */}
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              {[
                { title: "Personalised AI Matches", subtitle: "Roles that fit your skills and goals" },
                { title: "Company Insights", subtitle: "Know each company before you apply" },
                { title: "Verified HealthTech Employers", subtitle: "Every company verified to ensure real opportunities" },
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
