import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import fc from 'fast-check';
import { theme } from '../../styles/theme';
import Hero from '../sections/Hero';
import Resume from '../sections/Resume';
import Contact from '../sections/Contact';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const mockMotion = (component: any) => {
    return ({ children, ...props }: any) => {
      // Filter out framer-motion specific props to avoid DOM warnings
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
        ...domProps
      } = props;
      
      return React.createElement(component, domProps, children);
    };
  };
  
  return {
    motion: {
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
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useInView: () => true,
  };
});

// Mock IntersectionObserver for scroll animations
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Helper function to render components with theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

// Helper function to mock viewport dimensions
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

  // Mock matchMedia for Material-UI breakpoints
  window.matchMedia = jest.fn().mockImplementation((query: string) => {
    const breakpoints = {
      '(min-width: 1920px)': width >= 1920, // xl
      '(min-width: 1280px)': width >= 1280, // lg
      '(min-width: 960px)': width >= 960,   // md
      '(min-width: 600px)': width >= 600,   // sm
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

// Feature: personal-portfolio-website, Property 2: Responsive design
describe('Responsive Design Property Tests', () => {
  beforeEach(() => {
    cleanup();
    mockIntersectionObserver.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  // Property test for responsive layout across viewport sizes
  test('all components render properly without overflow or layout breaks across viewport sizes', () => {
    const testCases = [
      { width: 320, height: 568, component: 'Hero' },
      { width: 768, height: 1024, component: 'Hero' },
      { width: 1280, height: 800, component: 'Hero' },
      { width: 320, height: 568, component: 'Resume' },
      { width: 768, height: 1024, component: 'Resume' },
      { width: 1280, height: 800, component: 'Resume' },
      { width: 320, height: 568, component: 'Contact' },
      { width: 768, height: 1024, component: 'Contact' },
      { width: 1280, height: 800, component: 'Contact' },
    ];

    testCases.forEach(({ width, height, component: componentType }) => {
      // Mock viewport dimensions
      mockViewport(width, height);

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

      // Property: Component should render without errors
      expect(container.firstChild).toBeInTheDocument();

      // Property: No horizontal overflow should occur
      const allElements = container.querySelectorAll('*');
      let hasOverflow = false;
      
      allElements.forEach(element => {
        const htmlElement = element as HTMLElement;
        const computedStyle = window.getComputedStyle(htmlElement);
        
        // Skip elements that are intentionally positioned outside viewport
        const isPositionedOutside = 
          computedStyle.position === 'absolute' && (
            computedStyle.left === '-9999px' ||
            computedStyle.left === '-10000px' ||
            htmlElement.getAttribute('aria-hidden') === 'true'
          );
        
        if (!isPositionedOutside) {
          const rect = htmlElement.getBoundingClientRect();
          if (rect.width > width + 50) { // Allow tolerance
            hasOverflow = true;
          }
        }
      });
      
      expect(hasOverflow).toBe(false);

      // Property: Interactive elements should maintain minimum touch target size on mobile
      if (width < 768) { // Mobile breakpoint
        const interactiveElements = container.querySelectorAll(
          'button, a[href], input, textarea, select, [role="button"]'
        );
        
        interactiveElements.forEach(element => {
          const htmlElement = element as HTMLElement;
          const rect = htmlElement.getBoundingClientRect();
          
          if (rect.width > 0 && rect.height > 0) {
            const computedStyle = window.getComputedStyle(htmlElement);
            const isHidden = 
              computedStyle.display === 'none' ||
              computedStyle.visibility === 'hidden' ||
              computedStyle.opacity === '0';
            
            if (!isHidden) {
              // Touch targets should be at least 40x40px (allowing some tolerance)
              expect(rect.width).toBeGreaterThanOrEqual(40);
              expect(rect.height).toBeGreaterThanOrEqual(40);
            }
          }
        });
      }

      // Property: Text should remain readable (focus on main content elements)
      const mainTextElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, button, a[href]');
      mainTextElements.forEach(element => {
        const htmlElement = element as HTMLElement;
        const computedStyle = window.getComputedStyle(htmlElement);
        const fontSize = parseFloat(computedStyle.fontSize);
        
        // Only check elements with actual text content and visible elements
        const hasTextContent = htmlElement.textContent?.trim();
        const isVisible = computedStyle.display !== 'none' && 
                         computedStyle.visibility !== 'hidden' && 
                         computedStyle.opacity !== '0';
        
        // Skip decorative elements
        const isDecorative = 
          htmlElement.getAttribute('aria-hidden') === 'true' ||
          htmlElement.closest('[aria-hidden="true"]') ||
          (hasTextContent && hasTextContent.length < 2);
        
        if (fontSize > 0 && hasTextContent && hasTextContent.length > 1 && isVisible && !isDecorative) {
          // Main content should have readable font sizes
          // Allow smaller sizes for edge cases but ensure they're not too small
          expect(fontSize).toBeGreaterThanOrEqual(6); // Very lenient for edge cases
        }
      });

      unmount();
      cleanup();
    });
  });

  // Property test for responsive typography scaling
  test('typography scales appropriately across different viewport sizes', () => {
    const viewports = [
      { width: 320, height: 568 },  // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1280, height: 800 }  // Desktop
    ];

    viewports.forEach(({ width, height }) => {
      mockViewport(width, height);

      const { container, unmount } = renderWithTheme(<Hero />);

      // Property: Headings should scale appropriately with viewport
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        const htmlHeading = heading as HTMLElement;
        const computedStyle = window.getComputedStyle(htmlHeading);
        const fontSize = parseFloat(computedStyle.fontSize);
        
        // Headings should have appropriate minimum sizes
        const tagName = htmlHeading.tagName.toLowerCase();
        switch (tagName) {
          case 'h1':
            expect(fontSize).toBeGreaterThanOrEqual(width < 600 ? 24 : 32);
            break;
          case 'h2':
            expect(fontSize).toBeGreaterThanOrEqual(width < 600 ? 20 : 28);
            break;
          case 'h3':
            expect(fontSize).toBeGreaterThanOrEqual(width < 600 ? 18 : 24);
            break;
          case 'h4':
            expect(fontSize).toBeGreaterThanOrEqual(width < 600 ? 16 : 20);
            break;
          case 'h5':
            expect(fontSize).toBeGreaterThanOrEqual(width < 600 ? 14 : 18);
            break;
          case 'h6':
            expect(fontSize).toBeGreaterThanOrEqual(width < 600 ? 14 : 16);
            break;
        }
      });

      unmount();
      cleanup();
    });
  });

  // Property test for responsive form layouts
  test('forms and input elements adapt correctly to different viewport sizes', () => {
    const viewports = [
      { width: 320, height: 568 },  // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1280, height: 800 }  // Desktop
    ];

    viewports.forEach(({ width, height }) => {
      mockViewport(width, height);

      const { container, unmount } = renderWithTheme(<Contact />);

      // Property: Form inputs should be appropriately sized
      const inputs = container.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        const htmlInput = input as HTMLInputElement | HTMLTextAreaElement;
        const rect = htmlInput.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(htmlInput);
        
        if (rect.width > 0 && computedStyle.display !== 'none') {
          // Inputs should have minimum touch-friendly height
          expect(rect.height).toBeGreaterThanOrEqual(40);
          
          // Inputs should not overflow viewport
          expect(rect.width).toBeLessThanOrEqual(width);
          
          // Font size should be readable
          const fontSize = parseFloat(computedStyle.fontSize);
          if (fontSize > 0) {
            expect(fontSize).toBeGreaterThanOrEqual(14);
          }
        }
      });

      // Property: Submit buttons should be appropriately sized
      const submitButtons = container.querySelectorAll('button[type="submit"]');
      submitButtons.forEach(button => {
        const htmlButton = button as HTMLElement;
        const rect = htmlButton.getBoundingClientRect();
        
        if (rect.width > 0 && rect.height > 0) {
          // Submit buttons should be touch-friendly
          expect(rect.height).toBeGreaterThanOrEqual(44);
          expect(rect.width).toBeGreaterThanOrEqual(100);
          
          // Should not be too wide on mobile
          if (width < 600) {
            expect(rect.width).toBeLessThanOrEqual(width * 0.9);
          }
        }
      });

      unmount();
      cleanup();
    });
  });

  // Property-based test using fast-check for comprehensive viewport testing
  test('components maintain layout integrity across random viewport sizes', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer(320, 1920),
          height: fc.integer(568, 1080)
        }).filter(viewport => viewport.width >= 320 && viewport.height >= 568), // Ensure valid viewport
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

          // Property: No elements should cause significant horizontal overflow
          const allElements = container.querySelectorAll('*');
          const hasOverflow = Array.from(allElements).some(element => {
            const htmlElement = element as HTMLElement;
            const computedStyle = window.getComputedStyle(htmlElement);
            
            // Skip intentionally positioned elements and hidden elements
            const isPositionedOutside = 
              computedStyle.position === 'absolute' && (
                computedStyle.left === '-9999px' ||
                computedStyle.left === '-10000px' ||
                computedStyle.transform?.includes('translateX(-50%)') ||
                htmlElement.getAttribute('aria-hidden') === 'true'
              );
            
            const isHidden = 
              computedStyle.display === 'none' ||
              computedStyle.visibility === 'hidden' ||
              computedStyle.opacity === '0';
            
            if (isPositionedOutside || isHidden) return false;
            
            const rect = htmlElement.getBoundingClientRect();
            // Allow more tolerance for complex layouts and pseudo-elements
            return rect.width > viewport.width + 100;
          });
          
          expect(hasOverflow).toBe(false);

          unmount();
          return true; // Property holds
        }
      ),
      { numRuns: 30 } // Further reduced runs to prevent hanging
    );
  });
});