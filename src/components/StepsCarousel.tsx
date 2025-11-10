import { useState, useEffect, useRef } from "react";
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
  // Lightbox gesture state
  const [lbScale, setLbScale] = useState(1);
  const [lbTx, setLbTx] = useState(0);
  const [lbTy, setLbTy] = useState(0);
  const [lbDragY, setLbDragY] = useState(0);
  const [lbAnimatingBack, setLbAnimatingBack] = useState(false);
  const gestureRef = useRef<HTMLDivElement | null>(null);
  const isPinchingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const pinchStartDistRef = useRef(0);
  const pinchStartScaleRef = useRef(1);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const lastDxRef = useRef(0);
  const lastDyRef = useRef(0);
  const tapMovedRef = useRef(false);

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

  // Reset lightbox transforms whenever it opens/closes or image changes
  useEffect(() => {
    if (isLightboxOpen) {
      setLbScale(1);
      setLbTx(0);
      setLbTy(0);
      setLbDragY(0);
      setLbAnimatingBack(false);
      tapMovedRef.current = false;
      isPinchingRef.current = false;
      isDraggingRef.current = false;
    }
  }, [isLightboxOpen, currentIndex]);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const boundPan = (tx: number, ty: number, scale: number) => {
    const el = gestureRef.current;
    if (!el) return { x: tx, y: ty };
    const w = el.clientWidth;
    const h = el.clientHeight;
    // allow panning up to the extra size introduced by scale
    const maxX = ((scale - 1) * w) / 2;
    const maxY = ((scale - 1) * h) / 2;
    return { x: clamp(tx, -maxX, maxX), y: clamp(ty, -maxY, maxY) };
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      isPinchingRef.current = true;
      isDraggingRef.current = false;
      tapMovedRef.current = true;
      const [t1, t2] = [e.touches[0], e.touches[1]];
      pinchStartDistRef.current = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      pinchStartScaleRef.current = lbScale;
    } else if (e.touches.length === 1) {
      isDraggingRef.current = true;
      isPinchingRef.current = false;
      tapMovedRef.current = false;
      const t = e.touches[0];
      startXRef.current = t.clientX;
      startYRef.current = t.clientY;
      lastDxRef.current = 0;
      lastDyRef.current = 0;
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isPinchingRef.current && e.touches.length === 2) {
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const rawScale = (dist / pinchStartDistRef.current) * pinchStartScaleRef.current;
      const nextScale = clamp(rawScale, 1, 3);
      setLbScale(nextScale);
      // When pinching, stop any swipe-to-close effect
      setLbDragY(0);
    } else if (isDraggingRef.current && e.touches.length === 1) {
      const t = e.touches[0];
      const dx = t.clientX - startXRef.current;
      const dy = t.clientY - startYRef.current;
      if (Math.hypot(dx, dy) > 6) tapMovedRef.current = true;
      if (lbScale <= 1.02) {
        // treat as swipe to close gesture (vertical)
        setLbDragY(dy);
      } else {
        const nextTx = lastDxRef.current + dx;
        const nextTy = lastDyRef.current + dy;
        const bounded = boundPan(nextTx, nextTy, lbScale);
        setLbTx(bounded.x);
        setLbTy(bounded.y);
      }
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (isPinchingRef.current && e.touches.length < 2) {
      isPinchingRef.current = false;
    }
    if (isDraggingRef.current && e.touches.length === 0) {
      // finalize pan baseline
      lastDxRef.current = lbTx;
      lastDyRef.current = lbTy;
      // swipe to close if near 1x and sufficient vertical movement
      const absY = Math.abs(lbDragY);
      if (lbScale <= 1.02 && absY > 90 && absY > Math.abs(lastDxRef.current)) {
        setIsLightboxOpen(false);
        return;
      }
      if (lbScale <= 1.02) {
        // snap back
        setLbAnimatingBack(true);
        setLbDragY(0);
        const id = setTimeout(() => setLbAnimatingBack(false), 180);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (id as any);
      } else {
        // Ensure pan stays bounded on gesture end
        const bounded = boundPan(lbTx, lbTy, lbScale);
        setLbTx(bounded.x);
        setLbTy(bounded.y);
      }
      isDraggingRef.current = false;
    }
  };

  const onLightboxClick = () => {
    // Simple tap closes when not zoomed and not dragged
    if (lbScale <= 1.02 && !tapMovedRef.current) setIsLightboxOpen(false);
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
        <div
          ref={gestureRef}
          className="w-full h-full touch-none select-none flex items-center justify-center p-4 sm:p-8"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={onLightboxClick}
          style={{
            // swipe-down feedback when not zoomed
            transform:
              lbScale <= 1.02 && lbDragY !== 0
                ? `translate3d(0, ${lbDragY}px, 0)`
                : undefined,
            transition: lbAnimatingBack ? "transform 180ms ease-out" : undefined,
          }}
        >
          <img
            src={images[currentIndex]}
            alt={`Preview ${currentIndex + 1} - Full size`}
            className="max-w-full max-h-full object-contain rounded-lg"
            style={{ transform: `translate3d(${lbTx}px, ${lbTy}px, 0) scale(${lbScale})` }}
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
