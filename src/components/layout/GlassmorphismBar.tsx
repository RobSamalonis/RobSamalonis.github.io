import React from 'react';
import { Box, styled } from '@mui/material';
import { GlassmorphismBarProps } from '../../types/navigation';

// Styled component for glassmorphism effect
const GlassContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isScrolled',
})<{ isScrolled: boolean }>(({ theme, isScrolled }) => ({
  // CSS Custom Properties for dynamic theming and shadow alignment
  '--glass-background': 'rgba(255, 255, 255, 0.1)',
  '--glass-backdrop-filter': 'blur(20px) saturate(180%)',
  '--glass-border': '1px solid rgba(255, 255, 255, 0.2)',
  '--glass-border-radius': '16px',
  '--glass-transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  // Dark mode adjustments
  [theme.breakpoints.up('xs')]: {
    '--glass-background': theme.palette.mode === 'dark' 
      ? 'rgba(0, 0, 0, 0.2)' 
      : 'rgba(255, 255, 255, 0.1)',
    '--glass-border': theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.2)',
  },

  // Glassmorphism styling
  background: 'var(--glass-background)',
  backdropFilter: 'var(--glass-backdrop-filter)',
  WebkitBackdropFilter: 'var(--glass-backdrop-filter)', // Safari support
  border: 'var(--glass-border)',
  borderRadius: 'var(--glass-border-radius)',
  transition: 'var(--glass-transition)',

  // Enhanced glassmorphism when scrolled
  ...(isScrolled && {
    '--glass-background': theme.palette.mode === 'dark' 
      ? 'rgba(0, 0, 0, 0.3)' 
      : 'rgba(255, 255, 255, 0.15)',
    '--glass-backdrop-filter': 'blur(25px) saturate(200%)',
  }),

  // Ensure proper stacking and positioning
  position: 'relative',
  zIndex: 1,
  overflow: 'hidden',
  
  // Remove default box shadow
  boxShadow: 'none',

  // Subtle inner glow effect
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
    opacity: isScrolled ? 1 : 0.5,
    transition: 'opacity 0.3s ease',
  },

  // Performance optimizations
  willChange: 'backdrop-filter, background',
  transform: 'translateZ(0)', // Force hardware acceleration
}));

/**
 * GlassmorphismBar component provides a modern glassmorphism effect container
 * with backdrop-filter, transparency, and subtle borders.
 * 
 * Features:
 * - Dynamic glassmorphism effects that enhance when scrolled
 * - CSS custom properties for easy theming
 * - Dark mode support with appropriate color adjustments
 * - Responsive design with mobile optimizations
 * - Performance optimizations for smooth animations
 * - Accessibility considerations with proper contrast
 */
const GlassmorphismBar: React.FC<GlassmorphismBarProps> = ({ 
  children, 
  isScrolled, 
  className 
}) => {
  return (
    <GlassContainer
      isScrolled={isScrolled}
      className={className}
      role="presentation"
      aria-hidden="false"
    >
      {children}
    </GlassContainer>
  );
};

export default GlassmorphismBar;