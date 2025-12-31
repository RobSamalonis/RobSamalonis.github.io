/**
 * Utility functions for generating favicon HTML tags
 * This supports the modern navigation enhancement favicon system
 */

export interface FaviconHTMLOptions {
  faviconDir?: string;
  includePreload?: boolean;
  includeManifest?: boolean;
}

/**
 * Generate HTML link tags for all favicon formats
 */
export function generateFaviconHTML(options: FaviconHTMLOptions = {}): string {
  const {
    faviconDir = '/favicons',
    includePreload = true,
    includeManifest = true
  } = options;

  const links: string[] = [];

  // Standard favicon formats
  links.push(`<link rel="icon" type="image/x-icon" href="${faviconDir}/favicon.ico">`);
  links.push(`<link rel="icon" type="image/png" sizes="16x16" href="${faviconDir}/favicon-16x16.png">`);
  links.push(`<link rel="icon" type="image/png" sizes="32x32" href="${faviconDir}/favicon-32x32.png">`);
  links.push(`<link rel="icon" type="image/svg+xml" href="${faviconDir}/favicon.svg">`);

  // Apple touch icons
  links.push(`<link rel="apple-touch-icon" href="${faviconDir}/apple-touch-icon.png">`);
  links.push(`<link rel="apple-touch-icon" sizes="180x180" href="${faviconDir}/apple-touch-icon-180x180.png">`);

  // Android chrome icons
  links.push(`<link rel="icon" type="image/png" sizes="192x192" href="${faviconDir}/android-chrome-192x192.png">`);
  links.push(`<link rel="icon" type="image/png" sizes="512x512" href="${faviconDir}/android-chrome-512x512.png">`);

  // Preload critical favicon for performance
  if (includePreload) {
    links.unshift(`<link rel="preload" href="${faviconDir}/favicon.svg" as="image" type="image/svg+xml">`);
  }

  // Web app manifest
  if (includeManifest) {
    links.push(`<link rel="manifest" href="/manifest.json">`);
  }

  return links.join('\n    ');
}

/**
 * Generate meta tags for favicon-related PWA features
 */
export function generateFaviconMetaTags(options: { themeColor?: string; tileColor?: string } = {}): string {
  const { themeColor = '#000000', tileColor = '#000000' } = options;

  const metaTags: string[] = [];

  // Theme colors
  metaTags.push(`<meta name="theme-color" content="${themeColor}">`);
  metaTags.push(`<meta name="msapplication-TileColor" content="${tileColor}">`);

  // Apple-specific meta tags
  metaTags.push(`<meta name="apple-mobile-web-app-capable" content="yes">`);
  metaTags.push(`<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`);
  metaTags.push(`<meta name="apple-mobile-web-app-title" content="Portfolio">`);

  // Microsoft-specific meta tags
  metaTags.push(`<meta name="msapplication-config" content="/browserconfig.xml">`);

  return metaTags.join('\n    ');
}

/**
 * Validate that all required favicon files exist
 */
export async function validateFaviconFiles(faviconDir: string = 'public/favicons'): Promise<boolean> {
  const requiredFiles = [
    'favicon.ico',
    'favicon.svg',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'apple-touch-icon.png',
    'apple-touch-icon-180x180.png',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png'
  ];

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');

    for (const file of requiredFiles) {
      const filePath = path.resolve(faviconDir, file);
      await fs.access(filePath);
    }

    return true;
  } catch (error) {
    console.error('Missing favicon files:', error);
    return false;
  }
}

/**
 * Get favicon file sizes for performance monitoring
 */
export async function getFaviconSizes(faviconDir: string = 'public/favicons'): Promise<Record<string, number>> {
  const sizes: Record<string, number> = {};

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');

    const files = await fs.readdir(faviconDir);
    const faviconFiles = files.filter(file => 
      file.endsWith('.png') || file.endsWith('.ico') || file.endsWith('.svg')
    );

    for (const file of faviconFiles) {
      const filePath = path.resolve(faviconDir, file);
      const stats = await fs.stat(filePath);
      sizes[file] = stats.size;
    }

    return sizes;
  } catch (error) {
    console.error('Error getting favicon sizes:', error);
    return {};
  }
}