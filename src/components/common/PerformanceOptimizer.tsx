import React, { useEffect, useRef } from 'react';
import {
  AnimationPerformanceMonitor,
  createUserPreferenceObserver,
  getOptimizedAnimationConfig,
  AnimationQueue,
} from '../../utils/performance';
import { useUserPreferences } from '../../hooks/useUserPreferences';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

/**
 * Performance optimizer component that monitors performance and adapts
 * to user preferences for accessibility and performance
 */
export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
}) => {
  const preferences = useUserPreferences();
  const cleanupRef = useRef<(() => void) | null>(null);
  const performanceInitialized = useRef(false);
  const monitorRef = useRef<AnimationPerformanceMonitor | null>(null);

  useEffect(() => {
    if (!performanceInitialized.current) {
      // Initialize performance optimizations
      const monitor = AnimationPerformanceMonitor.getInstance();
      monitorRef.current = monitor;

      // Start performance monitoring
      monitor.startMonitoring();

      // Get optimized animation config based on device capabilities
      const config = getOptimizedAnimationConfig();

      // Initialize animation queue with device-appropriate limits
      AnimationQueue.getInstance(config.maxConcurrentAnimations);

      performanceInitialized.current = true;
    }

    // Set up user preference monitoring
    cleanupRef.current = createUserPreferenceObserver((newPreferences) => {
      // Handle preference changes
      if (newPreferences.reducedMotion) {
        // Disable or reduce animations
        document.documentElement.style.setProperty(
          '--animation-duration',
          '0.1s'
        );
        document.documentElement.style.setProperty(
          '--transition-duration',
          '0.1s'
        );
        document.documentElement.style.setProperty('--spring-stiffness', '200');
        document.documentElement.style.setProperty('--spring-damping', '40');
      } else {
        // Restore normal animation durations
        document.documentElement.style.setProperty(
          '--animation-duration',
          '0.3s'
        );
        document.documentElement.style.setProperty(
          '--transition-duration',
          '0.2s'
        );
        document.documentElement.style.setProperty('--spring-stiffness', '400');
        document.documentElement.style.setProperty('--spring-damping', '25');
      }

      if (newPreferences.highContrast) {
        // Enhance contrast
        document.documentElement.style.setProperty(
          '--focus-outline-width',
          '4px'
        );
        document.documentElement.style.setProperty('--border-width', '2px');
        document.documentElement.style.setProperty(
          '--background-opacity',
          '0.95'
        );
        document.documentElement.style.setProperty('--shadow-intensity', '0.3');
      } else {
        // Normal contrast
        document.documentElement.style.setProperty(
          '--focus-outline-width',
          '2px'
        );
        document.documentElement.style.setProperty('--border-width', '1px');
        document.documentElement.style.setProperty(
          '--background-opacity',
          '0.8'
        );
        document.documentElement.style.setProperty('--shadow-intensity', '0.1');
      }

      if (newPreferences.darkMode) {
        document.documentElement.style.setProperty('--color-scheme', 'dark');
      } else {
        document.documentElement.style.setProperty('--color-scheme', 'light');
      }
    });

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  // Handle low performance events
  useEffect(() => {
    const handleLowPerformance = (event: CustomEvent) => {
      console.warn(
        'Low performance detected, reducing visual effects',
        event.detail
      );

      // Reduce visual effects
      document.documentElement.style.setProperty('--blur-intensity', '2px');
      document.documentElement.style.setProperty('--particle-count', '2');
      document.documentElement.style.setProperty(
        '--animation-complexity',
        'reduced'
      );

      // Reduce animation frame rate
      document.documentElement.style.setProperty(
        '--animation-frame-rate',
        '30'
      );
    };

    window.addEventListener(
      'lowPerformance',
      handleLowPerformance as EventListener
    );

    return () => {
      window.removeEventListener(
        'lowPerformance',
        handleLowPerformance as EventListener
      );
    };
  }, []);

  // Apply CSS custom properties based on user preferences and device capabilities
  useEffect(() => {
    const root = document.documentElement;
    const config = getOptimizedAnimationConfig();

    // Animation preferences
    if (preferences.prefersReducedMotion) {
      root.style.setProperty('--animation-duration', '0.1s');
      root.style.setProperty('--transition-duration', '0.1s');
      root.style.setProperty('--spring-stiffness', '200');
      root.style.setProperty('--spring-damping', '40');
      root.style.setProperty('--animation-frame-rate', '30');
    } else {
      root.style.setProperty('--animation-duration', '0.3s');
      root.style.setProperty('--transition-duration', '0.2s');
      root.style.setProperty(
        '--spring-stiffness',
        String(config.springStiffness)
      );
      root.style.setProperty('--spring-damping', String(config.springDamping));
      root.style.setProperty(
        '--animation-frame-rate',
        String(config.animationFrameRate)
      );
    }

    // Device capability-based settings
    root.style.setProperty('--particle-count', String(config.particleCount));
    root.style.setProperty('--blur-intensity', String(config.blurIntensity));
    root.style.setProperty(
      '--max-concurrent-animations',
      String(config.maxConcurrentAnimations)
    );

    // Contrast preferences
    if (preferences.prefersHighContrast) {
      root.style.setProperty('--focus-outline-width', '4px');
      root.style.setProperty('--border-width', '2px');
      root.style.setProperty('--background-opacity', '0.95');
      root.style.setProperty('--shadow-intensity', '0.3');
    } else {
      root.style.setProperty('--focus-outline-width', '2px');
      root.style.setProperty('--border-width', '1px');
      root.style.setProperty('--background-opacity', '0.8');
      root.style.setProperty('--shadow-intensity', '0.1');
    }

    // Dark mode preferences (for future use)
    if (preferences.prefersDarkMode) {
      root.style.setProperty('--color-scheme', 'dark');
    } else {
      root.style.setProperty('--color-scheme', 'light');
    }
  }, [preferences]);

  return <>{children}</>;
};

export default PerformanceOptimizer;
