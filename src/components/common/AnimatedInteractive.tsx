import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { animationConfigs } from '../../utils/animationPresets';
import {
  getOptimizedAnimationConfig,
  respectsReducedMotion,
} from '../../utils/performance';

interface AnimatedInteractiveProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  hoverScale?: number;
  tapScale?: number;
}

/**
 * AnimatedInteractive component that adds hover and tap animations
 * to interactive elements like buttons, cards, etc. with performance optimization
 */
const AnimatedInteractive: React.FC<AnimatedInteractiveProps> = ({
  children,
  className = '',
  onClick,
  disabled = false,
  hoverScale = 1.05,
  tapScale = 0.95,
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

  const hoverConfig = animationConfigs.hover;

  // Disable complex animations on low-end devices or with reduced motion preference
  const enableComplexAnimations =
    performanceConfig.enableComplexTransforms && !prefersReduced;

  return (
    <motion.div
      className={className}
      onClick={disabled ? undefined : onClick}
      whileHover={
        disabled || !enableComplexAnimations
          ? {}
          : {
              scale: hoverScale,
              transition: {
                duration: hoverConfig.duration,
                ease: hoverConfig.easing,
              },
            }
      }
      whileTap={
        disabled
          ? {}
          : {
              scale: tapScale,
              transition: {
                duration: 0.1,
                ease: 'easeInOut',
              },
            }
      }
      style={{
        cursor: disabled ? 'default' : 'pointer',
        willChange: 'transform',
        // Prevent text selection on interactive elements
        userSelect: 'none',
        // Ensure the element is treated as interactive
        touchAction: 'manipulation',
        // Use GPU acceleration for better performance
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedInteractive;
