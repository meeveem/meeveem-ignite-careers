import { useEffect, useState } from "react";

interface SuccessOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SuccessOverlay = ({ open, onOpenChange }: SuccessOverlayProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (open) setShowAnimation(true);
    else setShowAnimation(false);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Signup success"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      onClick={() => onOpenChange(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Card */}
      <div
        className="relative z-[1001] w-[92vw] sm:max-w-[480px] bg-card border rounded-lg text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, hsl(207 100% 85% / 0.25) 0%, transparent 70%)",
            transform: showAnimation ? "scale(1.5)" : "scale(0.9)",
            opacity: showAnimation ? 0 : 0.25,
            transition: "transform 0.8s ease-out 0.6s, opacity 0.8s ease-out 0.6s",
          }}
        />

        <div className="relative z-10 py-6">
          {/* Animated checkmark */}
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20">
              {/* Circle */}
              <svg className="w-20 h-20" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="hsl(211 100% 50%)"
                  strokeWidth="3"
                  strokeDasharray="226"
                  strokeDashoffset={showAnimation ? 0 : 226}
                  style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
                />
              </svg>

              {/* Checkmark */}
              <svg className="absolute inset-0 w-20 h-20" viewBox="0 0 80 80">
                <path
                  d="M 25 40 L 35 50 L 55 30"
                  fill="none"
                  stroke="hsl(211 100% 50%)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="50"
                  strokeDashoffset={showAnimation ? 0 : 50}
                  style={{ transition: "stroke-dashoffset 0.4s ease-out 0.6s" }}
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-3">You're in!</h2>
          <p className="text-muted-foreground text-base mb-4 px-4">
            Thanks for joining Meeveem. You'll be among the first to access smarter AI job matching and exclusive HealthTech roles when we launch.
          </p>
          <p className="text-primary font-semibold text-base">Watch your inbox for updates.</p>

          <div className="px-6 pb-6 pt-4">
            <button
              type="button"
              className="w-full h-10 rounded-md bg-primary text-primary-foreground font-semibold"
              onClick={() => onOpenChange(false)}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessOverlay;
