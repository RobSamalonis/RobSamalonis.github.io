import { createTheme, ThemeOptions } from '@mui/material/styles';

// Color palette based on emo/scene aesthetic from design document
const colorPalette = {
  primary: {
    black: '#000000',
    darkGray: '#1a1a1a',
    mediumGray: '#2d2d2d',
  },
  accent: {
    electricBlue: '#00ffff',
    hotPink: '#ff1493',
    neonGreen: '#39ff14',
    vibrantPurple: '#8a2be2',
    brightOrange: '#ff4500',
  },
  neutral: {
    white: '#ffffff',
    lightGray: '#cccccc',
    mediumGray: '#666666',
  },
};

// Typography configuration
const typography = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontWeight: 700,
    fontSize: '3.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontWeight: 600,
    fontSize: '2.75rem',
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontWeight: 600,
    fontSize: '2.25rem',
    lineHeight: 1.4,
  },
  h4: {
    fontWeight: 500,
    fontSize: '1.75rem',
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 500,
    fontSize: '1.5rem',
    lineHeight: 1.5,
  },
  h6: {
    fontWeight: 500,
    fontSize: '1.25rem',
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
};

// Custom breakpoints for responsive design
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

// Spacing configuration
const spacing = 8; // Base spacing unit in pixels

// Theme options configuration
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: colorPalette.accent.electricBlue,
      dark: '#00cccc',
      light: '#33ffff',
      contrastText: colorPalette.primary.black,
    },
    secondary: {
      main: colorPalette.accent.hotPink,
      dark: '#cc1075',
      light: '#ff47a3',
      contrastText: colorPalette.neutral.white,
    },
    error: {
      main: colorPalette.accent.brightOrange,
      dark: '#cc3700',
      light: '#ff6633',
    },
    warning: {
      main: colorPalette.accent.neonGreen,
      dark: '#2dcc11',
      light: '#5cff47',
    },
    info: {
      main: colorPalette.accent.vibrantPurple,
      dark: '#6e22b8',
      light: '#a055e8',
    },
    success: {
      main: colorPalette.accent.neonGreen,
      dark: '#2dcc11',
      light: '#5cff47',
    },
    background: {
      default: colorPalette.primary.black,
      paper: colorPalette.primary.darkGray,
    },
    text: {
      primary: colorPalette.neutral.white,
      secondary: colorPalette.neutral.lightGray,
      disabled: colorPalette.neutral.mediumGray,
    },
    divider: colorPalette.primary.mediumGray,
  },
  typography,
  breakpoints,
  spacing,
  shape: {
    borderRadius: 8,
  },
  components: {
    // Button component customization
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '12px 24px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px rgba(0, 255, 255, 0.3)`,
          },
        },
        contained: {
          boxShadow: `0 4px 15px rgba(0, 255, 255, 0.2)`,
          '&:hover': {
            boxShadow: `0 8px 25px rgba(0, 255, 255, 0.4)`,
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(0, 255, 255, 0.1)',
          },
        },
      },
    },
    // Card component customization
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colorPalette.primary.darkGray,
          border: `1px solid ${colorPalette.primary.mediumGray}`,
          borderRadius: 12,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 30px rgba(0, 255, 255, 0.15)`,
            borderColor: colorPalette.accent.electricBlue,
          },
        },
      },
    },
    // AppBar component customization
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${colorPalette.primary.mediumGray}`,
        },
      },
    },
    // Paper component customization
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colorPalette.primary.darkGray,
          border: `1px solid ${colorPalette.primary.mediumGray}`,
        },
      },
    },
    // TextField component customization
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: colorPalette.primary.mediumGray,
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: colorPalette.accent.electricBlue,
            },
            '&.Mui-focused fieldset': {
              borderColor: colorPalette.accent.electricBlue,
              boxShadow: `0 0 10px rgba(0, 255, 255, 0.3)`,
            },
          },
        },
      },
    },
  },
};

// Create and export the theme
export const theme = createTheme(themeOptions);

// Export color palette for use in other components
export { colorPalette };

// Type augmentation for custom theme properties
declare module '@mui/material/styles' {
  interface Palette {
    accent: {
      electricBlue: string;
      hotPink: string;
      neonGreen: string;
      vibrantPurple: string;
      brightOrange: string;
    };
  }

  interface PaletteOptions {
    accent?: {
      electricBlue?: string;
      hotPink?: string;
      neonGreen?: string;
      vibrantPurple?: string;
      brightOrange?: string;
    };
  }
}