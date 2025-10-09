const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold">Meeveem</span>
          </div>
          <p className="text-background/70 text-sm max-w-2xl">
            Building the bridge between talented professionals and innovative HealthTech companies.
          </p>
          <div className="pt-4 text-sm text-background/70">
            <p>&copy; 2025 Meeveem. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
