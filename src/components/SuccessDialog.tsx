import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SuccessDialog = ({ open, onOpenChange }: SuccessDialogProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (open) {
      setShowAnimation(true);
    } else {
      setShowAnimation(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] w-[92vw] max-h-[90vh] overflow-auto text-center relative">{" "}
        {/* Glow effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, hsl(207 100% 85% / 0.25) 0%, transparent 70%)',
            transform: showAnimation ? 'scale(1.5)' : 'scale(0.9)',
            opacity: showAnimation ? 0 : 0.25,
            transition: 'transform 0.8s ease-out 0.6s, opacity 0.8s ease-out 0.6s',
          }}
        />
        
        <div className="relative z-10 py-6">
          {/* Animated checkmark */}
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20">
              {/* Circle */}
              <svg 
                className={`w-20 h-20 ${showAnimation ? 'animate-draw-circle' : ''}`}
                viewBox="0 0 80 80"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="hsl(211 100% 50%)"
                  strokeWidth="3"
                  strokeDasharray="226"
                  strokeDashoffset={showAnimation ? "0" : "226"}
                  style={{
                    transition: 'stroke-dashoffset 0.6s ease-out',
                  }}
                />
              </svg>
              
              {/* Checkmark */}
              <svg 
                className={`absolute inset-0 w-20 h-20 ${showAnimation ? 'animate-draw-check' : ''}`}
                viewBox="0 0 80 80"
              >
                <path
                  d="M 25 40 L 35 50 L 55 30"
                  fill="none"
                  stroke="hsl(211 100% 50%)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="50"
                  strokeDashoffset={showAnimation ? "0" : "50"}
                  style={{
                    transition: 'stroke-dashoffset 0.4s ease-out 0.6s',
                  }}
                />
              </svg>
            </div>
          </div>

          <DialogHeader>
            <DialogTitle className="text-3xl font-bold mb-3">
              You're in!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-base mb-4 px-4">
              Thanks for joining Meeveem. You'll be among the first to access smarter AI job matching and exclusive HealthTech roles when we launch.
            </DialogDescription>
          </DialogHeader>

          {/* Bottom text */}
          <p className="text-primary font-semibold text-base">
            Watch your inbox for updates.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
