import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  animationPresets,
  animationConfigs,
} from '../../utils/animationPresets';
import {
  getOptimizedAnimationConfig,
  respectsReducedMotion,
} from '../../utils/performance';

interface EntranceAnimationProps {
  children: React.ReactNode;
  delay?: number;
  preset?: keyof typeof animationPresets;
  className?: string;
}

/**
 * EntranceAnimation component for initial page load animations
 * Provides smooth entrance effects with performance optimization and accessibility support
 */
const EntranceAnimation: React.FC<EntranceAnimationProps> = ({
  children,
  delay = 0,
  preset = 'fadeInUp',
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

  const entranceConfig = animationConfigs.entrance;
  const animationProps = animationPresets[preset];

  // Adjust animation based on performance and user preferences
  const adjustedDuration = prefersReduced
    ? (entranceConfig.duration || 0.3) * 0.3
    : ((entranceConfig.duration || 0.3) /
        performanceConfig.animationFrameRate) *
      60;

  const adjustedDelay = prefersReduced
    ? 0
    : delay + (entranceConfig.delay || 0);

  return (
    <motion.div
      className={className}
      initial={animationProps.initial}
      animate={animationProps.animate}
      transition={{
        ...animationProps.transition,
        delay: adjustedDelay,
        duration: adjustedDuration,
        ease: prefersReduced ? 'linear' : entranceConfig.easing,
      }}
      style={{
        willChange: 'transform, opacity',
        // Use GPU acceleration for better performance
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </motion.div>
  );
};

export default EntranceAnimation;
