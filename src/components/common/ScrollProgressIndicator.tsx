import React, { useState, useEffect } from 'react';
import { Box, LinearProgress, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollProgressIndicatorProps {
  /** Show progress for entire page or specific section */
  mode?: 'page' | 'section';
  /** Section ID to track progress for (when mode is 'section') */
  sectionId?: string;
  /** Position of the indicator */
  position?: 'top' | 'bottom' | 'side';
  /** Whether to show percentage text */
  showPercentage?: boolean;
  /** Custom styling */
  sx?: object;
}

interface ScrollProgress {
  progress: number;
  isVisible: boolean;
}

const ScrollProgressIndicator: React.FC<ScrollProgressIndicatorProps> = ({
  mode = 'page',
  sectionId,
  position = 'top',
  showPercentage = false,
  sx = {}
}) => {
  const theme = useTheme();
  const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
    progress: 0,
    isVisible: false
  });

  useEffect(() => {
    let ticking = false;

    const calculateProgress = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          let progress = 0;
          let isVisible = false;

          if (mode === 'page') {
            // Calculate progress for entire page
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            isVisible = scrollTop > 100; // Show after scrolling 100px
          } else if (mode === 'section' && sectionId) {
            // Calculate progress within a specific section
            const section = document.getElementById(sectionId);
            if (section) {
              const rect = section.getBoundingClientRect();
              const sectionTop = rect.top + window.pageYOffset;
              const sectionHeight = rect.height;
              const scrollTop = window.pageYOffset;
              const viewportHeight = window.innerHeight;

              // Check if section is in viewport
              if (scrollTop + viewportHeight > sectionTop && scrollTop < sectionTop + sectionHeight) {
                isVisible = true;
                
                // Calculate progress within section
                const sectionScrollTop = Math.max(0, scrollTop - sectionTop);
                const maxScroll = Math.max(0, sectionHeight - viewportHeight);
                progress = maxScroll > 0 ? Math.min(100, (sectionScrollTop / maxScroll) * 100) : 0;
              }
            }
          }

          setScrollProgress({ progress, isVisible });
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial calculation
    calculateProgress();

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [mode, sectionId]);

  const getPositionStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      zIndex: 1000,
      pointerEvents: 'none' as const,
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyles,
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
        };
      case 'bottom':
        return {
          ...baseStyles,
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
        };
      case 'side':
        return {
          ...baseStyles,
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          width: '4px',
          height: '200px',
          borderRadius: '2px',
        };
      default:
        return baseStyles;
    }
  };

  const progressVariants = {
    hidden: { 
      opacity: 0,
      scale: position === 'side' ? 0.8 : 1,
      y: position === 'top' ? -10 : position === 'bottom' ? 10 : 0
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      scale: position === 'side' ? 0.8 : 1,
      y: position === 'top' ? -10 : position === 'bottom' ? 10 : 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {scrollProgress.isVisible && (
        <motion.div
          variants={progressVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={getPositionStyles()}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: position === 'side' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'transparent',
              borderRadius: position === 'side' ? '2px' : 0,
              overflow: 'hidden',
              ...sx
            }}
          >
            {position === 'side' ? (
              // Vertical progress bar for side position
              <Box
                sx={{
                  width: '100%',
                  height: `${scrollProgress.progress}%`,
                  background: `linear-gradient(180deg, 
                    ${theme.palette.primary.main} 0%, 
                    ${theme.palette.secondary.main} 100%)`,
                  borderRadius: '2px',
                  transition: 'height 0.1s ease-out',
                  boxShadow: `0 0 10px ${theme.palette.primary.main}40`,
                }}
              />
            ) : (
              // Horizontal progress bar for top/bottom positions
              <LinearProgress
                variant="determinate"
                value={scrollProgress.progress}
                sx={{
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, 
                      ${theme.palette.primary.main} 0%, 
                      ${theme.palette.secondary.main} 100%)`,
                    boxShadow: `0 0 10px ${theme.palette.primary.main}40`,
                  },
                }}
              />
            )}
            
            {/* Percentage display */}
            {showPercentage && (
              <Box
                sx={{
                  position: 'absolute',
                  top: position === 'side' ? 'auto' : '50%',
                  bottom: position === 'side' ? '-25px' : 'auto',
                  right: position === 'side' ? '50%' : '20px',
                  transform: position === 'side' 
                    ? 'translateX(50%)' 
                    : 'translateY(-50%)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                  pointerEvents: 'none',
                }}
              >
                {Math.round(scrollProgress.progress)}%
              </Box>
            )}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollProgressIndicator;