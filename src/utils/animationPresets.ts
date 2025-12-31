import { MotionProps } from 'framer-motion';
import { AnimationPresets, AnimationConfig } from '../types/animation';

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