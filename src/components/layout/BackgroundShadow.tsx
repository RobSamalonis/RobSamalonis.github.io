import React, { useEffect, useRef, useState } from 'react';
import { Box, styled } from '@mui/material';

interface BackgroundShadowProps {
  headerHeight: number;
  isScrolled?: boolean;
}

// Styled component for background shadow with CSS custom properties
const ShadowContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isScrolled' && prop !== 'headerHeight',
})<{ isScrolled: boolean; headerHeight: number }>(({ theme, isScrolled, headerHeight }) => ({
  // CSS Custom Properties for shared header and shadow values
  '--shadow-blur': '32px',
  '--shadow-spread': '0px',
  '--shadow-color': theme.palette.mode === 'dark' 
    ? 'rgba(0, 0, 0, 0.3)' 
    : 'rgba(0, 0, 0, 0.1)',
  '--shadow-offset-y': '8px',
  
  // Enhanced shadow when scrolled (matches GlassmorphismBar behavior)
  ...(isScrolled && {
    '--shadow-blur': '40px',
    '--shadow-color': theme.palette.mode === 'dark'
      ? 'rgba(0, 0, 0, 0.4)'
      : 'rgba(0, 0, 0, 0.15)',
    '--shadow-offset-y': '12px',
  }),

  // Use same positioning strategy as header (position: fixed)
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: `${headerHeight}px`,
  
  // Apply shadow using custom properties
  boxShadow: `0 var(--shadow-offset-y) var(--shadow-blur) var(--shadow-spread) var(--shadow-color)`,
  
  // Ensure shadow is behind header
  zIndex: theme.zIndex.appBar - 1,
  
  // Pointer events should pass through to content below
  pointerEvents: 'none',
  
  // Smooth transition for shadow changes
  transition: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Performance optimizations
  willChange: 'box-shadow, height',
  transform: 'translateZ(0)', // Force hardware acceleration
}));

/**
 * BackgroundShadow component provides a shadow effect that aligns with the navigation header.
 * 
 * Features:
 * - Uses CSS custom properties for shared header and shadow values
 * - Implements ResizeObserver to handle dynamic header height changes
 * - Uses same positioning strategy as header (position: fixed)
 * - Matches blur radius, spread, and color values exactly
 * - Smooth transitions when scrolled state changes
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */
const BackgroundShadow: React.FC<BackgroundShadowProps> = ({ 
  headerHeight: initialHeaderHeight, 
  isScrolled = false 
}) => {
  const [headerHeight, setHeaderHeight] = useState(initialHeaderHeight);
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    // Find the header element to observe
    const headerElement = document.querySelector('header[class*="MuiAppBar"]');
    
    if (!headerElement) {
      return;
    }

    // Create ResizeObserver to handle dynamic header height changes
    observerRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;
        if (newHeight > 0 && newHeight !== headerHeight) {
          setHeaderHeight(newHeight);
        }
      }
    });

    // Start observing the header
    observerRef.current.observe(headerElement);

    // Cleanup observer on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headerHeight]);

  // Update height when prop changes
  useEffect(() => {
    setHeaderHeight(initialHeaderHeight);
  }, [initialHeaderHeight]);

  return (
    <ShadowContainer
      data-testid="background-shadow"
      isScrolled={isScrolled}
      headerHeight={headerHeight}
      aria-hidden="true"
    />
  );
};

export default BackgroundShadow;
