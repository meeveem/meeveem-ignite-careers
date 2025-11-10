import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.webp";
import companiesPreview from "@/assets/companies-preview.webp";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";

const images = [dashboardPreview, companiesPreview];

const StepsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    goToSlide(newIndex);
  };

  return (
    <>
      <div className="relative w-full">
        {/* Image Container */}
        <div 
          className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl bg-card cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToPrevious();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center hover:bg-background transition-all hover:scale-110 z-10"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          goToNext();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center hover:bg-background transition-all hover:scale-110 z-10"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 h-2 bg-primary"
                : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>

    {/* Lightbox Dialog */}
    <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
      <DialogContent
        className="max-w-7xl p-0 bg-black/95 border-none !left-0 !top-0 !translate-x-0 !translate-y-0 !w-screen !h-screen sm:!w-[95vw] sm:!h-[90vh] sm:!left-1/2 sm:!top-1/2 sm:!-translate-x-1/2 sm:!-translate-y-1/2"
      >
        {/* Tap anywhere to close (mobile-friendly) */}
        <button
          type="button"
          aria-label="Close image"
          className="absolute inset-0 block cursor-zoom-out sm:cursor-default"
          onClick={() => setIsLightboxOpen(false)}
        />
        <div className="w-full h-full flex items-center justify-center p-4 sm:p-8">
          <img
            src={images[currentIndex]}
            alt={`Preview ${currentIndex + 1} - Full size`}
            className="max-w-full max-h-full object-contain rounded-lg pointer-events-none"
          />
        </div>

        {/* Bottom, thumb‑reachable Close on small screens; top‑right handled by default close too */}
        <DialogClose asChild>
          <button
            type="button"
            className="absolute left-1/2 -translate-x-1/2 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 rounded-full bg-white/12 text-white backdrop-blur-md px-4 py-3 flex items-center gap-2 hover:bg-white/20 active:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:hidden"
            aria-label="Close image viewer"
          >
            <X className="h-5 w-5" />
            <span className="text-sm font-medium">Close</span>
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default StepsCarousel;
