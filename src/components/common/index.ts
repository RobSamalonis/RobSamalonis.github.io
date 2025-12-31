// Animation components
export { default as AnimatedSection } from './AnimatedSection';
export { default as PageTransition } from './PageTransition';
export { default as AnimatedInteractive } from './AnimatedInteractive';
export { default as EntranceAnimation } from './EntranceAnimation';
export { default as LoadingSpinner } from './LoadingSpinner';

// Micro-interaction components
export { 
  ParticleEffect,
  HoverInteraction,
  ClickAnimation,
  MorphingShape,
  FocusEnhancement
} from './MicroInteractions';

// Performance-optimized micro-interaction components
export {
  OptimizedParticleEffect,
  OptimizedHoverInteraction,
  OptimizedClickAnimation,
  OptimizedFocusEnhancement
} from './OptimizedMicroInteractions';

// Performance and accessibility components
export { default as PerformanceOptimizer } from './PerformanceOptimizer';

// UI components
export { default as ProfileImage } from './ProfileImage';

// Re-export animation types and utilities
export type { 
  AnimationConfig, 
  ScrollRevealProps, 
  AnimationPresets,
  PageTransitionProps,
  MicroInteractionConfig,
  ParticleConfig,
  SpringConfig,
  HoverEffectConfig
} from '../../types/animation';

export { 
  animationPresets, 
  animationConfigs, 
  getAnimationProps,
  microInteractionPresets
} from '../../utils/animationPresets';

export { 
  useScrollAnimation, 
  useStaggeredAnimation 
} from '../../hooks/useScrollAnimation';