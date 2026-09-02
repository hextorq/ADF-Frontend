/**
 * Academic Development Forum (ADF) - Comprehensive SEO Configuration & Utilities
 */

export const SITE_CONFIG = {
  siteUrl: (import.meta.env.VITE_SITE_URL || "https://www.adf.ijeae.com").replace(/\/+$/, ""),
  siteName: "Academic Development Forum",
  alternateName: "ADF",
  defaultTitle: "Academic Development Forum (ADF) — International Research, Journals & Book Publications",
  defaultDescription: "Academic Development Forum (ADF) is an international publication house publishing peer-reviewed journals, edited book chapters, literary works, and academic development programmes — open access and globally accessible.",
  defaultKeywords: "Academic Development Forum, ADF, peer-reviewed journals, International Journal of English for Academic Excellence, IJEAE, call for book chapters, literary publications, academic conferences, scholarly publishing, open access journals, research dissemination",
  defaultImage: "https://www.adf.ijeae.com/logo.png",
  googleSiteVerification: import.meta.env.VITE_GOOGLE_SITE_VERIFICATION || "c4bfc8ee12cbb204",
  contactEmail: "contact@adf.org",
  founder: "Dr. Attrait Dovin Fedrick",
  foundingDate: "2025",
  address: {
    streetAddress: "2/2 A West Street, South Amuthunnakudi, Sathankulam (post)",
    addressLocality: "Thoothukudi",
    addressRegion: "Tamil Nadu",
    postalCode: "628704",
    addressCountry: "IN"
  },
  socials: [
    "https://www.youtube.com/@adf_publisher",
    "https://www.linkedin.com/in/academic-development-forum-adf-8a4651418",
    "https://www.instagram.com/adf_publisher",
    "https://whatsapp.com/channel/0029Vb81bKK2v1IytFrFwr3E"
  ]
};

/**
 * Builds an absolute canonical URL with consistent trailing-slash handling.
 */
export function buildCanonicalUrl(path: string = "/"): string {
  const base = SITE_CONFIG.siteUrl;
  if (!path || path === "/" || path === "") {
    return `${base}/`;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // Strip query string and hash for canonical by default
  const pathname = cleanPath.split("?")[0].split("#")[0];
  // Remove trailing slash for subpages
  const normalized = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  return `${base}${normalized}`;
}

/**
 * Builds Schema.org EducationalOrganization structured data.
 */
export function buildOrganizationSchema() {
  return {
    "@type": "EducationalOrganization",
    "@id": `${SITE_CONFIG.siteUrl}/#organization`,
    "name": SITE_CONFIG.siteName,
    "alternateName": SITE_CONFIG.alternateName,
    "url": SITE_CONFIG.siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": SITE_CONFIG.defaultImage,
      "caption": "Academic Development Forum Logo"
    },
    "description": SITE_CONFIG.defaultDescription,
    "email": SITE_CONFIG.contactEmail,
    "foundingDate": SITE_CONFIG.foundingDate,
    "founder": {
      "@type": "Person",
      "name": SITE_CONFIG.founder,
      "jobTitle": "Founder & Publishing Director"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SITE_CONFIG.address.streetAddress,
      "addressLocality": SITE_CONFIG.address.addressLocality,
      "addressRegion": SITE_CONFIG.address.addressRegion,
      "postalCode": SITE_CONFIG.address.postalCode,
      "addressCountry": SITE_CONFIG.address.addressCountry
    },
    "sameAs": SITE_CONFIG.socials
  };
}

/**
 * Builds Schema.org WebSite structured data with SearchAction.
 */
