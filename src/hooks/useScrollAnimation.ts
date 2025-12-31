import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

interface ScrollAnimationState {
  isInView: boolean;
  hasAnimated: boolean;
  ref: React.RefObject<HTMLElement>;
}

/**
 * Custom hook for managing scroll-triggered animations
 * Provides state management for elements that animate when scrolled into view
 */
export const useScrollAnimation = (
  options: UseScrollAnimationOptions = {}
): ScrollAnimationState => {
  const {
    threshold = 0.1,
    triggerOnce = true,
    rootMargin = '0px 0px -50px 0px'
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const isInView = useInView(ref, {
    once: triggerOnce,
    margin: rootMargin,
    amount: threshold
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  return {
    isInView,
    hasAnimated,
    ref
  };
};

/**
 * Hook for managing staggered animations (useful for lists or grids)
 */
export const useStaggeredAnimation = (
  itemCount: number,
  staggerDelay: number = 0.1
) => {
  const [animatedItems, setAnimatedItems] = useState<Set<number>>(new Set());
  
  const triggerAnimation = (index: number) => {
    setTimeout(() => {
      setAnimatedItems(prev => new Set([...prev, index]));
    }, index * staggerDelay * 1000);
  };

  const triggerAllAnimations = () => {
    for (let i = 0; i < itemCount; i++) {
      triggerAnimation(i);
    }
  };

  const resetAnimations = () => {
    setAnimatedItems(new Set());
  };

  return {
    animatedItems,
    triggerAnimation,
    triggerAllAnimations,
    resetAnimations,
    isItemAnimated: (index: number) => animatedItems.has(index)
  };
};