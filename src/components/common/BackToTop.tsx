import React, { useState, useEffect } from 'react';
import { Fab, useScrollTrigger, Zoom, Box, Typography } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { colorPalette } from '../../styles/theme';

/**
 * Back to Top button with retro styling
 * Appears when user scrolls past the hero section
 */
const BackToTop: React.FC = () => {
  const [show, setShow] = useState(false);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 400, // Show after scrolling 400px (roughly past hero section)
  });

  useEffect(() => {
    setShow(trigger);
  }, [trigger]);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={show}>
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 1000,
        }}
      >
        <Box
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-label="Scroll back to top"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2.5,
            py: 1.5,
            background: `linear-gradient(135deg, ${colorPalette.accent.electricBlue}, ${colorPalette.accent.hotPink})`,
            border: `2px solid ${colorPalette.accent.electricBlue}`,
            borderRadius: 0,
            clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            boxShadow: `0 0 30px ${colorPalette.accent.electricBlue}60, inset 0 0 20px ${colorPalette.accent.hotPink}40`,
            color: colorPalette.primary.black,
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(45deg, transparent, ${colorPalette.neutral.white}30, transparent)`,
              animation: 'shimmer 3s infinite',
            },
            '&:hover': {
              background: `linear-gradient(135deg, ${colorPalette.accent.hotPink}, ${colorPalette.accent.electricBlue})`,
              boxShadow: `0 0 40px ${colorPalette.accent.hotPink}80, inset 0 0 30px ${colorPalette.accent.electricBlue}60`,
            },
            '&:focus-visible': {
              outline: `3px solid ${colorPalette.accent.neonGreen}`,
              outlineOffset: '2px',
            },
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%) translateY(-100%)' },
              '100%': { transform: 'translateX(100%) translateY(100%)' },
            },
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
      </motion.div>
    </Zoom>
  );
};

export default BackToTop;
