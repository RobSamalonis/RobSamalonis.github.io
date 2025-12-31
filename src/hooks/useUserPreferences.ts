import { useState, useEffect } from 'react';
import { UserPreferences } from '../utils/accessibility';

export interface UserPreferenceState {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersDarkMode: boolean;
}

/**
 * Hook for managing user accessibility and visual preferences
 * Automatically detects and responds to system preference changes
 */
export const useUserPreferences = (): UserPreferenceState => {
  const [preferences, setPreferences] = useState<UserPreferenceState>({
    prefersReducedMotion: UserPreferences.prefersReducedMotion(),
    prefersHighContrast: UserPreferences.prefersHighContrast(),
    prefersDarkMode: UserPreferences.prefersDarkMode(),
  });

  useEffect(() => {
    // Set up listeners for preference changes
    const cleanupReducedMotion = UserPreferences.onPreferenceChange(
      'reduced-motion',
      (matches) => {
        setPreferences(prev => ({ ...prev, prefersReducedMotion: matches }));
      }
    );

    const cleanupHighContrast = UserPreferences.onPreferenceChange(
      'high-contrast',
      (matches) => {
        setPreferences(prev => ({ ...prev, prefersHighContrast: matches }));
      }
    );

    const cleanupDarkMode = UserPreferences.onPreferenceChange(
      'dark-mode',
      (matches) => {
        setPreferences(prev => ({ ...prev, prefersDarkMode: matches }));
      }
    );

    // Cleanup listeners on unmount
    return () => {
      cleanupReducedMotion();
      cleanupHighContrast();
      cleanupDarkMode();
    };
  }, []);

  return preferences;
};

/**
 * Hook for getting animation configuration based on user preferences
 */
export const useAnimationConfig = () => {
  const { prefersReducedMotion } = useUserPreferences();

  return {
    // Disable or reduce animations based on user preference
    enableAnimations: !prefersReducedMotion,
    
    // Reduced animation durations
    duration: prefersReducedMotion ? 0.1 : 0.3,
    
    // Simplified easing for reduced motion
    easing: prefersReducedMotion ? 'linear' : 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Disable complex transforms
    enableComplexTransforms: !prefersReducedMotion,
    
    // Disable particle effects
    enableParticles: !prefersReducedMotion,
    
    // Reduce spring stiffness
    springStiffness: prefersReducedMotion ? 200 : 400,
    springDamping: prefersReducedMotion ? 40 : 25,
  };
};

/**
 * Hook for getting contrast configuration based on user preferences
 */
export const useContrastConfig = () => {
  const { prefersHighContrast } = useUserPreferences();

  return {
    // Enhanced contrast ratios
    contrastMultiplier: prefersHighContrast ? 1.5 : 1,
    
    // Stronger borders and outlines
    borderWidth: prefersHighContrast ? 2 : 1,
    
    // Enhanced focus indicators
    focusOutlineWidth: prefersHighContrast ? 4 : 2,
    
    // Reduced transparency
    backgroundOpacity: prefersHighContrast ? 0.95 : 0.8,
    
    // Stronger shadows
    shadowIntensity: prefersHighContrast ? 0.3 : 0.1,
  };
};