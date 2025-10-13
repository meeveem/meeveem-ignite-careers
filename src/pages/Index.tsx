import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CompanyLogoBanner from "@/components/CompanyLogoBanner";
import BenefitsSection from "@/components/BenefitsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import StayInLoopSection from "@/components/StayInLoopSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <CompanyLogoBanner />
        <BenefitsSection />
        <HowItWorksSection />
        <StayInLoopSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
