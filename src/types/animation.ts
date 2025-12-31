import { MotionProps } from 'framer-motion';

export interface AnimationConfig {
  type: 'entrance' | 'scroll' | 'hover' | 'transition';
  duration: number;
  delay?: number;
  easing?: string;
}

export interface ScrollRevealProps {
  children: React.ReactNode;
  animation: AnimationConfig;
  threshold?: number;
}

export interface AnimationPresets {
  fadeInUp: MotionProps;
  slideInLeft: MotionProps;
  scaleIn: MotionProps;
  glitchEffect: MotionProps;
  neonGlow: MotionProps;
}

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Micro-interaction specific types
export interface MicroInteractionConfig {
  type: 'hover' | 'click' | 'focus' | 'active';
  animation: MotionProps;
  sound?: boolean;
  haptic?: boolean;
  respectReducedMotion?: boolean;
}

export interface ParticleConfig {
  count: number;
  color: string;
  size: { min: number; max: number };
  velocity: { min: number; max: number };
  life: number;
}

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass?: number;
}

export interface HoverEffectConfig {
  scale?: number;
  rotation?: number;
  translation?: { x?: number; y?: number };
  glow?: {
    enabled: boolean;
    color: string;
    intensity: number;
  };
  particles?: ParticleConfig;
  spring?: SpringConfig;
}