const CompanyLogoBanner = () => {
  const companies = [
    "FloHealth",
    "Thriva",
    "Babylon Health",
    "Cara Care",
    "DoctorLink",
    "HealX",
    "Aider Healthcare",
    "Exscientia"
  ];

  // Duplicate the array for seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="py-12 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-6 mb-6">
        <p className="text-center text-sm text-muted-foreground font-medium">
          Trusted by professionals at leading HealthTech companies
        </p>
      </div>
      
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted/30 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted/30 to-transparent z-10" />
        
        {/* Scrolling container */}
        <div className="flex animate-scroll">
          {duplicatedCompanies.map((company, index) => (
            <div
              key={`${company}-${index}`}
              className="flex-shrink-0 mx-8 px-6 py-4 bg-card rounded-lg border border-border/50 hover:border-primary/30 transition-colors duration-300"
            >
              <span className="text-lg font-semibold text-foreground/80 whitespace-nowrap">
                {company}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyLogoBanner;
