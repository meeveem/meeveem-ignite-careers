import logoFooter from "@/assets/logo-footer.webp";

const Footer = () => {
  return (
    <footer className="bg-foreground text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center">
            <img src={logoFooter} alt="Meeveem" className="h-8 object-contain" />
          </div>
          <p className="text-white text-sm max-w-2xl">
            Building the bridge between talented professionals and innovative HealthTech companies.
          </p>
          <div className="pt-4 text-sm text-white">
            <p className="text-white">&copy; 2025 Meeveem. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
