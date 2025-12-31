/**
 * Performance utilities for optimizing the portfolio website
 */

// Animation performance monitoring
interface AnimationPerformanceMetrics {
  frameRate: number;
  droppedFrames: number;
  animationDuration: number;
  layoutShifts: number;
}

// Performance-optimized animation utilities
export class AnimationPerformanceMonitor {
  private static instance: AnimationPerformanceMonitor;
  private frameCount = 0;
  private lastTime = 0;
  private droppedFrames = 0;
  private animationStartTime = 0;
  private layoutShiftObserver: PerformanceObserver | null = null;
  private layoutShifts = 0;

  static getInstance(): AnimationPerformanceMonitor {
    if (!AnimationPerformanceMonitor.instance) {
      AnimationPerformanceMonitor.instance = new AnimationPerformanceMonitor();
    }
    return AnimationPerformanceMonitor.instance;
  }

  startMonitoring(): void {
    this.frameCount = 0;
    this.droppedFrames = 0;
    this.layoutShifts = 0;
    this.animationStartTime = performance.now();
    this.lastTime = this.animationStartTime;

    // Monitor layout shifts
    if ('PerformanceObserver' in window) {
      this.layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            this.layoutShifts += (entry as any).value;
          }
        }
      });
      
      try {
        this.layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Layout shift monitoring not supported
        console.debug('Layout shift monitoring not supported');
      }
    }

    this.monitorFrameRate();
  }

  private monitorFrameRate(): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    if (deltaTime > 16.67) { // More than 60fps threshold
      this.droppedFrames++;
    }
    
    this.frameCount++;
    this.lastTime = currentTime;

    if (this.frameCount < 300) { // Monitor for 5 seconds at 60fps
      requestAnimationFrame(() => this.monitorFrameRate());
    }
  }

  getMetrics(): AnimationPerformanceMetrics {
    const duration = performance.now() - this.animationStartTime;
    const frameRate = this.frameCount / (duration / 1000);
    
    return {
      frameRate,
      droppedFrames: this.droppedFrames,
      animationDuration: duration,
      layoutShifts: this.layoutShifts,
    };
  }

  stopMonitoring(): AnimationPerformanceMetrics {
    if (this.layoutShiftObserver) {
      this.layoutShiftObserver.disconnect();
      this.layoutShiftObserver = null;
    }
    
    return this.getMetrics();
  }
}

// Optimized animation configuration based on device capabilities
export const getOptimizedAnimationConfig = () => {
  // Check device capabilities
  const isLowEndDevice = () => {
    // Check for reduced motion preference
    if (respectsReducedMotion()) return true;
    
    // Check hardware concurrency (CPU cores)
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true;
    
    // Check memory (if available)
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8) return true;
    }
    
    // Check connection speed
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
        return true;
      }
    }
    
    return false;
  };

  const lowEnd = isLowEndDevice();
  
  return {
    // Reduce animation complexity on low-end devices
    enableParticles: !lowEnd,
    enableGlow: !lowEnd,
    enableComplexTransforms: !lowEnd,
    
    // Adjust animation timing
    springStiffness: lowEnd ? 200 : 400,
    springDamping: lowEnd ? 30 : 17,
    
    // Reduce animation frequency
    animationFrameRate: lowEnd ? 30 : 60,
    
    // Simplify effects
    particleCount: lowEnd ? 3 : 8,
    blurIntensity: lowEnd ? 5 : 20,
    
    // Performance thresholds
    maxConcurrentAnimations: lowEnd ? 2 : 5,
    frameDropThreshold: lowEnd ? 5 : 10,
  };
};

// Throttled animation frame utility
export const createThrottledAnimationFrame = (fps: number = 60) => {
  const interval = 1000 / fps;
  let lastTime = 0;
  
  return (callback: FrameRequestCallback) => {
    const currentTime = performance.now();
    const elapsed = currentTime - lastTime;
    
    if (elapsed >= interval) {
      lastTime = currentTime;
      return requestAnimationFrame(callback);
    }
    
    return setTimeout(() => requestAnimationFrame(callback), interval - elapsed);
  };
};

// Layout shift prevention utilities
export const preventLayoutShift = {
  // Reserve space for dynamic content
  reserveSpace: (element: HTMLElement, dimensions: { width?: number; height?: number }) => {
    if (dimensions.width) {
      element.style.minWidth = `${dimensions.width}px`;
    }
    if (dimensions.height) {
      element.style.minHeight = `${dimensions.height}px`;
    }
  },

  // Use transform instead of changing layout properties
  animateWithTransform: (element: HTMLElement, properties: { x?: number; y?: number; scale?: number }) => {
    const transforms: string[] = [];
    
    if (properties.x !== undefined || properties.y !== undefined) {
      transforms.push(`translate(${properties.x || 0}px, ${properties.y || 0}px)`);
    }
    
    if (properties.scale !== undefined) {
      transforms.push(`scale(${properties.scale})`);
    }
    
    element.style.transform = transforms.join(' ');
  },

  // Batch DOM reads and writes
  batchDOMOperations: (operations: Array<() => void>) => {
    // Read phase
    const readResults: any[] = [];
    operations.forEach((op, index) => {
      if (index % 2 === 0) { // Even indices are reads
        readResults.push(op());
      }
    });

    // Write phase
    requestAnimationFrame(() => {
      operations.forEach((op, index) => {
        if (index % 2 === 1) { // Odd indices are writes
          op();
        }
      });
    });

    return readResults;
  },
};

