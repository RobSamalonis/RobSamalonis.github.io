import React from 'react';
import { motion } from 'framer-motion';
import { animationPresets, animationConfigs } from '../../utils/animationPresets';

interface EntranceAnimationProps {
  children: React.ReactNode;
  delay?: number;
  preset?: keyof typeof animationPresets;
  className?: string;
}

/**
 * EntranceAnimation component for initial page load animations
 * Provides smooth entrance effects that fade into their space without layout shifts
 */
const EntranceAnimation: React.FC<EntranceAnimationProps> = ({
  children,
  delay = 0,
  preset = 'fadeInUp',
  className = ''
}) => {
  const entranceConfig = animationConfigs.entrance;
  const animationProps = animationPresets[preset];

  return (
    <motion.div
      className={className}
      initial={animationProps.initial}
      animate={animationProps.animate}
      transition={{
        ...animationProps.transition,
        delay: delay + (entranceConfig.delay || 0),
        duration: entranceConfig.duration,
        ease: entranceConfig.easing
      }}
      style={{
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </motion.div>
  );
};

export default EntranceAnimation;