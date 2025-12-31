import React from 'react';
import { Box, styled } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationIndicatorProps {
  activeIndex: number;
  itemRefs: React.RefObject<HTMLElement>[];
  variant?: 'underline' | 'pill' | 'glow';
}

// Styled motion component for the indicator
const MotionIndicator = styled(motion.div)(() => ({
  position: 'absolute',
  zIndex: 1,
  pointerEvents: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

// Underline indicator variant
const UnderlineIndicator = styled(MotionIndicator)(({ theme }) => ({
  bottom: '-2px',
  height: '3px',
  background: `linear-gradient(90deg, 
    ${theme.palette.primary.main}, 
    ${theme.palette.secondary.main}
  )`,
  borderRadius: '2px',
  boxShadow: `0 0 8px ${theme.palette.primary.main}40`,
}));

// Pill indicator variant
const PillIndicator = styled(MotionIndicator)(({ theme }) => ({
  top: '50%',
  height: '40px',
  background: theme.palette.mode === 'dark'
    ? 'rgba(0, 255, 255, 0.15)'
    : 'rgba(0, 255, 255, 0.12)',
  borderRadius: '20px',
  border: `1px solid ${theme.palette.primary.main}30`,
  backdropFilter: 'blur(10px)',
  transform: 'translateY(-50%)',
}));

// Glow indicator variant
const GlowIndicator = styled(MotionIndicator)(({ theme }) => ({
  top: '50%',
  height: '44px',
  background: `radial-gradient(ellipse at center, 
    ${theme.palette.primary.main}20 0%, 
    ${theme.palette.primary.main}10 50%, 
    transparent 70%
  )`,
  borderRadius: '22px',
  transform: 'translateY(-50%)',
  filter: 'blur(1px)',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '2px',
    background: theme.palette.primary.main,
    borderRadius: '1px',
    boxShadow: `0 0 12px ${theme.palette.primary.main}`,
  },
}));

/**
 * NavigationIndicator provides advanced visual indicators for active navigation items
 * with smooth animations and multiple visual styles.
 * 
 * Features:
 * - Multiple indicator variants (underline, pill, glow)
 * - Smooth position transitions using Framer Motion
 * - Responsive positioning based on actual DOM elements
 * - Performance-optimized animations
 * - Accessibility-friendly (decorative only)
 */
const NavigationIndicator: React.FC<NavigationIndicatorProps> = ({
  activeIndex,
  itemRefs,
  variant = 'underline'
}) => {
  const [indicatorStyle, setIndicatorStyle] = React.useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Update indicator position when active index changes
  React.useEffect(() => {
    if (activeIndex >= 0 && activeIndex < itemRefs.length) {
      const activeElement = itemRefs[activeIndex]?.current;
      if (activeElement) {
        const rect = activeElement.getBoundingClientRect();
        const parentRect = activeElement.offsetParent?.getBoundingClientRect();
        
        if (parentRect) {
          setIndicatorStyle({
            left: rect.left - parentRect.left,
            width: rect.width,
            opacity: 1,
          });
        }
      }
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [activeIndex, itemRefs]);

  // Animation variants for smooth transitions
  const indicatorVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 0.8,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Render appropriate indicator variant
  const renderIndicator = () => {
    const commonProps = {
      variants: indicatorVariants,
      animate: 'visible',
      exit: 'exit',
      style: {
        left: indicatorStyle.left,
        width: indicatorStyle.width,
      },
      'aria-hidden': true,
      role: 'presentation',
    };

    switch (variant) {
      case 'pill':
        return (
          <PillIndicator
            {...commonProps}
            initial="hidden"
            layoutId="navigation-indicator-pill"
          />
        );
      
      case 'glow':
        return (
          <GlowIndicator
            {...commonProps}
            initial="hidden"
            layoutId="navigation-indicator-glow"
          />
        );
      
      case 'underline':
      default:
        return (
          <UnderlineIndicator
            {...commonProps}
            initial="hidden"
            layoutId="navigation-indicator-underline"
          />
        );
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <AnimatePresence mode="wait">
        {indicatorStyle.opacity > 0 && renderIndicator()}
      </AnimatePresence>
    </Box>
  );
};

export default NavigationIndicator;