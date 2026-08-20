import { SITE, SUBURBS, type PageDef } from "@/lib/site";

/**
 * Structured data.
 *
 * MedicalBusiness rather than plain LocalBusiness, because that is what this is, and the
 * areaServed list is what tells Google this is a mobile service covering named suburbs
 * rather than a shopfront in one of them.
 *
 * Everything here is true. No aggregateRating, because there are no reviews to aggregate,
 * and inventing one is both dishonest and against Google's guidelines.
 */
export function BusinessSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    medicalSpecialty: "Pododiatry",
    priceRange: "$$",
    currenciesAccepted: "AUD",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.baseSuburb,
      addressRegion: SITE.state,
      postalCode: SITE.postcode,
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.latitude,
      longitude: SITE.longitude,
    },
    // The whole point of a mobile practice: the service area IS the business.
    areaServed: SUBURBS.map((s) => ({
      "@type": "City",
      name: s.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: s.name,
        postalCode: s.postcode,
        addressRegion: s.slug === "coolangatta" ? "QLD" : "NSW",
        addressCountry: "AU",
      },
    })),
    provider: {
      "@type": "Person",
      name: SITE.practitioner,
      jobTitle: "Podiatrist",
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "AHPRA registration",
        identifier: SITE.ahpra,
      },
    },
    availableService: {
      "@type": "MedicalTherapy",
      name: "Home visit podiatry",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** FAQPage markup, built from the same questions rendered on the page — never from a
 *  separate list, or the two drift and the markup starts describing content that is not
 *  there, which is a manual action waiting to happen. */
export function FaqSchema({ faqs }: { faqs: PageDef["faqs"] }) {
  if (!faqs.length) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbSchema({
  trail,
}: {
  trail: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE.url}${t.url}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
