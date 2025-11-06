import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CompanyLogoBanner from "@/components/CompanyLogoBanner";
import SearchingSmarter from "@/components/SearchingSmarter";
import HowItWorksSection from "@/components/HowItWorksSection";
import StayInLoopSection from "@/components/StayInLoopSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const supportsScrollBehavior = "scrollBehavior" in document.documentElement.style;
    let hasPerformedSmoothScroll = false;

    const scrollToHash = (hash: string | null, updateUrl = false) => {
      if (!hash) return;
      const target = document.querySelector(hash);
      if (!target) return;

      const shouldSmooth = !prefersReducedMotion.matches && !hasPerformedSmoothScroll;
      const behavior: ScrollBehavior = shouldSmooth && supportsScrollBehavior ? "smooth" : "auto";

      const scroll = () => {
        const top = target.getBoundingClientRect().top + window.scrollY;
        if (supportsScrollBehavior) {
          target.scrollIntoView({ behavior, block: "start" });
        } else if (shouldSmooth && "scrollTo" in window) {
          window.scrollTo({ top, behavior: "smooth" } as ScrollToOptions);
        } else {
          window.scrollTo(0, top);
        }
      };

      if (updateUrl && window.location.hash !== hash) {
        history.pushState(null, "", hash);
      }

      requestAnimationFrame(scroll);

      if (shouldSmooth) {
        hasPerformedSmoothScroll = true;
      }
    };

    const handleHashNavigation = () => {
      scrollToHash(window.location.hash);
    };

    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      if (hash !== "#searching-smarter") return;

      event.preventDefault();
      scrollToHash(hash, true);
    };

    const handleMotionPreferenceChange = () => {
      if (prefersReducedMotion.matches) {
        hasPerformedSmoothScroll = true;
      } else {
        hasPerformedSmoothScroll = false;
      }
    };

    handleHashNavigation();
    window.addEventListener("hashchange", handleHashNavigation);
    document.addEventListener("click", handleAnchorClick, true);
    if (prefersReducedMotion.addEventListener) {
      prefersReducedMotion.addEventListener("change", handleMotionPreferenceChange);
    } else {
      prefersReducedMotion.addListener(handleMotionPreferenceChange);
    }

    return () => {
      window.removeEventListener("hashchange", handleHashNavigation);
      document.removeEventListener("click", handleAnchorClick, true);
      if (prefersReducedMotion.removeEventListener) {
        prefersReducedMotion.removeEventListener("change", handleMotionPreferenceChange);
      } else {
        prefersReducedMotion.removeListener(handleMotionPreferenceChange);
      }
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <CompanyLogoBanner />
        <SearchingSmarter />
        <HowItWorksSection />
        <StayInLoopSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
