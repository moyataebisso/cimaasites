export function WajiiJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Wajii Websites",
    url: "https://wajiiwebsites.com",
    email: "arsitechgroup@gmail.com",
    description:
      "Done-for-you custom websites for restaurants, home care agencies, and small businesses in Minnesota. We build, host, and manage everything.",
    priceRange: "$$",
    areaServed: [
      { "@type": "City", name: "Minneapolis" },
      { "@type": "State", name: "Minnesota" },
    ],
    serviceType: [
      "Web Design",
      "Web Development",
      "Website Management",
      "Local SEO",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Minneapolis",
      addressRegion: "MN",
      addressCountry: "US",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "Arsi Technology Group LLC",
      url: "https://arsitechgroup.com",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
