import { useState, useEffect } from 'react';

interface MobileSpacingState {
  isMobile: boolean;
  isBackToTopVisible: boolean;
  safeBottomPadding: string;
  viewportHeight: number;
}

/**
 * Custom hook to manage mobile-safe bottom spacing
 * Calculates dynamic bottom padding to prevent overlap with back-to-top button
 */
export const useMobileSpacing = (): MobileSpacingState => {
  const [state, setState] = useState<MobileSpacingState>({
    isMobile: false,
    isBackToTopVisible: false,
    safeBottomPadding: 'var(--spacing-4xl)', // Default 96px
    viewportHeight: window.innerHeight,
  });

  useEffect(() => {
    const checkMobile = () => {
      // Check if device is mobile based on screen width and user agent
      const isMobileWidth = window.innerWidth <= 768;
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      return isMobileWidth || isMobileUserAgent;
    };

    const checkBackToTopVisibility = () => {
      // Back to top button appears after scrolling 400px (from BackToTop component)
      return window.scrollY > 400;
    };

    const calculateSafeBottomPadding = (isMobile: boolean, isBackToTopVisible: boolean) => {
      if (!isMobile) {
        return 'var(--spacing-4xl)'; // Default 96px for desktop
      }

      if (isBackToTopVisible) {
        // On mobile with back-to-top visible, ensure minimum 120px bottom padding
        // This accounts for:
        // - Back-to-top button height (~60px)
        // - Button bottom position (32px)
        // - Additional safe margin (28px)
        // - Safe area insets (handled by CSS env())
        return 'max(var(--spacing-4xl), calc(env(safe-area-inset-bottom) + 120px))';
      }

      // Mobile without back-to-top button, use responsive spacing
      return 'max(var(--spacing-3xl), calc(env(safe-area-inset-bottom) + 64px))';
    };

    const updateSpacing = () => {
      const isMobile = checkMobile();
      const isBackToTopVisible = checkBackToTopVisibility();
      const safeBottomPadding = calculateSafeBottomPadding(isMobile, isBackToTopVisible);
      const viewportHeight = window.innerHeight;

      setState({
        isMobile,
        isBackToTopVisible,
        safeBottomPadding,
        viewportHeight,
      });
    };

    // Initial calculation
    updateSpacing();

    // Event listeners for dynamic updates
    const handleScroll = () => {
      const isBackToTopVisible = checkBackToTopVisibility();
      if (isBackToTopVisible !== state.isBackToTopVisible) {
        updateSpacing();
      }
    };

    const handleResize = () => {
      updateSpacing();
    };

    // Throttle scroll events for performance
    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 16); // ~60fps
    };

    // Add event listeners
    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [state.isBackToTopVisible]); // Only depend on back-to-top visibility to avoid infinite loops

  return state;
};