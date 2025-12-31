/**
 * Performance utilities for optimizing the portfolio website
 */

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical fonts
  const fontPreloads: string[] = [
    // Add any custom fonts here when they're added
  ];

  fontPreloads.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Preload critical images (profile photo)
  preloadProfilePhoto();
};

// Preload profile photo for better performance
export const preloadProfilePhoto = () => {
  // Import the profile photo dynamically for preloading
  import('../assets/profile-photo.jpg')
    .then((module) => {
      const profilePhotoUrl = module.default;
      if (profilePhotoUrl) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = profilePhotoUrl;
        link.as = 'image';
        link.type = 'image/jpeg';
        document.head.appendChild(link);
      }
    })
    .catch(() => {
      // Profile photo not found - this is expected until user adds their photo
      console.debug('Profile photo not found for preloading - this is expected until you add your photo');
    });
};

// Lazy load images with intersection observer
export const createImageObserver = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        }
      });
    });

    return imageObserver;
  }
  return null;
};

// Optimize animations for reduced motion preference
export const respectsReducedMotion = (): boolean => {
  // Handle testing environment where window.matchMedia might not be available
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false; // Default to allowing animations in test environment
  }
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Debounce utility for performance-sensitive operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

// Throttle utility for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if ('performance' in window && 'mark' in performance) {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  } else {
    fn();
  }
};

// Monitor image loading performance
export const measureImageLoadTime = (imageName: string, imageElement: HTMLImageElement) => {
  if ('performance' in window && 'mark' in performance) {
    const startMark = `${imageName}-load-start`;
    const endMark = `${imageName}-load-end`;
    
    performance.mark(startMark);
    
    const handleLoad = () => {
      performance.mark(endMark);
      performance.measure(`${imageName}-load-time`, startMark, endMark);
      imageElement.removeEventListener('load', handleLoad);
    };
    
    const handleError = () => {
      console.warn(`Failed to load image: ${imageName}`);
      imageElement.removeEventListener('error', handleError);
    };
    
    imageElement.addEventListener('load', handleLoad);
    imageElement.addEventListener('error', handleError);
  }
};

// Critical resource hints
export const addResourceHints = () => {
  // DNS prefetch for external resources
  const dnsPrefetches = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  dnsPrefetches.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });

  // Preconnect to critical origins
  const preconnects = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  preconnects.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Initialize performance optimizations
export const initializePerformanceOptimizations = () => {
  // Add resource hints
  addResourceHints();
  
  // Preload critical resources
  preloadCriticalResources();
  
  // Set up image lazy loading
  const imageObserver = createImageObserver();
  if (imageObserver) {
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};