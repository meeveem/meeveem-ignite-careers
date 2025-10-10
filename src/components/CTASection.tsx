import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import EarlyAccessDialog from "./EarlyAccessDialog";

const CTASection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-primary opacity-95" />

      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-glow-pulse" />
      <div
        className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-glow-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Ready to launch your career in HealthTech?
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Join the first 500 members and get exclusive early access to Meeveem. Start finding your perfect role
              today.
            </p>
          </div>

          {/* Email Signup Form */}
          <div className="max-w-xl mx-auto animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex flex-col sm:flex-row gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white text-foreground border-0 h-14 text-lg focus-visible:ring-white/50"
              />
              <Button variant="secondary" size="xl" className="whitespace-nowrap" onClick={() => setDialogOpen(true)}>
                Get Early Access
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <EarlyAccessDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  );
};

export default CTASection;
