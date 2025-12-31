import React from 'react';
import { motion } from 'framer-motion';
import { animationConfigs } from '../../utils/animationPresets';

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
 * to interactive elements like buttons, cards, etc.
 */
const AnimatedInteractive: React.FC<AnimatedInteractiveProps> = ({
  children,
  className = '',
  onClick,
  disabled = false,
  hoverScale = 1.05,
  tapScale = 0.95
}) => {
  const hoverConfig = animationConfigs.hover;
  
  return (
    <motion.div
      className={className}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { 
        scale: hoverScale,
        transition: { 
          duration: hoverConfig.duration,
          ease: hoverConfig.easing
        }
      }}
      whileTap={disabled ? {} : { 
        scale: tapScale,
        transition: { 
          duration: 0.1,
          ease: 'easeInOut'
        }
      }}
      style={{
        cursor: disabled ? 'default' : 'pointer',
        willChange: 'transform',
        // Prevent text selection on interactive elements
        userSelect: 'none',
        // Ensure the element is treated as interactive
        touchAction: 'manipulation'
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedInteractive;