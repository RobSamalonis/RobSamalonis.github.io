import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import fc from 'fast-check';
import { theme } from '../../../styles/theme';
import Resume from '../Resume';

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
    Collapse: ({ children, in: inProp }: { children: React.ReactNode; in: boolean }) => 
      inProp ? <div>{children}</div> : null,
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

// Feature: portfolio-ux-refinements, Property 15: Resume card styling consistency
describe('Resume Card Styling Consistency Property Tests', () => {
  beforeEach(() => {
    cleanup();
    mockIntersectionObserver.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  // Property 15: Resume card styling consistency
  // For any set of resume cards, styling and spacing should be consistent across all cards
  test('resume cards have consistent padding across all cards', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 320, max: 1920 }),
          height: fc.integer({ min: 568, max: 1080 }),
        }),
        (viewport) => {
          mockViewport(viewport.width, viewport.height);

          const { container, unmount } = renderWithTheme(<Resume />);

          // Property: All cards should have consistent padding
          const cards = container.querySelectorAll('[class*="MuiCard"]');
          const cardPaddings: number[] = [];

          cards.forEach(card => {
            const cardContent = card.querySelector('[class*="MuiCardContent"]');
            if (cardContent) {
              const computedStyle = window.getComputedStyle(cardContent);
              const paddingTop = parseFloat(computedStyle.paddingTop);
              const paddingRight = parseFloat(computedStyle.paddingRight);
              const paddingBottom = parseFloat(computedStyle.paddingBottom);
              const paddingLeft = parseFloat(computedStyle.paddingLeft);

              // Store padding values
              if (paddingTop > 0) {
                cardPaddings.push(paddingTop);
              }
            }
          });

          // Property: If we have multiple cards, their padding should be consistent
          if (cardPaddings.length > 1) {
            const firstPadding = cardPaddings[0];
            cardPaddings.forEach(padding => {
              // All cards should have the same padding (or very close due to rounding)
              expect(Math.abs(padding - firstPadding)).toBeLessThanOrEqual(2);
            });
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('resume cards have consistent spacing between cards', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 320, max: 1920 }),
          height: fc.integer({ min: 568, max: 1080 }),
        }),
        (viewport) => {
          mockViewport(viewport.width, viewport.height);

          const { container, unmount } = renderWithTheme(<Resume />);

          // Property: Cards should have consistent margin-bottom spacing
          const cards = container.querySelectorAll('[class*="MuiCard"]');
          const cardMargins: number[] = [];

          cards.forEach(card => {
            const computedStyle = window.getComputedStyle(card);
            const marginBottom = parseFloat(computedStyle.marginBottom);

            if (marginBottom > 0) {
              cardMargins.push(marginBottom);
            }
          });

          // Property: If we have multiple cards with margins, they should be consistent
          if (cardMargins.length > 1) {
            const firstMargin = cardMargins[0];
            cardMargins.forEach(margin => {
              // All cards should have the same margin (or very close)
              expect(Math.abs(margin - firstMargin)).toBeLessThanOrEqual(2);
            });
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('resume cards have consistent border styling', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 320, max: 1920 }),
          height: fc.integer({ min: 568, max: 1080 }),
        }),
        (viewport) => {
          mockViewport(viewport.width, viewport.height);

          const { container, unmount } = renderWithTheme(<Resume />);

          // Property: All cards should have borders
          const cards = container.querySelectorAll('[class*="MuiCard"]');
          const borderWidths: number[] = [];
          const borderStyles: string[] = [];

          cards.forEach(card => {
            const computedStyle = window.getComputedStyle(card);
            const borderWidth = parseFloat(computedStyle.borderWidth);
            const borderStyle = computedStyle.borderStyle;

            if (borderWidth > 0) {
              borderWidths.push(borderWidth);
              borderStyles.push(borderStyle);
            }
          });

          // Property: All cards should have the same border width
          if (borderWidths.length > 1) {
            const firstBorderWidth = borderWidths[0];
            borderWidths.forEach(width => {
              expect(width).toBe(firstBorderWidth);
            });
          }

          // Property: All cards should have the same border style
          if (borderStyles.length > 1) {
            const firstBorderStyle = borderStyles[0];
            borderStyles.forEach(style => {
              expect(style).toBe(firstBorderStyle);
            });
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('resume cards have consistent border radius', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 320, max: 1920 }),
          height: fc.integer({ min: 568, max: 1080 }),
        }),
        (viewport) => {
          mockViewport(viewport.width, viewport.height);

          const { container, unmount } = renderWithTheme(<Resume />);

          // Property: All cards should have consistent border radius
          const cards = container.querySelectorAll('[class*="MuiCard"]');
          const borderRadii: string[] = [];

          cards.forEach(card => {
            const computedStyle = window.getComputedStyle(card);
            const borderRadius = computedStyle.borderRadius;

            if (borderRadius && borderRadius !== '0px') {
              borderRadii.push(borderRadius);
            }
          });

          // Property: All cards should have the same border radius
          if (borderRadii.length > 1) {
            const firstBorderRadius = borderRadii[0];
            borderRadii.forEach(radius => {
              expect(radius).toBe(firstBorderRadius);
            });
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('resume cards maintain consistent typography scaling', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 320, max: 1920 }),
          height: fc.integer({ min: 568, max: 1080 }),
        }),
        (viewport) => {
          mockViewport(viewport.width, viewport.height);

          const { container, unmount } = renderWithTheme(<Resume />);

          // Property: All position titles (h3) should have consistent font size
          const positionTitles = container.querySelectorAll('h3');
          const h3FontSizes: number[] = [];

          positionTitles.forEach(title => {
            const computedStyle = window.getComputedStyle(title);
            const fontSize = parseFloat(computedStyle.fontSize);

            if (fontSize > 0) {
              h3FontSizes.push(fontSize);
            }
          });

          // Property: All h3 elements should have the same font size
          if (h3FontSizes.length > 1) {
            const firstFontSize = h3FontSizes[0];
            h3FontSizes.forEach(fontSize => {
              // Allow for small rounding differences
              expect(Math.abs(fontSize - firstFontSize)).toBeLessThanOrEqual(1);
            });
          }

          // Property: All company names (h4) should have consistent font size
          const companyNames = container.querySelectorAll('h4');
          const h4FontSizes: number[] = [];

          companyNames.forEach(name => {
            const computedStyle = window.getComputedStyle(name);
            const fontSize = parseFloat(computedStyle.fontSize);

            if (fontSize > 0) {
              h4FontSizes.push(fontSize);
            }
          });

          // Property: All h4 elements should have the same font size
          if (h4FontSizes.length > 1) {
            const firstFontSize = h4FontSizes[0];
            h4FontSizes.forEach(fontSize => {
              expect(Math.abs(fontSize - firstFontSize)).toBeLessThanOrEqual(1);
            });
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('mobile cards have generous padding (20-24px)', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 320, max: 767 }), // Mobile range
          height: fc.integer({ min: 568, max: 1024 }),
        }),
        (viewport) => {
          mockViewport(viewport.width, viewport.height);

          const { container, unmount } = renderWithTheme(<Resume />);

          // Property: Mobile cards should have generous padding (20-24px)
          const cards = container.querySelectorAll('[class*="MuiCard"]');

          cards.forEach(card => {
            const cardContent = card.querySelector('[class*="MuiCardContent"]');
            if (cardContent) {
              const computedStyle = window.getComputedStyle(cardContent);
              const paddingTop = parseFloat(computedStyle.paddingTop);
              const paddingRight = parseFloat(computedStyle.paddingRight);
              const paddingBottom = parseFloat(computedStyle.paddingBottom);
              const paddingLeft = parseFloat(computedStyle.paddingLeft);

              // Property: Mobile padding should be at least 20px
              if (paddingTop > 0) {
                expect(paddingTop).toBeGreaterThanOrEqual(20);
              }
              if (paddingRight > 0) {
                expect(paddingRight).toBeGreaterThanOrEqual(20);
              }
              if (paddingBottom > 0) {
                expect(paddingBottom).toBeGreaterThanOrEqual(20);
              }
              if (paddingLeft > 0) {
                expect(paddingLeft).toBeGreaterThanOrEqual(20);
              }
            }
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('cards maintain consistent styling across viewport changes', () => {
    const viewports = [
      { width: 320, height: 568 },   // Small mobile
      { width: 375, height: 667 },   // Medium mobile
      { width: 414, height: 896 },   // Large mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1280, height: 800 },  // Desktop
    ];

    viewports.forEach(viewport => {
      mockViewport(viewport.width, viewport.height);

      const { container, unmount } = renderWithTheme(<Resume />);

      // Property: Cards should maintain consistent styling at each breakpoint
      const cards = container.querySelectorAll('[class*="MuiCard"]');

      // Should have at least some cards
      expect(cards.length).toBeGreaterThan(0);

      // Property: All cards should have consistent border styling
      const borderWidths: number[] = [];
      const borderRadii: string[] = [];

      cards.forEach(card => {
        const computedStyle = window.getComputedStyle(card);

        // Collect border widths
        const borderWidth = parseFloat(computedStyle.borderWidth);
        if (borderWidth > 0) {
          borderWidths.push(borderWidth);
        }

        // Collect border radii
        const borderRadius = computedStyle.borderRadius;
        if (borderRadius && borderRadius !== '0px') {
          borderRadii.push(borderRadius);
        }
      });

      // Property: All cards at this viewport should have consistent border widths
      if (borderWidths.length > 1) {
        const firstBorderWidth = borderWidths[0];
        borderWidths.forEach(width => {
          expect(width).toBe(firstBorderWidth);
        });
      }

      // Property: All cards at this viewport should have consistent border radii
      if (borderRadii.length > 1) {
        const firstBorderRadius = borderRadii[0];
        borderRadii.forEach(radius => {
          expect(radius).toBe(firstBorderRadius);
        });
      }

      unmount();
    });
  });

  test('chip styling is consistent across all cards', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 320, max: 1920 }),
          height: fc.integer({ min: 568, max: 1080 }),
        }),
        (viewport) => {
          mockViewport(viewport.width, viewport.height);

          const { container, unmount } = renderWithTheme(<Resume />);

          // Property: All chips should have consistent styling
          const chips = container.querySelectorAll('[class*="MuiChip"]');
          const chipHeights: number[] = [];
          const chipFontSizes: number[] = [];

          chips.forEach(chip => {
            const computedStyle = window.getComputedStyle(chip);
            const height = parseFloat(computedStyle.height);
            const fontSize = parseFloat(computedStyle.fontSize);

            if (height > 0) {
              chipHeights.push(height);
            }
            if (fontSize > 0) {
              chipFontSizes.push(fontSize);
            }
          });

          // Property: All chips should have similar heights (allowing for small variations)
          if (chipHeights.length > 1) {
            const avgHeight = chipHeights.reduce((a, b) => a + b, 0) / chipHeights.length;
            chipHeights.forEach(height => {
              // Heights should be within 10px of average
              expect(Math.abs(height - avgHeight)).toBeLessThanOrEqual(10);
            });
          }

          // Property: All chips should have similar font sizes
          if (chipFontSizes.length > 1) {
            const avgFontSize = chipFontSizes.reduce((a, b) => a + b, 0) / chipFontSizes.length;
            chipFontSizes.forEach(fontSize => {
              // Font sizes should be within 2px of average
              expect(Math.abs(fontSize - avgFontSize)).toBeLessThanOrEqual(2);
            });
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
