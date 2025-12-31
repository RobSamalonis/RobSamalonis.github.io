import { useEffect } from 'react';
import { updateMetaTags, SEOConfig, defaultSEOConfig } from '../utils/seo';

/**
 * Custom hook for managing SEO meta tags
 */
export const useSEO = (config?: Partial<SEOConfig>): void => {
  useEffect(() => {
    const seoConfig = { ...defaultSEOConfig, ...config };
    updateMetaTags(seoConfig);
  }, [config]);
};

/**
 * Hook for updating page title
 */
export const usePageTitle = (title: string): void => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};