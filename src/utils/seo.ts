/**
 * SEO utility functions for managing meta tags and structured data
 */

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

/**
 * Updates document meta tags dynamically
 */
export const updateMetaTags = (config: SEOConfig): void => {
  const { title, description, keywords, image, url, type = 'website' } = config;

  // Update title
  if (title) {
    document.title = title;
    updateMetaTag('og:title', title);
    updateMetaTag('twitter:title', title);
  }

  // Update description
  if (description) {
    updateMetaTag('description', description);
    updateMetaTag('og:description', description);
    updateMetaTag('twitter:description', description);
  }

  // Update keywords
  if (keywords) {
    updateMetaTag('keywords', keywords);
  }

  // Update image
  if (image) {
    updateMetaTag('og:image', image);
    updateMetaTag('twitter:image', image);
  }

  // Update URL
  if (url) {
    updateMetaTag('og:url', url);
    updateMetaTag('twitter:url', url);
    updateLinkTag('canonical', url);
  }

  // Update type
  updateMetaTag('og:type', type);
};

/**
 * Updates or creates a meta tag
 */
const updateMetaTag = (name: string, content: string): void => {
  const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
  const attribute = isProperty ? 'property' : 'name';
  
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
};

/**
 * Updates or creates a link tag
 */
const updateLinkTag = (rel: string, href: string): void => {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', href);
};

/**
 * Generates structured data for a person/professional profile
 */
export const generatePersonStructuredData = (data: {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  email: string;
  telephone: string;
  sameAs: string[];
  worksFor: string;
  alumniOf: string;
  knowsAbout: string[];
  skills: string[];
}): string => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    jobTitle: data.jobTitle,
    description: data.description,
    url: data.url,
    email: data.email,
    telephone: data.telephone,
    sameAs: data.sameAs,
    worksFor: {
      "@type": "Organization",
      name: data.worksFor
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: data.alumniOf
    },
    knowsAbout: data.knowsAbout,
    hasOccupation: {
      "@type": "Occupation",
      name: data.jobTitle,
      occupationLocation: {
        "@type": "Place",
        name: "United States"
      },
      skills: data.skills
    }
  };

  return JSON.stringify(structuredData, null, 2);
};

/**
 * Injects structured data into the document head
 */
export const injectStructuredData = (structuredData: string): void => {
  // Remove existing structured data script if it exists
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Create and inject new structured data script
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = structuredData;
  document.head.appendChild(script);
};

/**
 * Default SEO configuration for the portfolio
 */
export const defaultSEOConfig: SEOConfig = {
  title: 'Robert Samalonis - Senior Software Engineer | React & TypeScript Expert',
  description: 'Experienced Senior Software Engineer specializing in React, TypeScript, and accessibility. Currently at eMoney Advisor, passionate about creating inclusive, performant web applications with exceptional user experiences.',
  keywords: 'Robert Samalonis, Senior Software Engineer, React Developer, TypeScript, Frontend Developer, Web Accessibility, WCAG, JavaScript, HTML5, CSS3, eMoney Advisor, Portfolio',
  image: 'https://robertsamalonis.github.io/og-image.jpg',
  url: 'https://robertsamalonis.github.io/',
  type: 'website'
};