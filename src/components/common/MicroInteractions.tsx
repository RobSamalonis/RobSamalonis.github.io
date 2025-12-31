import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Box, styled } from '@mui/material';
import { respectsReducedMotion } from '../../utils/performance';

// Particle effect component for enhanced interactions
interface Particle {
  id: number;
  x: number;
  y: number;
  velocity: { x: number; y: number };
  life: number;
  color: string;
  size: number;
}

interface ParticleEffectProps {
  trigger: boolean;
  color?: string;
  particleCount?: number;
  duration?: number;
}

const ParticleContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
});

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  trigger,
  color = '#00ffff',
  particleCount = 8,
  duration = 1000,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (trigger && !respectsReducedMotion()) {
      // Generate particles
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4,
        },
        life: 1,
        color,
        size: Math.random() * 3 + 1,
      }));

      setParticles(newParticles);
      startTimeRef.current = Date.now();

      const animate = () => {
        const elapsed = Date.now() - (startTimeRef.current || 0);
        const progress = elapsed / duration;

        if (progress >= 1) {
          setParticles([]);
          return;
        }

        setParticles(prev => prev.map(particle => ({
          ...particle,
          x: particle.x + particle.velocity.x,
          y: particle.y + particle.velocity.y,
          life: 1 - progress,
        })));

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trigger, color, particleCount, duration]);

  return (
    <ParticleContainer>
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
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        />
      ))}
    </ParticleContainer>
  );
};

// Enhanced hover interaction component
interface HoverInteractionProps {
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
}

export const HoverInteraction: React.FC<HoverInteractionProps> = ({
  children,
  hoverScale = 1.05,
  hoverRotation = 2,
  springConfig = { stiffness: 400, damping: 17 },
  glowColor = '#00ffff',
  enableParticles = false,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform mouse position to rotation values
  const rotateX = useTransform(y, [-100, 100], [hoverRotation, -hoverRotation]);
  const rotateY = useTransform(x, [-100, 100], [-hoverRotation, hoverRotation]);

  const handleMouseEnter = () => {
    if (respectsReducedMotion()) return;
    
    setIsHovered(true);
    controls.start({
      scale: hoverScale,
      transition: { type: 'spring', ...springConfig },
    });

    if (enableParticles) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 100);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    controls.start({
      scale: 1,
      transition: { type: 'spring', ...springConfig },
    });
    x.set(0);
    y.set(0);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (respectsReducedMotion()) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((event.clientX - centerX) / 5);
    y.set((event.clientY - centerY) / 5);
  };

  return (
    <motion.div
      className={className}
      animate={controls}
      style={{
        rotateX: respectsReducedMotion() ? 0 : rotateX,
        rotateY: respectsReducedMotion() ? 0 : rotateY,
        position: 'relative',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      whileTap={respectsReducedMotion() ? {} : { scale: 0.95 }}
    >
      {children}
      
      {/* Glow effect */}
      {isHovered && !respectsReducedMotion() && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`,
            borderRadius: 'inherit',
            zIndex: -1,
            filter: 'blur(4px)',
          }}
        />
      )}
      
      {/* Particle effect */}
      {enableParticles && (
        <ParticleEffect trigger={showParticles} color={glowColor} />
      )}
    </motion.div>
  );
};

// Click animation component with spring physics
interface ClickAnimationProps {
  children: React.ReactNode;
  onClick?: () => void;
  rippleColor?: string;
  springIntensity?: 'subtle' | 'moderate' | 'enhanced';
  className?: string;
}

export const ClickAnimation: React.FC<ClickAnimationProps> = ({
  children,
  onClick,
  rippleColor = '#00ffff',
  springIntensity = 'moderate',
  className,
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const rippleIdRef = useRef(0);

  const springConfigs = {
    subtle: { stiffness: 300, damping: 25 },
    moderate: { stiffness: 400, damping: 17 },
    enhanced: { stiffness: 500, damping: 15 },
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (respectsReducedMotion()) {
      onClick?.();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = {
      id: rippleIdRef.current++,
      x,
      y,
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  return (
    <motion.div
      className={className}
      onClick={handleClick}
      whileTap={respectsReducedMotion() ? {} : {
        scale: 0.95,
        transition: { type: 'spring', ...springConfigs[springIntensity] },
      }}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {children}
      
      {/* Ripple effects */}
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
          transition={{
            duration: 0.6,
            ease: 'easeOut',
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
          }}
        />
      ))}
    </motion.div>
  );
};

// Morphing shape component for enhanced interactions
interface MorphingShapeProps {
  isActive: boolean;
  color?: string;
  size?: number;
  morphType?: 'circle-to-square' | 'triangle-to-circle' | 'star-to-circle';
}

export const MorphingShape: React.FC<MorphingShapeProps> = ({
  isActive,
  color = '#00ffff',
  size = 20,
  morphType = 'circle-to-square',
}) => {
  const getMorphPath = () => {
    switch (morphType) {
      case 'circle-to-square':
        return isActive
          ? `M 0 ${size/4} L 0 ${size*3/4} L ${size} ${size*3/4} L ${size} ${size/4} Z`
          : `M ${size/2} 0 A ${size/2} ${size/2} 0 1 1 ${size/2-0.1} 0 Z`;
      
      case 'triangle-to-circle':
        return isActive
          ? `M ${size/2} 0 A ${size/2} ${size/2} 0 1 1 ${size/2-0.1} 0 Z`
          : `M ${size/2} 0 L ${size} ${size} L 0 ${size} Z`;
      
      case 'star-to-circle':
        return isActive
          ? `M ${size/2} 0 A ${size/2} ${size/2} 0 1 1 ${size/2-0.1} 0 Z`
          : `M ${size/2} 0 L ${size*0.6} ${size*0.35} L ${size} ${size*0.35} L ${size*0.75} ${size*0.6} L ${size*0.85} ${size} L ${size/2} ${size*0.8} L ${size*0.15} ${size} L ${size*0.25} ${size*0.6} L 0 ${size*0.35} L ${size*0.4} ${size*0.35} Z`;
      
      default:
        return `M ${size/2} 0 A ${size/2} ${size/2} 0 1 1 ${size/2-0.1} 0 Z`;
    }
  };

  if (respectsReducedMotion()) {
    return (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: isActive ? '4px' : '50%',
          transition: 'border-radius 0.3s ease',
        }}
      />
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <motion.path
        d={getMorphPath()}
        fill={color}
        initial={false}
        animate={{ d: getMorphPath() }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      />
    </svg>
  );
};

// Focus enhancement component
interface FocusEnhancementProps {
  children: React.ReactNode;
  focusColor?: string;
  focusScale?: number;
  className?: string;
}

export const FocusEnhancement: React.FC<FocusEnhancementProps> = ({
  children,
  focusColor = '#00ffff',
  focusScale = 1.02,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className={className}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      animate={respectsReducedMotion() ? {} : {
        scale: isFocused ? focusScale : 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      style={{ position: 'relative' }}
    >
      {children}
      
      {/* Focus ring */}
      {isFocused && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
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
          }}
        />
      )}
    </motion.div>
  );
};