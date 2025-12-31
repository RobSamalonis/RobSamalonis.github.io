import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useAnimationControls, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Box, styled } from '@mui/material';
import { 
  getOptimizedAnimationConfig, 
  getReducedMotionConfig,
  AnimationQueue,
  preventLayoutShift,
  createThrottledAnimationFrame
} from '../../utils/performance';
import { useAnimationConfig } from '../../hooks/useUserPreferences';

// Performance-optimized particle effect
interface OptimizedParticle {
  id: number;
  x: number;
  y: number;
  velocity: { x: number; y: number };
  life: number;
  color: string;
  size: number;
}

interface OptimizedParticleEffectProps {
  trigger: boolean;
  color?: string;
  particleCount?: number;
  duration?: number;
}

const OptimizedParticleContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
  willChange: 'transform', // Optimize for animations
});

export const OptimizedParticleEffect: React.FC<OptimizedParticleEffectProps> = ({
  trigger,
  color = '#00ffff',
  particleCount = 8,
  duration = 1000,
}) => {
  const [particles, setParticles] = useState<OptimizedParticle[]>([]);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const config = getOptimizedAnimationConfig();
  const animationConfig = useAnimationConfig();

  // Use optimized particle count based on device capabilities and user preferences
  const optimizedParticleCount = animationConfig.enableParticles 
    ? Math.min(particleCount, config.particleCount)
    : 0;

  useEffect(() => {
    if (trigger && animationConfig.enableParticles) {
      const animationQueue = AnimationQueue.getInstance();
      
      animationQueue.addAnimation(`particles-${Date.now()}`, async () => {
        // Generate particles with performance considerations
        const newParticles: OptimizedParticle[] = Array.from({ length: optimizedParticleCount }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          velocity: {
            x: (Math.random() - 0.5) * (animationConfig.enableComplexTransforms ? 4 : 2),
            y: (Math.random() - 0.5) * (animationConfig.enableComplexTransforms ? 4 : 2),
          },
          life: 1,
          color,
          size: Math.random() * 2 + 1, // Smaller particles for better performance
        }));

        setParticles(newParticles);
        startTimeRef.current = Date.now();

        // Use throttled animation frame for better performance
        const throttledRAF = createThrottledAnimationFrame(config.animationFrameRate);

        const animate = () => {
          const elapsed = Date.now() - (startTimeRef.current || 0);
          const progress = elapsed / (duration * animationConfig.duration);

          if (progress >= 1) {
            setParticles([]);
            return;
          }

          // Batch particle updates for better performance
          setParticles(prev => prev.map(particle => ({
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            life: 1 - progress,
          })));

          animationRef.current = throttledRAF(animate) as number;
        };

        animationRef.current = throttledRAF(animate) as number;
      });
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trigger, color, optimizedParticleCount, duration, config, animationConfig]);

  if (!animationConfig.enableParticles) {
    return null;
  }

  return (
    <OptimizedParticleContainer>
      <AnimatePresence mode="popLayout">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: '50%',
              opacity: particle.life,
              willChange: 'transform, opacity',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: particle.life }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: animationConfig.easing,
            }}
          />
        ))}
      </AnimatePresence>
    </OptimizedParticleContainer>
  );
};

