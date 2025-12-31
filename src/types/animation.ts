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