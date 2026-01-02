import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import fc from 'fast-check';
import { theme } from '../../../styles/theme';
import Hero from '../Hero';
import Resume from '../Resume';
import Contact from '../Contact';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const mockMotion = (component: any) => {
    return ({ children, ...props }: any) => {
      const {
        whileInView,
        whileHover,
        whileTap,
        animate,
        transition,
        initial,
        exit,
        variants,
        drag,
        dragConstraints,
        dragElastic,
        dragMomentum,
        onDragStart,
        onDragEnd,
        onDrag,
        layout,
        layoutId,
        style,
        ...domProps
      } = props;
      
      return React.createElement(component, { ...domProps, style }, children);
    };
  };
  
  const mockMotionComponent = (component: string) => mockMotion(component);
  
  return {
    motion: Object.assign(
      mockMotionComponent,
      {
        div: mockMotion('div'),
        section: mockMotion('section'),
        button: mockMotion('button'),
        span: mockMotion('span'),
        a: mockMotion('a'),
        h1: mockMotion('h1'),
        h2: mockMotion('h2'),
        h3: mockMotion('h3'),
        h4: mockMotion('h4'),
        h5: mockMotion('h5'),
        h6: mockMotion('h6'),
        p: mockMotion('p'),
        ul: mockMotion('ul'),
        li: mockMotion('li'),
        form: mockMotion('form'),
        input: mockMotion('input'),
        textarea: mockMotion('textarea'),
      }
    ),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useInView: () => true,
    useScroll: () => ({ scrollY: { get: () => 0 }, scrollYProgress: { get: () => 0 } }),
    useTransform: () => ({ get: () => 0 }),
    useMotionValue: () => ({ get: () => 0, set: jest.fn() }),
    useSpring: (value: any) => value,
  };
});

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Helper to render with theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

// Helper to mock viewport
const mockViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });

  window.matchMedia = jest.fn().mockImplementation((query: string) => {
    const breakpoints = {
      '(min-width: 1920px)': width >= 1920,
      '(min-width: 1280px)': width >= 1280,
      '(min-width: 960px)': width >= 960,
      '(min-width: 600px)': width >= 600,
      '(max-width: 1919px)': width < 1920,
      '(max-width: 1279px)': width < 1280,
      '(max-width: 959px)': width < 960,
      '(max-width: 599px)': width < 600,
    };

    const matches = breakpoints[query as keyof typeof breakpoints] ?? false;
    
    return {
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  });
};

