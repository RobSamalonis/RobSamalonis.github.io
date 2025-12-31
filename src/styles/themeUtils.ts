import { useTheme } from '@mui/material/styles';
import { colorPalette } from './theme';

// Hook to access the custom theme
export const useCustomTheme = () => {
  const theme = useTheme();
  return {
    ...theme,
    colorPalette,
  };
};

// Utility functions for common theme operations
export const getBreakpointValue = (breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
  const theme = useTheme();
  return theme.breakpoints.values[breakpoint];
};

// Helper function to create responsive values
export const createResponsiveValue = <T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}) => {
  const theme = useTheme();
  return {
    [theme.breakpoints.up('xs')]: values.xs,
    [theme.breakpoints.up('sm')]: values.sm,
    [theme.breakpoints.up('md')]: values.md,
    [theme.breakpoints.up('lg')]: values.lg,
    [theme.breakpoints.up('xl')]: values.xl,
  };
};

// Helper function to get color with opacity
export const getColorWithOpacity = (color: string, opacity: number) => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Common animation durations based on Material Design
export const animationDurations = {
  shortest: 150,
  shorter: 200,
  short: 250,
  standard: 300,
  complex: 375,
  enteringScreen: 225,
  leavingScreen: 195,
};

// Common easing curves
export const easingCurves = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
};