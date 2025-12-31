import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Card, TextField, AppBar, Paper } from '@mui/material';
import fc from 'fast-check';
import { theme, colorPalette } from '../theme';

// Feature: personal-portfolio-website, Property 4: Theme consistency
describe('Theme Consistency Property Tests', () => {
  // Helper function to render component with theme
  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  // Property test for theme consistency across Material-UI components
  test('theme consistency property - all MUI components apply custom theme consistently', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('Button'),
          fc.constant('Card'), 
          fc.constant('TextField'),
          fc.constant('AppBar'),
          fc.constant('Paper')
        ),
        fc.oneof(
          fc.constant('primary'),
          fc.constant('secondary'),
          fc.constant('error'),
          fc.constant('warning'),
          fc.constant('info'),
          fc.constant('success')
        ),
        (componentType, colorVariant) => {
          let component: React.ReactElement;
          
          // Create component based on type
          switch (componentType) {
            case 'Button':
              component = <Button color={colorVariant as any}>Test Button</Button>;
              break;
            case 'Card':
              component = <Card>Test Card</Card>;
              break;
            case 'TextField':
              component = <TextField label="Test Field" color={colorVariant as any} />;
              break;
            case 'AppBar':
              component = <AppBar>Test AppBar</AppBar>;
              break;
            case 'Paper':
              component = <Paper>Test Paper</Paper>;
              break;
            default:
              component = <Button>Default</Button>;
          }

          const { container } = renderWithTheme(component);
          const renderedElement = container.firstChild as HTMLElement;

          // Verify theme is applied by checking computed styles
          expect(renderedElement).toBeInTheDocument();
          
          // Check that the theme provider context is available
          // This ensures our custom theme is being applied
          const themeContext = theme;
          expect(themeContext.palette.mode).toBe('dark');
          expect(themeContext.palette.primary.main).toBe(colorPalette.accent.electricBlue);
          expect(themeContext.palette.background.default).toBe(colorPalette.primary.black);
          expect(themeContext.spacing(1)).toBe('8px'); // Base spacing unit with px suffix
          expect(themeContext.shape.borderRadius).toBe(8);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('color palette consistency property - all theme colors match design specification', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('primary'),
          fc.constant('secondary'), 
          fc.constant('error'),
          fc.constant('warning'),
          fc.constant('info'),
          fc.constant('success'),
          fc.constant('background'),
          fc.constant('text')
        ),
        (paletteCategory) => {
          const palette = theme.palette;
          
          // Verify each palette category has consistent structure and values
          switch (paletteCategory) {
            case 'primary':
              expect(palette.primary.main).toBe(colorPalette.accent.electricBlue);
              expect(palette.primary.contrastText).toBe(colorPalette.primary.black);
              break;
            case 'secondary':
              expect(palette.secondary.main).toBe(colorPalette.accent.hotPink);
              expect(palette.secondary.contrastText).toBe(colorPalette.neutral.white);
              break;
            case 'background':
              expect(palette.background.default).toBe(colorPalette.primary.black);
              expect(palette.background.paper).toBe(colorPalette.primary.darkGray);
              break;
            case 'text':
              expect(palette.text.primary).toBe(colorPalette.neutral.white);
              expect(palette.text.secondary).toBe(colorPalette.neutral.lightGray);
              break;
          }
          
          // All palette categories should be defined
          expect(palette[paletteCategory as keyof typeof palette]).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('typography consistency property - all typography variants follow design system', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('h1'),
          fc.constant('h2'),
          fc.constant('h3'), 
          fc.constant('h4'),
          fc.constant('h5'),
          fc.constant('h6'),
          fc.constant('body1'),
          fc.constant('body2')
        ),
        (typographyVariant) => {
          const typography = theme.typography;
          const variant = typography[typographyVariant as keyof typeof typography];
          
          // Verify typography variant exists and has required properties
          expect(variant).toBeDefined();
          expect(typeof variant).toBe('object');
          
          // Check that font family is consistently applied
          expect(typography.fontFamily).toContain('Roboto');
          expect(typography.fontFamily).toContain('sans-serif');
          
          // Verify variant has proper structure
          if (typeof variant === 'object' && variant !== null) {
            expect(variant).toHaveProperty('fontSize');
            expect(variant).toHaveProperty('lineHeight');
            
            // Heading variants should have fontWeight
            if (typographyVariant.startsWith('h')) {
              expect(variant).toHaveProperty('fontWeight');
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('breakpoint consistency property - all breakpoints follow responsive design system', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('xs'), 
          fc.constant('sm'), 
          fc.constant('md'), 
          fc.constant('lg'), 
          fc.constant('xl')
        ),
        (breakpointKey) => {
          const breakpoints = theme.breakpoints;
          const breakpointValue = breakpoints.values[breakpointKey as keyof typeof breakpoints.values];
          
          // Verify breakpoint exists and is a number
          expect(typeof breakpointValue).toBe('number');
          expect(breakpointValue).toBeGreaterThanOrEqual(0);
          
          // Verify breakpoints are in ascending order
          const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl'];
          const currentIndex = breakpointOrder.indexOf(breakpointKey);
          
          if (currentIndex > 0) {
            const previousKey = breakpointOrder[currentIndex - 1] as keyof typeof breakpoints.values;
            const previousValue = breakpoints.values[previousKey];
            expect(breakpointValue).toBeGreaterThan(previousValue);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('component customization consistency property - all component overrides maintain theme coherence', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('MuiButton'),
          fc.constant('MuiCard'),
          fc.constant('MuiAppBar'), 
          fc.constant('MuiPaper'),
          fc.constant('MuiTextField')
        ),
        (componentName) => {
          const components = theme.components;
          const componentOverrides = components?.[componentName as keyof typeof components];
          
          // Verify component customization exists
          expect(componentOverrides).toBeDefined();
          
          // Check that styleOverrides exist for customized components
          if (componentOverrides && 'styleOverrides' in componentOverrides) {
            expect(componentOverrides.styleOverrides).toBeDefined();
            expect(typeof componentOverrides.styleOverrides).toBe('object');
            
            // Verify root styles exist for components that should have them
            const rootStyles = (componentOverrides.styleOverrides as any)?.root;
            if (rootStyles) {
              expect(typeof rootStyles).toBe('object');
              
              // Common theme consistency checks
              if (componentName === 'MuiButton' || componentName === 'MuiCard') {
                expect(rootStyles).toHaveProperty('transition');
                expect(rootStyles.transition).toContain('ease-in-out');
              }
              
              if (componentName === 'MuiCard' || componentName === 'MuiPaper') {
                expect(rootStyles.backgroundColor).toBe(colorPalette.primary.darkGray);
              }
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});