export function buildWebsiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.siteUrl}/#website`,
    "url": SITE_CONFIG.siteUrl,
    "name": SITE_CONFIG.siteName,
    "alternateName": SITE_CONFIG.alternateName,
    "publisher": {
      "@id": `${SITE_CONFIG.siteUrl}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_CONFIG.siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

/**
 * Builds Schema.org Periodical structured data for academic journals.
 */
export function buildJournalSchema(opts?: {
  title?: string;
  abbr?: string;
  issn?: string;
  url?: string;
  description?: string;
}) {
  const title = opts?.title || "International Journal of English for Academic Excellence";
  const abbr = opts?.abbr || "IJEAE";
  const issn = opts?.issn || "Forthcoming";
  const url = opts?.url || "https://ijeae.com/index.php/ijeae";
  const description = opts?.description || "An open-access, double-blind peer-reviewed quarterly academic journal dedicated to applied linguistics, ELT, and scholarly writing.";

  return {
    "@type": "Periodical",
    "@id": `${SITE_CONFIG.siteUrl}/journals#${abbr.toLowerCase()}`,
    "name": title,
    "alternateName": abbr,
    "issn": issn,
    "description": description,
    "url": url,
    "publisher": {
      "@id": `${SITE_CONFIG.siteUrl}/#organization`
    },
    "isAccessibleForFree": true,
    "license": "https://creativecommons.org/licenses/by/4.0/"
  };
}

/**
 * Builds Schema.org BreadcrumbList structured data.
 */
export function buildBreadcrumbSchema(crumbs: { name: string; path?: string }[]) {
  const items: Array<{
    "@type": string;
    position: number;
    name: string;
    item?: string;
  }> = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": `${SITE_CONFIG.siteUrl}/`
    }
  ];

  crumbs.forEach((c, index) => {
    const position = index + 2;
    const itemUrl = c.path ? buildCanonicalUrl(c.path) : undefined;
    items.push({
      "@type": "ListItem",
      position,
      name: c.name,
      ...(itemUrl ? { item: itemUrl } : {})
    });
  });

  return {
    "@type": "BreadcrumbList",
    "itemListElement": items
  };
}

/**
 * Builds Schema.org Book structured data for bookstore items.
 */
export function buildBookSchema(book: {
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  coverImage?: string;
  price?: number;
  publisher?: string;
  publicationDate?: string;
  pages?: number;
}) {
  return {
    "@type": "Book",
    "name": book.title,
    "author": {
      "@type": "Person",
      "name": book.author
    },
    ...(book.isbn ? { "isbn": book.isbn } : {}),
    ...(book.description ? { "description": book.description } : {}),
    ...(book.coverImage ? { "image": book.coverImage } : {}),
    ...(book.publisher ? { "publisher": { "@type": "Organization", "name": book.publisher } } : {}),
    ...(book.publicationDate ? { "datePublished": book.publicationDate } : {}),
    ...(book.pages ? { "numberOfPages": book.pages } : {}),
    "inLanguage": "en",
    ...(book.price ? {
      "offers": {
        "@type": "Offer",
        "price": book.price,
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      }
    } : {})
  };
}

/**
 * Builds Schema.org ScholarlyArticle structured data for chapters or papers.
 */
export function buildArticleSchema(article: {
  title: string;
  authors?: string[];
  description?: string;
  publicationDate?: string;
  journalTitle?: string;
  volume?: string;
  issue?: string;
  doi?: string;
  issn?: string;
  pdfUrl?: string;
  url?: string;
}) {
  return {
    "@type": "ScholarlyArticle",
    "headline": article.title,
    ...(article.description ? { "description": article.description } : {}),
    ...(article.authors && article.authors.length > 0
      ? {
          "author": article.authors.map(name => ({
            "@type": "Person",
            "name": name
          }))
        }
      : {}),
    ...(article.publicationDate ? { "datePublished": article.publicationDate } : {}),
    "publisher": {
      "@id": `${SITE_CONFIG.siteUrl}/#organization`
    },
    ...(article.url ? { "url": article.url } : {}),
    ...(article.doi ? { "identifier": { "@type": "PropertyValue", "propertyID": "DOI", "value": article.doi } } : {}),
    ...(article.journalTitle
      ? {
          "isPartOf": {
            "@type": "Periodical",
            "name": article.journalTitle,
            ...(article.issn ? { "issn": article.issn } : {})
          }
        }
      : {})
  };
}