// Performance-optimized hover interaction
interface OptimizedHoverInteractionProps {
  children: React.ReactNode;
  hoverScale?: number;
  hoverRotation?: number;
  springConfig?: {
    stiffness: number;
    damping: number;
    mass?: number;
  };
  glowColor?: string;
  enableParticles?: boolean;
  className?: string;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export const OptimizedHoverInteraction: React.FC<OptimizedHoverInteractionProps> = ({
  children,
  hoverScale = 1.05,
  hoverRotation = 2,
  springConfig,
  glowColor = '#00ffff',
  enableParticles = false,
  className,
  onHoverStart,
  onHoverEnd,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const controls = useAnimationControls();
  const elementRef = useRef<HTMLDivElement>(null);
  
  const config = getOptimizedAnimationConfig();
  const reducedMotionConfig = getReducedMotionConfig();
  
  // Use optimized spring configuration
  const optimizedSpringConfig = springConfig || {
    stiffness: config.springStiffness,
    damping: config.springDamping,
  };

  // Throttled mouse move handler for better performance
  const throttledMouseMove = useCallback(
    createThrottledAnimationFrame(30), // 30fps for mouse tracking
    []
  );

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform mouse position to rotation values (only if complex transforms are enabled)
  const rotateX = useTransform(
    y, 
    [-100, 100], 
    config.enableComplexTransforms ? [hoverRotation, -hoverRotation] : [0, 0]
  );
  const rotateY = useTransform(
    x, 
    [-100, 100], 
    config.enableComplexTransforms ? [-hoverRotation, hoverRotation] : [0, 0]
  );

  const handleMouseEnter = useCallback(() => {
    if (!reducedMotionConfig.enableHoverFeedback) return;
    
    setIsHovered(true);
    onHoverStart?.();
    
    // Reserve space to prevent layout shift
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      preventLayoutShift.reserveSpace(elementRef.current, {
        width: rect.width,
        height: rect.height,
      });
    }

    const animationQueue = AnimationQueue.getInstance();
    animationQueue.addAnimation('hover-enter', async () => {
      await controls.start({
        scale: hoverScale,
        transition: { type: 'spring', ...optimizedSpringConfig },
      });
    });

    if (enableParticles && config.enableParticles) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 100);
    }
  }, [
    reducedMotionConfig.enableHoverFeedback,
    onHoverStart,
    controls,
    hoverScale,
    optimizedSpringConfig,
    enableParticles,
    config.enableParticles,
  ]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onHoverEnd?.();
    
    const animationQueue = AnimationQueue.getInstance();
    animationQueue.addAnimation('hover-leave', async () => {
      await controls.start({
        scale: 1,
        transition: { type: 'spring', ...optimizedSpringConfig },
      });
    });
    
