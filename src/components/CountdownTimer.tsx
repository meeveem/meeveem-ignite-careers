import { useEffect, useState } from "react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    // Set launch date (you can adjust this)
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30); // 30 days from now

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
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 items-center justify-center">
      <div className="flex flex-col items-center bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
        <span className="text-2xl font-bold text-primary">{timeLeft.days}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Days</span>
      </div>
      <div className="flex flex-col items-center bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
        <span className="text-2xl font-bold text-primary">{timeLeft.hours}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Hours</span>
      </div>
      <div className="flex flex-col items-center bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
        <span className="text-2xl font-bold text-primary">{timeLeft.minutes}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Min</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
