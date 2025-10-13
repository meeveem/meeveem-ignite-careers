import { useState } from "react";
import { Button } from "@/components/ui/button";
import EarlyAccessDialog from "./EarlyAccessDialog";
import logoIcon from "@/assets/logo-icon.png";
import logoFull from "@/assets/logo-full.png";

const Navigation = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoIcon} alt="Meeveem" className="w-8 h-8" />
              <img src={logoFull} alt="Meeveem" className="h-24" />
            </div>
            
            <Button variant="gradient" size="lg" onClick={() => setDialogOpen(true)}>
              Get Early Access
            </Button>
          </div>
        </div>
      </nav>
      <EarlyAccessDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default Navigation;
