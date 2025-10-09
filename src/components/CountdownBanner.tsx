import { useEffect, useState } from "react";
import { Rocket, X } from "lucide-react";

const CountdownBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);

    const updateCountdown = () => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const spotsLeft = 342;
  const totalSpots = 1000;
  const progress = ((totalSpots - spotsLeft) / totalSpots) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-white py-3 px-6">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Rocket className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">
            Meeveem launches soon — join the first 1000 for early access.
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold whitespace-nowrap">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
            </span>
            <div className="w-32 h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium whitespace-nowrap">
              {spotsLeft} spots left
            </span>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="hover:bg-white/20 rounded p-1 transition-colors"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountdownBanner;
