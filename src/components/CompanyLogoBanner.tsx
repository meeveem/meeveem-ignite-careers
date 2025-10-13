import floLogo from "@/assets/company-logos/flo.png";
import thrivaLogo from "@/assets/company-logos/thriva.jpg";
import babylonLogo from "@/assets/company-logos/babylon.webp";
import ceraLogo from "@/assets/company-logos/cera.png";
import doctorlinkLogo from "@/assets/company-logos/doctorlink.webp";
import healxLogo from "@/assets/company-logos/healx.png";
import exscientiaLogo from "@/assets/company-logos/exscientia.png";

const companies = [
  { name: "Flo Health", logo: floLogo },
  { name: "Thriva", logo: thrivaLogo },
  { name: "Babylon Health", logo: babylonLogo },
  { name: "Cera Care", logo: ceraLogo },
  { name: "DoctorLink", logo: doctorlinkLogo },
  { name: "HealX", logo: healxLogo },
  { name: "Exscientia", logo: exscientiaLogo },
];

const CompanyLogoBanner = () => {
  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-8">The HealthTech companies shaping tomorrow</p>
        <div className="relative">
          <div className="flex animate-scroll">
            {/* First set of logos */}
            {companies.map((company, index) => (
              <div key={`first-${index}`} className="flex-shrink-0 mx-8 flex items-center justify-center h-12">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-full w-auto object-contain transition-all duration-300 opacity-80 hover:opacity-100"
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {companies.map((company, index) => (
              <div key={`second-${index}`} className="flex-shrink-0 mx-8 flex items-center justify-center h-12">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-full w-auto object-contain transition-all duration-300 opacity-80 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyLogoBanner;
