import { useState } from "react";
import { Button } from "@/components/ui/button";
import EarlyAccessDialog from "./EarlyAccessDialog";
import logoFull from "@/assets/logo-full.webp";

const Navigation = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 md:px-6 py-2.5 md:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={logoFull} alt="Meeveem" className="h-5 md:h-6 object-contain" />
            </div>
            
            <Button 
              variant="gradient" 
              size="lg" 
              className="text-sm md:text-base px-4 md:px-8 h-10 md:h-12"
              onClick={() => setDialogOpen(true)}
            >
              <span className="hidden sm:inline">Get Early Access</span>
              <span className="sm:hidden">Early Access</span>
            </Button>
          </div>
        </div>
      </nav>
      <EarlyAccessDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default Navigation;
