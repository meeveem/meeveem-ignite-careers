import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  images: string[];
  autoPlayInterval?: number;
  pauseDuration?: number;
}

const HeroCarousel = ({ 
  images, 
  autoPlayInterval = 3000,
  pauseDuration = 5000 
}: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, autoPlayInterval]);

  // Resume auto-play after pause
  useEffect(() => {
    if (!isPaused) return;

    const timeout = setTimeout(() => {
      setIsPaused(false);
    }, pauseDuration);

    return () => clearTimeout(timeout);
  }, [isPaused, pauseDuration]);

  return (
    <div className="relative w-full h-full group">
      {/* Images */}
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-card/50">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              index === currentIndex ? "opacity-100" : "opacity-0"
            )}
          >
            <img
              src={image}
              alt={`Healthcare technology showcase ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => {
          prevSlide();
          setIsPaused(true);
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background hover:scale-110"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => {
          nextSlide();
          setIsPaused(true);
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background hover:scale-110"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              index === currentIndex
                ? "bg-primary w-8"
                : "bg-background/60 hover:bg-background/80 backdrop-blur-sm"
            )}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
