import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_CONFIG, buildCanonicalUrl } from "@/lib/seo";

export interface CitationMetadata {
  title?: string;
  authors?: string[];
  publicationDate?: string;
  journalTitle?: string;
  volume?: string;
  issue?: string;
  firstPage?: string;
  lastPage?: string;
  pdfUrl?: string;
  doi?: string;
  issn?: string;
}

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "book" | "profile";
  noindex?: boolean;
  nofollow?: boolean;
  keywords?: string;
  structuredData?: Record<string, any> | Record<string, any>[];
  citation?: CitationMetadata;
}

function setMetaTag(attributeName: "name" | "property", attributeValue: string, content?: string | null) {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
  if (content !== undefined && content !== null && content !== "") {
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attributeName, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  } else if (element) {
    element.remove();
  }
}

export function SEO({
  title,
  description,
  canonical,
  image,
  type = "website",
  noindex = false,
  nofollow = false,
  keywords,
  structuredData,
  citation,
}: SEOProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Format document title
    let fullTitle = SITE_CONFIG.defaultTitle;
    if (title) {
      if (title.includes("ADF") || title.includes("Academic Development Forum") || title.includes("|")) {
        fullTitle = title;
      } else {
        fullTitle = `${title} | ADF`;
      }
    }
    document.title = fullTitle;

    // 2. Canonical URL
    const canonicalUrl = canonical || buildCanonicalUrl(pathname);
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // 3. Meta Description & Keywords
    const metaDesc = description || SITE_CONFIG.defaultDescription;
    setMetaTag("name", "description", metaDesc);
    setMetaTag("name", "title", fullTitle);
    if (keywords) {
      setMetaTag("name", "keywords", keywords);
    } else {
      setMetaTag("name", "keywords", SITE_CONFIG.defaultKeywords);
    }

    // 4. Robots Directives
    let robotsContent = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
    if (noindex) {
      robotsContent = nofollow ? "noindex, nofollow" : "noindex, follow";
    }
    setMetaTag("name", "robots", robotsContent);
    setMetaTag("name", "googlebot", robotsContent);

    // 5. Open Graph Metadata
    const metaImage = image || SITE_CONFIG.defaultImage;
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", metaDesc);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:image", metaImage);
    setMetaTag("property", "og:site_name", SITE_CONFIG.siteName);
    setMetaTag("property", "og:locale", "en_US");

    // 6. Twitter / X Cards
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", metaDesc);
    setMetaTag("name", "twitter:image", metaImage);
    setMetaTag("name", "twitter:url", canonicalUrl);

    // 7. Structured Data (JSON-LD)
    const schemaScriptId = "adf-dynamic-schema";
    let schemaScript = document.getElementById(schemaScriptId) as HTMLScriptElement | null;
    if (structuredData) {
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.id = schemaScriptId;
        schemaScript.type = "application/ld+json";
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(
        Array.isArray(structuredData)
          ? { "@context": "https://schema.org", "@graph": structuredData }
          : { "@context": "https://schema.org", ...structuredData }
      );
    } else if (schemaScript) {
      schemaScript.remove();
    }

    // 8. Google Scholar / Academic Citation Tags
    // First clear existing dynamic citation tags
    document.querySelectorAll('meta[data-scholarly="true"]').forEach((el) => el.remove());

    if (citation) {
      const addCitation = (name: string, val?: string) => {
        if (!val) return;
        const meta = document.createElement("meta");
        meta.setAttribute("name", name);
        meta.setAttribute("content", val);
        meta.setAttribute("data-scholarly", "true");
        document.head.appendChild(meta);
      };

      addCitation("citation_title", citation.title || title);
      if (citation.authors) {
        citation.authors.forEach((author) => addCitation("citation_author", author));
      }
      addCitation("citation_publication_date", citation.publicationDate);
      addCitation("citation_journal_title", citation.journalTitle);
      addCitation("citation_volume", citation.volume);
      addCitation("citation_issue", citation.issue);
      addCitation("citation_firstpage", citation.firstPage);
      addCitation("citation_lastpage", citation.lastPage);
      addCitation("citation_pdf_url", citation.pdfUrl);
      addCitation("citation_doi", citation.doi);
      addCitation("citation_issn", citation.issn);
    }

    return () => {
      // Clean up dynamic citation meta tags when component unmounts
      document.querySelectorAll('meta[data-scholarly="true"]').forEach((el) => el.remove());
      const dynSchema = document.getElementById(schemaScriptId);
      if (dynSchema) dynSchema.remove();
    };
  }, [
    title,
    description,
    canonical,
    image,
    type,
    noindex,
    nofollow,
    keywords,
    pathname,
    structuredData,
    citation,
  ]);

  return null;
}

export default SEO;
