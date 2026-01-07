import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransitionProps } from '../../types/animation';
import { animationConfigs } from '../../utils/animationPresets';
import {
  getOptimizedAnimationConfig,
  respectsReducedMotion,
} from '../../utils/performance';

/**
 * PageTransition component for smooth transitions between pages/sections
 * Provides consistent enter/exit animations with performance optimization
 */
const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
}) => {
  const [performanceConfig, setPerformanceConfig] = useState(
    getOptimizedAnimationConfig()
  );
  const [prefersReduced, setPrefersReduced] = useState(respectsReducedMotion());

  // Update performance config on mount and when preferences change
  useEffect(() => {
    const config = getOptimizedAnimationConfig();
    setPerformanceConfig(config);
    setPrefersReduced(respectsReducedMotion());

    // Listen for preference changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleChange = () => {
        setPrefersReduced(mediaQuery.matches);
        setPerformanceConfig(getOptimizedAnimationConfig());
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const transitionConfig = animationConfigs.pageTransition;

  // Adjust animation based on performance and user preferences
  const adjustedDuration = prefersReduced
    ? (transitionConfig.duration || 0.3) * 0.3
    : ((transitionConfig.duration || 0.3) /
        performanceConfig.animationFrameRate) *
      60;

  // Reduce animation complexity on low-end devices
  const initialX = performanceConfig.enableComplexTransforms ? 20 : 0;
  const exitX = performanceConfig.enableComplexTransforms ? -20 : 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        initial={{ opacity: 0, x: initialX }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: exitX }}
        transition={{
          duration: adjustedDuration,
          ease: prefersReduced ? 'linear' : transitionConfig.easing,
        }}
        style={{
          // Ensure smooth transitions without layout shifts
          willChange: 'transform, opacity',
          // Use GPU acceleration for better performance
          transform: 'translateZ(0)',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
