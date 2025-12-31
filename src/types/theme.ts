import { Theme } from '@mui/material/styles';

// Color palette interface
export interface ColorPalette {
  primary: {
    black: string;
    darkGray: string;
    mediumGray: string;
  };
  accent: {
    electricBlue: string;
    hotPink: string;
    neonGreen: string;
    vibrantPurple: string;
    brightOrange: string;
  };
  neutral: {
    white: string;
    lightGray: string;
    mediumGray: string;
  };
}

// Typography interface
export interface Typography {
  fonts: {
    primary: string;
    heading: string;
    code: string;
  };
  sizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
}

// Extended theme interface
export interface CustomTheme extends Theme {
  colorPalette: ColorPalette;
}

// Breakpoint values interface
export interface BreakpointValues {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}