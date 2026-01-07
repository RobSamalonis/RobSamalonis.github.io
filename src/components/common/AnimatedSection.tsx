import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, MotionProps } from 'framer-motion';
import { ScrollRevealProps } from '../../types/animation';
import { getAnimationProps } from '../../utils/animationPresets';
import {
  getOptimizedAnimationConfig,
  respectsReducedMotion,
} from '../../utils/performance';

/**
 * AnimatedSection component that triggers animations when scrolled into view
 * Supports various animation types and configurations with performance optimization
 */
const AnimatedSection: React.FC<ScrollRevealProps> = ({
  children,
  animation,
  threshold = 0.1,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [performanceConfig, setPerformanceConfig] = useState(
    getOptimizedAnimationConfig()
  );
  const [prefersReduced, setPrefersReduced] = useState(respectsReducedMotion());

  let isInView = false;
  try {
    isInView = useInView(ref, {
      once: true, // Only animate once when first coming into view
      margin: '0px 0px -100px 0px', // Start animation slightly before element is fully visible
      amount: threshold,
    });
  } catch (error) {
    // Handle errors in useInView gracefully
    console.debug('useInView error:', error);
  }

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  // Update performance config on mount and when preferences change
  useEffect(() => {
    try {
      const config = getOptimizedAnimationConfig();
      setPerformanceConfig(config);
      setPrefersReduced(respectsReducedMotion());

      // Listen for preference changes
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mediaQuery = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        );
        const handleChange = () => {
          setPrefersReduced(mediaQuery.matches);
          setPerformanceConfig(getOptimizedAnimationConfig());
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
    } catch (error) {
      console.debug('Performance config error:', error);
    }
  }, []);

  // Get animation properties based on the provided configuration
  const animationProps = getAnimationProps(animation);

  // Adjust animation based on performance and user preferences
  const transitionConfig = (animationProps.transition as any) || {};
  const baseDuration = transitionConfig.duration || 0.3;
  const adjustedDuration = prefersReduced
    ? baseDuration * 0.3
    : (baseDuration / performanceConfig.animationFrameRate) * 60;

  const adjustedTransition = {
    ...animationProps.transition,
    duration: adjustedDuration,
    ease: prefersReduced ? 'linear' : transitionConfig.ease,
  };

  // Override the animate property to control when animation triggers
  const motionProps: MotionProps = {
    ...animationProps,
    animate: hasAnimated ? animationProps.animate : animationProps.initial,
    transition: adjustedTransition,
  };

  return (
    <motion.div
      ref={ref}
      {...motionProps}
      style={{
        // Ensure the component doesn't cause layout shifts
        willChange: 'transform, opacity',
        // Use GPU acceleration for better performance
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
