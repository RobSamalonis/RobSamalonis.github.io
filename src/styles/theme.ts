import { createTheme, ThemeOptions } from '@mui/material/styles';

// CSS Custom Properties System
// These values match the CSS variables defined in index.css
export const cssVariables = {
  colors: {
    primary: {
      black: 'var(--color-primary-black)',
      darkGray: 'var(--color-primary-dark-gray)',
      charcoal: 'var(--color-primary-charcoal)',
    },
    accent: {
      electricBlue: 'var(--color-accent-electric-blue)',
      hotPink: 'var(--color-accent-hot-pink)',
      neonGreen: 'var(--color-accent-neon-green)',
      vibrantPurple: 'var(--color-accent-vibrant-purple)',
    },
    neutral: {
      white: 'var(--color-neutral-white)',
      gray100: 'var(--color-neutral-gray-100)',
      gray200: 'var(--color-neutral-gray-200)',
      gray300: 'var(--color-neutral-gray-300)',
      gray400: 'var(--color-neutral-gray-400)',
      gray500: 'var(--color-neutral-gray-500)',
      gray600: 'var(--color-neutral-gray-600)',
      gray700: 'var(--color-neutral-gray-700)',
      gray800: 'var(--color-neutral-gray-800)',
      gray900: 'var(--color-neutral-gray-900)',
    },
    semantic: {
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
      info: 'var(--color-info)',
    },
  },
  spacing: {
    base: 'var(--spacing-base)',
    xs: 'var(--spacing-xs)',
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
    lg: 'var(--spacing-lg)',
    xl: 'var(--spacing-xl)',
    '2xl': 'var(--spacing-2xl)',
    '3xl': 'var(--spacing-3xl)',
    '4xl': 'var(--spacing-4xl)',
  },
  typography: {
    fontFamily: {
      primary: 'var(--font-family-primary)',
      heading: 'var(--font-family-heading)',
      mono: 'var(--font-family-mono)',
    },
    fontSize: {
      xs: 'var(--font-size-xs)',
      sm: 'var(--font-size-sm)',
      base: 'var(--font-size-base)',
      lg: 'var(--font-size-lg)',
      xl: 'var(--font-size-xl)',
      '2xl': 'var(--font-size-2xl)',
      '3xl': 'var(--font-size-3xl)',
      '4xl': 'var(--font-size-4xl)',
    },
    lineHeight: {
      xs: 'var(--line-height-xs)',
      sm: 'var(--line-height-sm)',
      base: 'var(--line-height-base)',
      lg: 'var(--line-height-lg)',
      xl: 'var(--line-height-xl)',
      '2xl': 'var(--line-height-2xl)',
      '3xl': 'var(--line-height-3xl)',
      '4xl': 'var(--line-height-4xl)',
    },
    letterSpacing: {
      xs: 'var(--letter-spacing-xs)',
      sm: 'var(--letter-spacing-sm)',
      base: 'var(--letter-spacing-base)',
      lg: 'var(--letter-spacing-lg)',
      xl: 'var(--letter-spacing-xl)',
      '2xl': 'var(--letter-spacing-2xl)',
      '3xl': 'var(--letter-spacing-3xl)',
      '4xl': 'var(--letter-spacing-4xl)',
    },
    fontWeight: {
      light: 'var(--font-weight-light)',
      regular: 'var(--font-weight-regular)',
      medium: 'var(--font-weight-medium)',
      semibold: 'var(--font-weight-semibold)',
      bold: 'var(--font-weight-bold)',
      extrabold: 'var(--font-weight-extrabold)',
    },
  },
  shadows: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
    '2xl': 'var(--shadow-2xl)',
    inner: 'var(--shadow-inner)',
    glow: {
      blue: 'var(--glow-blue)',
      pink: 'var(--glow-pink)',
      green: 'var(--glow-green)',
      purple: 'var(--glow-purple)',
    },
  },
  animations: {
    duration: {
      fast: 'var(--duration-fast)',
      normal: 'var(--duration-normal)',
      slow: 'var(--duration-slow)',
      slower: 'var(--duration-slower)',
    },
    easing: {
      easeIn: 'var(--easing-ease-in)',
      easeOut: 'var(--easing-ease-out)',
      easeInOut: 'var(--easing-ease-in-out)',
      spring: 'var(--easing-spring)',
    },
  },
  breakpoints: {
    xs: 'var(--breakpoint-xs)',
    sm: 'var(--breakpoint-sm)',
    md: 'var(--breakpoint-md)',
    lg: 'var(--breakpoint-lg)',
    xl: 'var(--breakpoint-xl)',
    '2xl': 'var(--breakpoint-2xl)',
  },
};

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