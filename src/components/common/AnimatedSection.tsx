import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, MotionProps } from 'framer-motion';
import { ScrollRevealProps } from '../../types/animation';
import { getAnimationProps } from '../../utils/animationPresets';

/**
 * AnimatedSection component that triggers animations when scrolled into view
 * Supports various animation types and configurations
 */
const AnimatedSection: React.FC<ScrollRevealProps> = ({
  children,
  animation,
  threshold = 0.1
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: true, // Only animate once when first coming into view
    margin: '0px 0px -100px 0px', // Start animation slightly before element is fully visible
    amount: threshold
  });
  
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  // Get animation properties based on the provided configuration
  const animationProps = getAnimationProps(animation);
  
  // Override the animate property to control when animation triggers
  const motionProps: MotionProps = {
    ...animationProps,
    animate: hasAnimated ? animationProps.animate : animationProps.initial
  };

  return (
    <motion.div
      ref={ref}
      {...motionProps}
      style={{
        // Ensure the component doesn't cause layout shifts
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;