// Animation queue for managing concurrent animations
export class AnimationQueue {
  private static instance: AnimationQueue;
  private activeAnimations = new Set<string>();
  private maxConcurrent: number;
  private queue: Array<{ id: string; animation: () => Promise<void> }> = [];

  constructor(maxConcurrent: number = 5) {
    this.maxConcurrent = maxConcurrent;
  }

  static getInstance(maxConcurrent?: number): AnimationQueue {
    if (!AnimationQueue.instance) {
      AnimationQueue.instance = new AnimationQueue(maxConcurrent);
    }
    return AnimationQueue.instance;
  }

  async addAnimation(id: string, animation: () => Promise<void>): Promise<void> {
    if (this.activeAnimations.size >= this.maxConcurrent) {
      // Queue the animation
      return new Promise((resolve) => {
        this.queue.push({
          id,
          animation: async () => {
            await animation();
            resolve();
          }
        });
      });
    }

    // Execute immediately
    this.activeAnimations.add(id);
    
    try {
      await animation();
    } finally {
      this.activeAnimations.delete(id);
      this.processQueue();
    }
  }

  private processQueue(): Promise<void> {
    return new Promise(async (resolve) => {
      if (this.queue.length > 0 && this.activeAnimations.size < this.maxConcurrent) {
        const next = this.queue.shift();
        if (next) {
          this.activeAnimations.add(next.id);
          
          try {
            await next.animation();
          } finally {
            this.activeAnimations.delete(next.id);
            await this.processQueue();
          }
        }
      }
      resolve();
    });
  }

  cancelAnimation(id: string): void {
    this.activeAnimations.delete(id);
    this.queue = this.queue.filter(item => item.id !== id);
  }

  getActiveCount(): number {
    return this.activeAnimations.size;
  }

  getQueuedCount(): number {
    return this.queue.length;
  }
}

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

// Check for high contrast preference
export const prefersHighContrast = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  
  return window.matchMedia('(prefers-contrast: high)').matches;
};

// Enhanced reduced motion handling
export const getReducedMotionConfig = () => {
  const prefersReduced = respectsReducedMotion();
  
  return {
    // Disable complex animations
    enableAnimations: !prefersReduced,
    enableTransitions: true, // Keep simple transitions even with reduced motion
    
    // Reduce animation duration
    durationMultiplier: prefersReduced ? 0.3 : 1,
    
    // Simplify easing
    easing: prefersReduced ? 'linear' : 'easeOut',
    
    // Disable decorative effects
    enableParticles: !prefersReduced,
    enableGlow: !prefersReduced,
    enableMorphing: !prefersReduced,
    
    // Keep essential feedback
    enableHoverFeedback: true,
    enableFocusFeedback: true,
    enableClickFeedback: !prefersReduced,
  };
};

// High contrast configuration
export const getHighContrastConfig = () => {
  const highContrastPreference = prefersHighContrast();
  
  return {
    enableHighContrast: highContrastPreference,
    contrastMultiplier: highContrastPreference ? 1.5 : 1,
    borderWidth: highContrastPreference ? 2 : 1,
    focusOutlineWidth: highContrastPreference ? 4 : 2,
    backgroundOpacity: highContrastPreference ? 0.95 : 0.8,
    shadowIntensity: highContrastPreference ? 0.3 : 0.1,
  };
};

// User preference monitoring
export const createUserPreferenceObserver = (callback: (preferences: {
  reducedMotion: boolean;
  highContrast: boolean;
  darkMode: boolean;
}) => void) => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {}; // Return empty cleanup function
  }

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const updatePreferences = () => {
    callback({
      reducedMotion: reducedMotionQuery.matches,
      highContrast: highContrastQuery.matches,
      darkMode: darkModeQuery.matches,
    });
  };

  // Initial call
  updatePreferences();

  // Add listeners
  reducedMotionQuery.addEventListener('change', updatePreferences);
  highContrastQuery.addEventListener('change', updatePreferences);
  darkModeQuery.addEventListener('change', updatePreferences);

  // Return cleanup function
  return () => {
    reducedMotionQuery.removeEventListener('change', updatePreferences);
    highContrastQuery.removeEventListener('change', updatePreferences);
    darkModeQuery.removeEventListener('change', updatePreferences);
  };
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

  // Initialize animation performance monitoring
  const monitor = AnimationPerformanceMonitor.getInstance();
  
  // Set up animation queue with device-appropriate limits
  const config = getOptimizedAnimationConfig();
  AnimationQueue.getInstance(config.maxConcurrentAnimations);
  
  return {
    monitor,
    config,
    reducedMotionConfig: getReducedMotionConfig(),
  };
};