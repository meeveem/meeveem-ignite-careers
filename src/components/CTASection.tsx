import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import EarlyAccessDialog from "./EarlyAccessDialog";

const CTASection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

      {/* Animated background elements */}
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Ready to launch your career in HealthTech?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Join the first 1000 members and get exclusive early access to Meeveem.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center animate-scale-in mt-8" style={{ animationDelay: "0.2s" }}>
            <Button 
              variant="hero" 
              size="xl" 
              className="text-lg px-12 py-8" 
              onClick={() => setDialogOpen(true)}
            >
              Get Early Access
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <EarlyAccessDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  );
};

export default CTASection;
