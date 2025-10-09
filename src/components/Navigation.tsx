import { Button } from "@/components/ui/button";
import CountdownBanner from "./CountdownBanner";

const Navigation = () => {
  return (
    <>
      <CountdownBanner />
      <nav className="fixed top-12 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-foreground">Meeveem</span>
            </div>
            
            <Button variant="gradient" size="lg">
              Get Early Access
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