    x.set(0);
    y.set(0);
  }, [onHoverEnd, controls, optimizedSpringConfig, x, y]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!config.enableComplexTransforms || !reducedMotionConfig.enableHoverFeedback) return;
    
    throttledMouseMove(() => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        x.set((event.clientX - centerX) / 5);
        y.set((event.clientY - centerY) / 5);
      }
    });
  }, [config.enableComplexTransforms, reducedMotionConfig.enableHoverFeedback, throttledMouseMove, x, y]);

  return (
    <motion.div
      ref={elementRef}
      className={className}
      animate={controls}
      style={{
        rotateX: reducedMotionConfig.enableAnimations ? rotateX : 0,
        rotateY: reducedMotionConfig.enableAnimations ? rotateY : 0,
        position: 'relative',
        willChange: 'transform',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      whileTap={reducedMotionConfig.enableClickFeedback ? { 
        scale: 0.95,
        transition: { type: 'spring', ...optimizedSpringConfig }
      } : {}}
    >
      {children}
      
      {/* Optimized glow effect */}
      <AnimatePresence>
        {isHovered && config.enableGlow && reducedMotionConfig.enableAnimations && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2 * reducedMotionConfig.durationMultiplier,
              ease: reducedMotionConfig.easing,
            }}
            style={{
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`,
              borderRadius: 'inherit',
              zIndex: -1,
              filter: `blur(${config.blurIntensity}px)`,
              willChange: 'opacity',
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Optimized particle effect */}
      {enableParticles && (
        <OptimizedParticleEffect 
          trigger={showParticles} 
          color={glowColor}
          particleCount={config.particleCount}
        />
      )}
    </motion.div>
  );
};

// Performance-optimized click animation
interface OptimizedClickAnimationProps {
  children: React.ReactNode;
  onClick?: () => void;
  rippleColor?: string;
  springIntensity?: 'subtle' | 'moderate' | 'enhanced';
  className?: string;
}

export const OptimizedClickAnimation: React.FC<OptimizedClickAnimationProps> = ({
  children,
  onClick,
  rippleColor = '#00ffff',
  springIntensity = 'moderate',
  className,
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const rippleIdRef = useRef(0);
  const elementRef = useRef<HTMLDivElement>(null);
  
  const config = getOptimizedAnimationConfig();
  const reducedMotionConfig = getReducedMotionConfig();

  const springConfigs = {
    subtle: { stiffness: config.springStiffness * 0.75, damping: config.springDamping * 1.5 },
    moderate: { stiffness: config.springStiffness, damping: config.springDamping },
    enhanced: { stiffness: config.springStiffness * 1.25, damping: config.springDamping * 0.75 },
  };

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.();
    
    if (!reducedMotionConfig.enableClickFeedback) return;

    // Prevent layout shift
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      preventLayoutShift.reserveSpace(elementRef.current, {
        width: rect.width,
        height: rect.height,
      });
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = {
      id: rippleIdRef.current++,
      x,
      y,
    };

    const animationQueue = AnimationQueue.getInstance();
    animationQueue.addAnimation(`ripple-${newRipple.id}`, async () => {
      setRipples(prev => [...prev, newRipple]);

      // Remove ripple after animation with performance consideration
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600 * reducedMotionConfig.durationMultiplier);
    });
  }, [onClick, reducedMotionConfig.enableClickFeedback, reducedMotionConfig.durationMultiplier]);

  return (
    <motion.div
      ref={elementRef}
      className={className}
      onClick={handleClick}
      whileTap={reducedMotionConfig.enableClickFeedback ? {
        scale: 0.95,
        transition: { type: 'spring', ...springConfigs[springIntensity] },
      } : {}}
      style={{ 
        position: 'relative', 
        overflow: 'hidden',
        willChange: 'transform',
      }}
    >
      {children}
      
      {/* Optimized ripple effects */}
      <AnimatePresence mode="popLayout">
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{
              scale: 0,
              opacity: 0.6,
            }}
            animate={{
              scale: 4,
              opacity: 0,
            }}
            exit={{
              scale: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.6 * reducedMotionConfig.durationMultiplier,
              ease: reducedMotionConfig.easing,
            }}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: rippleColor,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

// Performance-optimized focus enhancement
interface OptimizedFocusEnhancementProps {
  children: React.ReactNode;
  focusColor?: string;
  focusScale?: number;
  className?: string;
}

export const OptimizedFocusEnhancement: React.FC<OptimizedFocusEnhancementProps> = ({
  children,
  focusColor = '#00ffff',
  focusScale = 1.02,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  const config = getOptimizedAnimationConfig();
  const reducedMotionConfig = getReducedMotionConfig();

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    
    // Prevent layout shift
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      preventLayoutShift.reserveSpace(elementRef.current, {
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <motion.div
      ref={elementRef}
      className={className}
      onFocus={handleFocus}
      onBlur={handleBlur}
      animate={reducedMotionConfig.enableFocusFeedback ? {
        scale: isFocused ? focusScale : 1,
        transition: { 
          type: 'spring', 
          stiffness: config.springStiffness, 
          damping: config.springDamping 
        },
      } : {}}
      style={{ 
        position: 'relative',
        willChange: 'transform',
      }}
    >
      {children}
      
      {/* Optimized focus ring */}
      <AnimatePresence>
        {isFocused && reducedMotionConfig.enableFocusFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.2 * reducedMotionConfig.durationMultiplier,
              ease: reducedMotionConfig.easing,
            }}
            style={{
              position: 'absolute',
              top: -3,
              left: -3,
              right: -3,
              bottom: -3,
              border: `2px solid ${focusColor}`,
              borderRadius: 'inherit',
              boxShadow: `0 0 0 4px ${focusColor}20`,
              pointerEvents: 'none',
              willChange: 'opacity, transform',
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};