// Feature: portfolio-ux-refinements, Property 13: Responsive typography and spacing
describe('Responsive Typography and Spacing Property Tests', () => {
  beforeEach(() => {
    cleanup();
    mockIntersectionObserver.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  // Property 13: Responsive typography and spacing
  // For any breakpoint, spacing and typography values should scale appropriately according to the responsive configuration
  test('typography scales appropriately across different breakpoints', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 320, max: 1920 }),
          height: fc.integer({ min: 568, max: 1080 }),
        }),
        fc.constantFrom('Hero', 'Resume', 'Contact'),
        (viewport, componentType) => {
          mockViewport(viewport.width, viewport.height);

          let component: React.ReactElement;
          switch (componentType) {
            case 'Hero':
              component = <Hero />;
              break;
            case 'Resume':
              component = <Resume />;
              break;
            case 'Contact':
              component = <Contact />;
              break;
            default:
              component = <Hero />;
          }

          const { container, unmount } = renderWithTheme(component);

          // Property: Headings should scale appropriately with viewport
          const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
          headings.forEach(heading => {
            const htmlHeading = heading as HTMLElement;
            const computedStyle = window.getComputedStyle(htmlHeading);
            const fontSize = parseFloat(computedStyle.fontSize);
            
            // Only check visible headings with actual content
            const hasTextContent = htmlHeading.textContent?.trim();
            const isVisible = 
              computedStyle.display !== 'none' &&
              computedStyle.visibility !== 'hidden' &&
              parseFloat(computedStyle.opacity) > 0.1;
            
            const isDecorative = 
              htmlHeading.getAttribute('aria-hidden') === 'true' ||
              htmlHeading.closest('[aria-hidden="true"]');
            
            if (fontSize > 0 && hasTextContent && hasTextContent.length > 2 && isVisible && !isDecorative) {
              const tagName = htmlHeading.tagName.toLowerCase();
              
              // Define minimum font sizes based on viewport and heading level
              let minFontSize = 14;
              
              if (viewport.width < 600) {
                // Mobile
                switch (tagName) {
                  case 'h1':
                    minFontSize = 24;
                    break;
                  case 'h2':
                    minFontSize = 20;
                    break;
                  case 'h3':
                    minFontSize = 18;
                    break;
                  case 'h4':
                    minFontSize = 16;
                    break;
                  case 'h5':
                  case 'h6':
                    minFontSize = 14;
                    break;
                }
              } else if (viewport.width < 960) {
                // Tablet
                switch (tagName) {
                  case 'h1':
                    minFontSize = 32;
                    break;
                  case 'h2':
                    minFontSize = 24;
                    break;
                  case 'h3':
                    minFontSize = 20;
                    break;
                  case 'h4':
                    minFontSize = 18;
                    break;
                  case 'h5':
                  case 'h6':
                    minFontSize = 16;
                    break;
                }
              } else {
                // Desktop
                switch (tagName) {
                  case 'h1':
                    minFontSize = 36;
                    break;
                  case 'h2':
                    minFontSize = 28;
                    break;
                  case 'h3':
                    minFontSize = 24;
                    break;
                  case 'h4':
                    minFontSize = 20;
                    break;
                  case 'h5':
                    minFontSize = 18;
                    break;
                  case 'h6':
                    minFontSize = 16;
                    break;
                }
              }
              
              expect(fontSize).toBeGreaterThanOrEqual(minFontSize);
            }
          });

          // Property: Body text should have readable font sizes
          const bodyText = container.querySelectorAll('p, span, a, li');
          bodyText.forEach(text => {
            const htmlText = text as HTMLElement;
            const computedStyle = window.getComputedStyle(htmlText);
            const fontSize = parseFloat(computedStyle.fontSize);
            
            const hasTextContent = htmlText.textContent?.trim();
            const isVisible = 
              computedStyle.display !== 'none' &&
              computedStyle.visibility !== 'hidden' &&
              parseFloat(computedStyle.opacity) > 0;
            
            if (fontSize > 0 && hasTextContent && hasTextContent.length > 1 && isVisible) {
              // Body text should be at least 12px (very lenient for edge cases)
              expect(fontSize).toBeGreaterThanOrEqual(12);
            }
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('spacing scales appropriately across different breakpoints', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 320, max: 1920 }),
          height: fc.integer({ min: 568, max: 1080 }),
        }),
        (viewport) => {
          mockViewport(viewport.width, viewport.height);

          const components = [<Hero />, <Resume />, <Contact />];
          
          components.forEach(component => {
            const { container, unmount } = renderWithTheme(component);

            // Property: Sections should have appropriate padding based on viewport
            const sections = container.querySelectorAll('section');
            sections.forEach(section => {
              const computedStyle = window.getComputedStyle(section);
              const paddingTop = parseFloat(computedStyle.paddingTop);
              const paddingBottom = parseFloat(computedStyle.paddingBottom);
              
              // Sections should have some vertical padding
              if (paddingTop > 0 || paddingBottom > 0) {
                const totalVerticalPadding = paddingTop + paddingBottom;
                
                // Minimum padding should be at least 16px total
                expect(totalVerticalPadding).toBeGreaterThanOrEqual(16);
                
                // On larger screens, padding should generally be larger
                if (viewport.width >= 1280) {
                  // Desktop should have more generous padding
                  expect(totalVerticalPadding).toBeGreaterThanOrEqual(32);
                }
              }
            });

            // Property: Spacing between elements should be consistent
            const containers = container.querySelectorAll('[class*="MuiContainer"], [class*="MuiBox"]');
            containers.forEach(containerEl => {
              const computedStyle = window.getComputedStyle(containerEl);
              const marginTop = parseFloat(computedStyle.marginTop);
              const marginBottom = parseFloat(computedStyle.marginBottom);
              
              // Margins should be reasonable (not excessively large)
              if (marginTop > 0) {
                expect(marginTop).toBeLessThan(viewport.height * 0.5);
              }
              if (marginBottom > 0) {
                expect(marginBottom).toBeLessThan(viewport.height * 0.5);
              }
            });

            unmount();
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('line height scales appropriately with font size', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 320, max: 1920 }),
          height: fc.integer({ min: 568, max: 1080 }),
        }),
        fc.constantFrom('Hero', 'Resume', 'Contact'),
        (viewport, componentType) => {
          mockViewport(viewport.width, viewport.height);

          let component: React.ReactElement;
          switch (componentType) {
            case 'Hero':
              component = <Hero />;
              break;
            case 'Resume':
              component = <Resume />;
              break;
            case 'Contact':
              component = <Contact />;
              break;
            default:
              component = <Hero />;
          }

          const { container, unmount } = renderWithTheme(component);

          // Property: Line height should be proportional to font size
          const textElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, li');
          textElements.forEach(element => {
            const htmlElement = element as HTMLElement;
            const computedStyle = window.getComputedStyle(htmlElement);
            const fontSize = parseFloat(computedStyle.fontSize);
            const lineHeight = parseFloat(computedStyle.lineHeight);
            
            const hasTextContent = htmlElement.textContent?.trim();
            const isVisible = 
              computedStyle.display !== 'none' &&
              computedStyle.visibility !== 'hidden' &&
              parseFloat(computedStyle.opacity) > 0;
            
            if (fontSize > 0 && lineHeight > 0 && hasTextContent && hasTextContent.length > 1 && isVisible) {
              // Line height should be at least equal to font size
              expect(lineHeight).toBeGreaterThanOrEqual(fontSize);
              
              // Line height should not be excessively large (max 3x font size)
              expect(lineHeight).toBeLessThanOrEqual(fontSize * 3);
            }
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('button and interactive element sizing scales with viewport', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 320, max: 1920 }),
          height: fc.integer({ min: 568, max: 1080 }),
        }),
        (viewport) => {
          mockViewport(viewport.width, viewport.height);

          const components = [<Hero />, <Contact />];
          
          components.forEach(component => {
            const { container, unmount } = renderWithTheme(component);

            // Property: Buttons should have appropriate sizing based on viewport
            const buttons = container.querySelectorAll('button');
            buttons.forEach(button => {
              const htmlButton = button as HTMLElement;
              const rect = htmlButton.getBoundingClientRect();
              const computedStyle = window.getComputedStyle(htmlButton);
              
              const isVisible = 
                computedStyle.display !== 'none' &&
                computedStyle.visibility !== 'hidden' &&
                parseFloat(computedStyle.opacity) > 0;
              
              if (rect.width > 0 && rect.height > 0 && isVisible) {
                // Buttons should meet minimum touch target size on mobile
                if (viewport.width < 768) {
                  expect(rect.height).toBeGreaterThanOrEqual(40);
                  expect(rect.width).toBeGreaterThanOrEqual(40);
                }
                
                // Button text should be readable
                const fontSize = parseFloat(computedStyle.fontSize);
                if (fontSize > 0) {
                  expect(fontSize).toBeGreaterThanOrEqual(12);
                }
              }
            });

            unmount();
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('spacing between sections is consistent and appropriate', () => {
    const viewports = [
      { width: 320, height: 568 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1280, height: 800 },  // Desktop
      { width: 1920, height: 1080 }, // Large desktop
    ];

    viewports.forEach(viewport => {
      mockViewport(viewport.width, viewport.height);

      const { container, unmount } = renderWithTheme(<Resume />);

      // Property: Sections should have consistent spacing
      const sections = container.querySelectorAll('section');
      const spacings: number[] = [];
      
      sections.forEach(section => {
        const computedStyle = window.getComputedStyle(section);
        const paddingTop = parseFloat(computedStyle.paddingTop);
        const paddingBottom = parseFloat(computedStyle.paddingBottom);
        const marginTop = parseFloat(computedStyle.marginTop);
        const marginBottom = parseFloat(computedStyle.marginBottom);
        
        const totalSpacing = paddingTop + paddingBottom + marginTop + marginBottom;
        if (totalSpacing > 0) {
          spacings.push(totalSpacing);
        }
      });

      // If we have multiple sections with spacing, they should be relatively consistent
      if (spacings.length > 1) {
        const avgSpacing = spacings.reduce((a, b) => a + b, 0) / spacings.length;
        
        // Each spacing should be within reasonable range of average
        spacings.forEach(spacing => {
          // Allow for variation but ensure consistency (within 3x of average)
          expect(spacing).toBeLessThanOrEqual(avgSpacing * 3);
          expect(spacing).toBeGreaterThanOrEqual(avgSpacing * 0.3);
        });
      }

      unmount();
    });
  });
});
