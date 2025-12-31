import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransitionProps } from '../../types/animation';
import { animationConfigs } from '../../utils/animationPresets';

/**
 * PageTransition component for smooth transitions between pages/sections
 * Provides consistent enter/exit animations
 */
const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = ''
}) => {
  const transitionConfig = animationConfigs.pageTransition;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{
          duration: transitionConfig.duration,
          ease: transitionConfig.easing
        }}
        style={{
          // Ensure smooth transitions without layout shifts
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;