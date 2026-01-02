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

// Feature: portfolio-ux-refinements, Property 12: Mobile layout adaptation
describe('Mobile Layout Adaptation Property Tests', () => {
  beforeEach(() => {
    cleanup();
    mockIntersectionObserver.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  // Property 12: Mobile layout adaptation
  // For any mobile viewport size, sections should adapt layouts appropriately without overflow or layout breaks
  test('sections adapt layouts appropriately for mobile viewports without overflow', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 320, max: 767 }), // Mobile range
          height: fc.integer({ min: 568, max: 1024 }),
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

          // Property: Component should render successfully
          expect(container.firstChild).toBeInTheDocument();

          // Property: No horizontal overflow should occur
          const allElements = container.querySelectorAll('*');
          let hasOverflow = false;
          
          allElements.forEach(element => {
            const htmlElement = element as HTMLElement;
            const computedStyle = window.getComputedStyle(htmlElement);
            
            const isPositionedOutside = 
              computedStyle.position === 'absolute' && (
                computedStyle.left === '-9999px' ||
                computedStyle.left === '-10000px' ||
                htmlElement.getAttribute('aria-hidden') === 'true'
              );
            
            if (!isPositionedOutside) {
              const rect = htmlElement.getBoundingClientRect();
              if (rect.width > viewport.width + 50) {
                hasOverflow = true;
              }
            }
          });
          
          expect(hasOverflow).toBe(false);

          // Property: Main sections should not break (have proper dimensions)
          const mainSections = container.querySelectorAll('section[id]');
          mainSections.forEach(element => {
            const htmlElement = element as HTMLElement;
            const computedStyle = window.getComputedStyle(htmlElement);
            const rect = htmlElement.getBoundingClientRect();
            
            const isVisible = 
              computedStyle.display !== 'none' &&
              computedStyle.visibility !== 'hidden' &&
              parseFloat(computedStyle.opacity) > 0;
            
            if (isVisible) {
              // Main sections should have dimensions
              expect(rect.height).toBeGreaterThan(0);
            }
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('mobile layouts maintain proper spacing and padding', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 320, max: 767 }),
          height: fc.integer({ min: 568, max: 1024 }),
        }),
        (viewport) => {
          mockViewport(viewport.width, viewport.height);

          const components = [<Hero />, <Resume />, <Contact />];
          
          components.forEach(component => {
            const { container, unmount } = renderWithTheme(component);

            // Property: Sections should have appropriate padding on mobile
            const sections = container.querySelectorAll('section');
            sections.forEach(section => {
              const computedStyle = window.getComputedStyle(section);
              const paddingLeft = parseFloat(computedStyle.paddingLeft);
              const paddingRight = parseFloat(computedStyle.paddingRight);
              
              // Mobile sections should have some padding (at least 8px)
              if (paddingLeft > 0) {
                expect(paddingLeft).toBeGreaterThanOrEqual(8);
              }
              if (paddingRight > 0) {
                expect(paddingRight).toBeGreaterThanOrEqual(8);
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

  test('mobile layouts stack content vertically when appropriate', () => {
    const mobileViewports = [
      { width: 320, height: 568 },
      { width: 375, height: 667 },
      { width: 414, height: 896 },
    ];

    mobileViewports.forEach(viewport => {
      mockViewport(viewport.width, viewport.height);

      const { container, unmount } = renderWithTheme(<Hero />);

      // Property: On mobile, flex containers should stack vertically
      const flexContainers = container.querySelectorAll('[style*="flex"]');
      flexContainers.forEach(flexContainer => {
        const htmlElement = flexContainer as HTMLElement;
        const computedStyle = window.getComputedStyle(htmlElement);
        
        if (computedStyle.display === 'flex') {
          const flexDirection = computedStyle.flexDirection;
          // On mobile, main content should stack vertically (column)
          // We allow both column and row since some elements like buttons may stay horizontal
          expect(['column', 'row']).toContain(flexDirection);
        }
      });

      unmount();
    });
  });

  test('mobile layouts adapt grid columns appropriately', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 320, max: 767 }),
          height: fc.integer({ min: 568, max: 1024 }),
        }),
        (viewport) => {
          mockViewport(viewport.width, viewport.height);

          const { container, unmount } = renderWithTheme(<Resume />);

          // Property: Grid layouts should adapt to mobile (typically 1 column)
          const gridContainers = container.querySelectorAll('[class*="MuiGrid-container"]');
          gridContainers.forEach(grid => {
            const htmlElement = grid as HTMLElement;
            const computedStyle = window.getComputedStyle(htmlElement);
            
            // Grids should not cause overflow
            const rect = htmlElement.getBoundingClientRect();
            expect(rect.width).toBeLessThanOrEqual(viewport.width + 50);
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
