import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animationPresets, animationConfigs } from '../../utils/animationPresets';

interface EntranceAnimationProps {
  children: React.ReactNode;
  delay?: number;
  preset?: keyof typeof animationPresets;
  className?: string;
}

/**
 * EntranceAnimation component for initial page load animations
 * Provides engaging entrance effects when the site first loads
 */
const EntranceAnimation: React.FC<EntranceAnimationProps> = ({
  children,
  delay = 0,
  preset = 'fadeInUp',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  const entranceConfig = animationConfigs.entrance;
  const animationProps = animationPresets[preset];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          initial={animationProps.initial}
          animate={animationProps.animate}
          transition={{
            ...animationProps.transition,
            delay: entranceConfig.delay,
            duration: entranceConfig.duration,
            ease: entranceConfig.easing
          }}
          style={{
            willChange: 'transform, opacity'
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntranceAnimation;