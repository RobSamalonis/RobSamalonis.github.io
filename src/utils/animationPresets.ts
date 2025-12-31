import { MotionProps } from 'framer-motion';
import { AnimationPresets, AnimationConfig } from '../types/animation';
import { respectsReducedMotion } from './performance';

// Animation presets for common animations
export const animationPresets: AnimationPresets = {
  fadeInUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  
  slideInLeft: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: 'easeOut' }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  
  glitchEffect: {
    initial: { opacity: 0 },
    animate: { 
      opacity: [0, 1, 0.8, 1],
      x: [0, -2, 2, 0],
      filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)']
    },
    transition: { 
      duration: 0.8, 
      ease: 'easeInOut',
      times: [0, 0.3, 0.6, 1]
    }
  },
  
  neonGlow: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      boxShadow: [
        '0 0 5px #00ffff',
        '0 0 20px #00ffff, 0 0 30px #00ffff',
        '0 0 5px #00ffff'
      ]
    },
    transition: { 
      duration: 1.2, 
      ease: 'easeOut',
      boxShadow: {
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 2
      }
    }
  }
};

// Modern micro-interaction animation presets
export const microInteractionPresets = {
  // Smooth hover with spring physics
  smoothHover: {
    whileHover: respectsReducedMotion() ? {} : { 
      scale: 1.05, 
      y: -2,
      transition: { type: 'spring', stiffness: 400, damping: 17 }
    },
    whileTap: respectsReducedMotion() ? {} : { 
      scale: 0.95,
      transition: { type: 'spring', stiffness: 500, damping: 15 }
    }
  },

  // Enhanced hover with rotation
  enhancedHover: {
    whileHover: respectsReducedMotion() ? {} : { 
      scale: 1.08, 
      rotate: 2,
      y: -3,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    whileTap: respectsReducedMotion() ? {} : { 
      scale: 0.92,
      rotate: -1,
      transition: { type: 'spring', stiffness: 400, damping: 17 }
    }
  },

  // Satisfying click with spring physics
  springClick: {
    whileTap: respectsReducedMotion() ? {} : {
      scale: 0.9,
      transition: { 
        type: 'spring', 
        stiffness: 600, 
        damping: 12,
        mass: 0.8
      }
    }
  },

  // Elastic bounce effect
  elasticBounce: {
    whileHover: respectsReducedMotion() ? {} : {
      scale: 1.1,
      transition: { 
        type: 'spring', 
        stiffness: 500, 
        damping: 8,
        mass: 0.6
      }
    },
    whileTap: respectsReducedMotion() ? {} : {
      scale: 0.85,
      transition: { 
        type: 'spring', 
        stiffness: 700, 
        damping: 10
      }
    }
  },

  // Morphing icon animation
  iconMorph: {
    whileHover: respectsReducedMotion() ? {} : { 
      scale: 1.15, 
      rotate: 10,
      transition: { type: 'spring', stiffness: 400, damping: 17 }
    },
    whileTap: respectsReducedMotion() ? {} : { 
      scale: 0.9, 
      rotate: -5,
      transition: { type: 'spring', stiffness: 500, damping: 15 }
    }
  },

  // Glow pulse effect
  glowPulse: {
    animate: respectsReducedMotion() ? {} : {
      boxShadow: [
        '0 0 5px rgba(0, 255, 255, 0.3)',
        '0 0 20px rgba(0, 255, 255, 0.6), 0 0 30px rgba(0, 255, 255, 0.4)',
        '0 0 5px rgba(0, 255, 255, 0.3)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'easeInOut'
      }
    }
  },

  // Floating animation
  float: {
    animate: respectsReducedMotion() ? {} : {
      y: [-2, 2, -2],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'easeInOut'
      }
    }
  },

  // Particle burst trigger
  particleBurst: {
    whileTap: respectsReducedMotion() ? {} : {
      scale: [1, 1.2, 1],
      transition: { duration: 0.3, times: [0, 0.5, 1] }
    }
  }
};

// Common animation configurations
export const animationConfigs: Record<string, AnimationConfig> = {
  entrance: {
    type: 'entrance',
    duration: 0.8,
    delay: 0.2,
    easing: 'easeOut'
  },
  
  scrollReveal: {
    type: 'scroll',
    duration: 0.6,
    easing: 'easeOut'
  },
  
  hover: {
    type: 'hover',
    duration: 0.3,
    easing: 'easeInOut'
  },
  
  pageTransition: {
    type: 'transition',
    duration: 0.5,
    easing: 'easeInOut'
  }
};

// Utility function to get animation props based on config
export const getAnimationProps = (config: AnimationConfig): MotionProps => {
  const baseProps: MotionProps = {
    transition: {
      duration: config.duration,
      delay: config.delay || 0,
      ease: config.easing || 'easeOut'
    }
  };

  switch (config.type) {
    case 'entrance':
      return {
        ...animationPresets.fadeInUp,
        transition: baseProps.transition
      };
    
    case 'scroll':
      return {
        ...animationPresets.fadeInUp,
        transition: baseProps.transition
      };
    
    case 'hover':
      return {
        whileHover: { scale: 1.05, transition: baseProps.transition },
        whileTap: { scale: 0.95 }
      };
    
    case 'transition':
      return {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: baseProps.transition
      };
    
    default:
      return baseProps;
  }
};