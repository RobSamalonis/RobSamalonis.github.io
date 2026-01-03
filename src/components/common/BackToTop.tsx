import React, { useState, useEffect, useCallback } from 'react';
import { useScrollTrigger, Zoom, Box, Typography } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { colorPalette } from '../../styles/theme';
import { useSafariNavigation } from '../../hooks/useSafariNavigation';

/**
 * Back to Top button with retro styling and iPhone Safari compatibility
 * Appears when user scrolls past the hero section
 * Automatically adjusts positioning for Safari navigation bar conflicts
 */
const BackToTop: React.FC = () => {
  const [show, setShow] = useState(false);

  // Get Safari navigation state for iPhone compatibility
  const safariNavigation = useSafariNavigation();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 400, // Show after scrolling 400px (roughly past hero section)
  });

  useEffect(() => {
    setShow(trigger);
  }, [trigger]);

  // Enhanced scroll handler with Safari navigation bar consideration
  const handleClick = useCallback(() => {
    // For Safari on iOS, ensure navigation bar is accounted for in scroll calculation
    if (safariNavigation.isSafari && safariNavigation.isIOS) {
      // Use requestAnimationFrame to ensure smooth scrolling even with navigation bar changes
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [safariNavigation.isSafari, safariNavigation.isIOS]);

  // Enhanced touch event handling for iPhone Safari
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // Prevent touch event from being intercepted by Safari navigation
      if (safariNavigation.isSafari && safariNavigation.isIOS) {
        e.stopPropagation();
      }
    },
    [safariNavigation.isSafari, safariNavigation.isIOS]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      // Ensure touch end triggers the click action reliably on Safari
      if (safariNavigation.isSafari && safariNavigation.isIOS) {
        e.preventDefault();
        e.stopPropagation();
        handleClick();
      }
    },
    [safariNavigation.isSafari, safariNavigation.isIOS, handleClick]
  );

  // Calculate dynamic positioning based on Safari navigation state
  const getButtonPosition = () => {
    const baseRight = 32;
    const baseBottom = safariNavigation.backToTopButtonOffset;

    return {
      bottom: `${baseBottom}px`,
      right: `${baseRight}px`,
    };
  };

  const buttonPosition = getButtonPosition();

  return (
    <Zoom in={show}>
      <Box
        component={motion.button}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={
          safariNavigation.isSafari && safariNavigation.isIOS
            ? handleTouchEnd
            : undefined
        }
        aria-label={`Scroll back to top${safariNavigation.isSafari && safariNavigation.isIOS ? ' (iPhone optimized)' : ''}`}
        sx={{
          position: 'fixed',
          bottom: buttonPosition.bottom,
          right: buttonPosition.right,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          py: 1.5,
          background: `linear-gradient(135deg, ${colorPalette.accent.electricBlue}, ${colorPalette.accent.hotPink})`,
          color: colorPalette.primary.black, // Black text for better contrast on gradient
          border: `2px solid ${colorPalette.accent.electricBlue}`,
          borderRadius: 0,
          clipPath:
            'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
          boxShadow: `0 0 30px ${colorPalette.accent.electricBlue}60, inset 0 0 20px ${colorPalette.accent.hotPink}40`,
          overflow: 'hidden',
          cursor: 'pointer',
          // Enhanced touch target for mobile
          minHeight: '48px',
          minWidth: '48px',
          // Ensure the button doesn't interfere with page layout when hidden
          visibility: show ? 'visible' : 'hidden',
          opacity: show ? 1 : 0,
          transform: show ? 'scale(1)' : 'scale(0)',
          pointerEvents: show ? 'auto' : 'none',
          // Safari-specific optimizations
          ...(safariNavigation.isSafari &&
            safariNavigation.isIOS && {
              WebkitTapHighlightColor: 'transparent', // Remove iOS tap highlight
              WebkitTouchCallout: 'none', // Disable iOS callout menu
              WebkitUserSelect: 'none', // Prevent text selection
              userSelect: 'none',
              touchAction: 'manipulation', // Improve touch responsiveness on iOS
            }),
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(45deg, transparent, ${colorPalette.neutral.white}30, transparent)`,
            animation: 'shimmer 60s linear infinite',
          },
          '&:hover': {
            background: `linear-gradient(135deg, ${colorPalette.accent.hotPink}, ${colorPalette.accent.electricBlue})`,
            color: colorPalette.primary.black, // Maintain black text on hover
            boxShadow: `0 0 40px ${colorPalette.accent.hotPink}80, inset 0 0 30px ${colorPalette.accent.electricBlue}60`,
            transform: 'scale(1.05) translateY(-5px)',
          },
          '&:focus-visible': {
            outline: `3px solid ${colorPalette.accent.neonGreen}`,
            outlineOffset: '2px',
          },
          // Enhanced active state for touch devices
          '&:active': {
            transform: 'scale(0.95)',
            transition: 'transform 0.1s ease',
          },
          '@keyframes shimmer': {
            '0%': { transform: 'translate3d(-100%, -100%, 0)' },
            '100%': { transform: 'translate3d(100%, 100%, 0)' },
          },
          transition: 'all 0.3s ease',
        }}
      >
        <KeyboardArrowUp
          sx={{
            fontSize: '1.5rem',
            position: 'relative',
            zIndex: 1,
          }}
        />
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 700,
            fontFamily: '"Orbitron", "Roboto", sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            position: 'relative',
            zIndex: 1,
            whiteSpace: 'nowrap',
          }}
        >
          Back to Top
        </Typography>
      </Box>
    </Zoom>
  );
};

export default BackToTop;
