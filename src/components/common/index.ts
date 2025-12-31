// Animation components
export { default as AnimatedSection } from './AnimatedSection';
export { default as PageTransition } from './PageTransition';
export { default as AnimatedInteractive } from './AnimatedInteractive';
export { default as EntranceAnimation } from './EntranceAnimation';
export { default as LoadingSpinner } from './LoadingSpinner';

// UI components
export { default as ProfileImage } from './ProfileImage';

// Re-export animation types and utilities
export type { 
  AnimationConfig, 
  ScrollRevealProps, 
  AnimationPresets,
  PageTransitionProps 
} from '../../types/animation';

export { 
  animationPresets, 
  animationConfigs, 
  getAnimationProps 
} from '../../utils/animationPresets';

export { 
  useScrollAnimation, 
  useStaggeredAnimation 
} from '../../hooks/useScrollAnimation';