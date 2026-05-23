/**
 * BIBAZ — JSON-LD Structured Data Components
 * SOP §৭ — SEO (Organization, BreadcrumbList, Product schemas)
 */

import { BUSINESS } from "@/lib/constants";

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BIBAZ",
    url: "https://moccasin-bat-178323.hostingersite.com",
    logo: "https://moccasin-bat-178323.hostingersite.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: BUSINESS.PHONE,
      contactType: "customer service",
      areaServed: "BD",
      availableLanguage: ["English", "Bengali"],
    },
    sameAs: [BUSINESS.FACEBOOK, BUSINESS.INSTAGRAM],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Road 10, House 60, Block D, 1st Floor, Nest Mega Mall",
      addressLocality: "Banani, Dhaka",
      postalCode: "1216",
      addressCountry: "BD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BIBAZ",
    url: "https://moccasin-bat-178323.hostingersite.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://moccasin-bat-178323.hostingersite.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url?: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://moccasin-bat-178323.hostingersite.com",
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        ...(item.url && {
          item: `https://moccasin-bat-178323.hostingersite.com${item.url}`,
        }),
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
