import { useState, useEffect, useCallback } from 'react';

interface SafariNavigationState {
  isNavigationVisible: boolean;
  viewportHeight: number;
  safeAreaBottom: number;
  isSafari: boolean;
  isIOS: boolean;
  safariVersion: number | null;
  backToTopButtonOffset: number;
}

/**
 * Custom hook to detect iOS Safari browser and monitor navigation bar state
 * Provides safe positioning calculations for back-to-top button compatibility
 */
export const useSafariNavigation = (): SafariNavigationState => {
  const [state, setState] = useState<SafariNavigationState>({
    isNavigationVisible: false,
    viewportHeight: window.innerHeight,
    safeAreaBottom: 0,
    isSafari: false,
    isIOS: false,
    safariVersion: null,
    backToTopButtonOffset: 32, // Default bottom offset
  });

  // Detect iOS Safari browser and version
  const detectSafari = useCallback(() => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(userAgent);
    
    let safariVersion: number | null = null;
    if (isSafari && isIOS) {
      const versionMatch = userAgent.match(/Version\/(\d+)/);
      if (versionMatch) {
        safariVersion = parseInt(versionMatch[1], 10);
      }
    }

    return { isIOS, isSafari, safariVersion };
  }, []);

  // Calculate safe area bottom inset
  const getSafeAreaBottom = useCallback(() => {
    // Try to get CSS environment variable for safe area
    const computedStyle = getComputedStyle(document.documentElement);
    const safeAreaBottomValue = computedStyle.getPropertyValue('env(safe-area-inset-bottom)');
    
    if (safeAreaBottomValue && safeAreaBottomValue !== '0px') {
      return parseInt(safeAreaBottomValue.replace('px', ''), 10) || 0;
    }

    // Fallback: estimate based on device characteristics
    if (state.isIOS && state.isSafari) {
      // Modern iPhones with home indicator typically have ~34px safe area
      const hasHomeIndicator = window.screen.height >= 812; // iPhone X and newer
      return hasHomeIndicator ? 34 : 0;
    }

    return 0;
  }, [state.isIOS, state.isSafari]);

  // Detect navigation bar visibility based on viewport height changes
  const detectNavigationVisibility = useCallback((currentHeight: number, previousHeight: number) => {
    if (!state.isSafari || !state.isIOS) {
      return false; // Not Safari on iOS, navigation bar detection not applicable
    }

    // Safari navigation bar is typically ~44px on iPhone
    const heightDifference = Math.abs(currentHeight - previousHeight);
    const navigationBarThreshold = 40; // Slightly less than 44px to account for variations

    // If viewport height increased significantly, navigation bar likely disappeared
    // If viewport height decreased significantly, navigation bar likely appeared
    return heightDifference > navigationBarThreshold ? currentHeight < previousHeight : state.isNavigationVisible;
  }, [state.isSafari, state.isIOS, state.isNavigationVisible]);

  // Calculate safe positioning for back-to-top button
  const calculateBackToTopOffset = useCallback((isNavigationVisible: boolean, safeAreaBottom: number) => {
    const baseOffset = 32; // Default offset from design
    
    if (!state.isSafari || !state.isIOS) {
      return baseOffset + safeAreaBottom;
    }

    // Add buffer for Safari navigation bar when visible
    const navigationBarBuffer = isNavigationVisible ? 44 : 0;
    const totalOffset = baseOffset + safeAreaBottom + navigationBarBuffer;

    // Ensure minimum offset to prevent conflicts
    return Math.max(totalOffset, 60);
  }, [state.isSafari, state.isIOS]);

  useEffect(() => {
    const browserInfo = detectSafari();
    let previousViewportHeight = window.innerHeight;

    const updateNavigationState = () => {
      const currentViewportHeight = window.innerHeight;
      const safeAreaBottom = getSafeAreaBottom();
      const isNavigationVisible = detectNavigationVisibility(currentViewportHeight, previousViewportHeight);
      const backToTopButtonOffset = calculateBackToTopOffset(isNavigationVisible, safeAreaBottom);

      setState(prevState => ({
        ...prevState,
        ...browserInfo,
        viewportHeight: currentViewportHeight,
        safeAreaBottom,
        isNavigationVisible,
        backToTopButtonOffset,
      }));

      previousViewportHeight = currentViewportHeight;
    };

    // Initial state calculation
    updateNavigationState();

    // Monitor viewport height changes for navigation bar detection
    const handleResize = () => {
      updateNavigationState();
    };

    const handleOrientationChange = () => {
      // Delay to allow orientation change to complete
      setTimeout(updateNavigationState, 100);
    };

    // Monitor scroll events for navigation bar behavior
    const handleScroll = () => {
      // On iOS Safari, navigation bar behavior can be affected by scroll direction
      // Update state to ensure accurate detection
      updateNavigationState();
    };

    // Throttle scroll events for performance
    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100); // Less frequent than resize
    };

    // Add event listeners
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
    
    // Only add scroll listener for Safari on iOS
    if (browserInfo.isSafari && browserInfo.isIOS) {
      window.addEventListener('scroll', throttledScroll, { passive: true });
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (browserInfo.isSafari && browserInfo.isIOS) {
        window.removeEventListener('scroll', throttledScroll);
      }
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []); // Empty dependency array since we use callbacks and don't want to re-run on state changes

  return state;
};