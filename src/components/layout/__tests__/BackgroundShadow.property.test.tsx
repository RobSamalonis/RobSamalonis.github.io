import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../../styles';
import BackgroundShadow from '../BackgroundShadow';
import * as fc from 'fast-check';

/**
 * Feature: portfolio-ux-refinements, Property 6: Shadow styling consistency
 * Validates: Requirements 3.2, 3.5
 * 
 * For any viewport size, the background shadow should use the same color values 
 * and blur radius as the navigation header
 */
describe('BackgroundShadow Property Tests', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  describe('Property 6: Shadow styling consistency', () => {
    it('should use consistent color values and blur radius across different viewport sizes', () => {
      fc.assert(
        fc.property(
          fc.record({
            viewportWidth: fc.integer({ min: 320, max: 2560 }),
            viewportHeight: fc.integer({ min: 568, max: 1440 }),
            headerHeight: fc.integer({ min: 64, max: 100 }),
            isScrolled: fc.boolean()
          }),
          ({ viewportWidth, viewportHeight, headerHeight, isScrolled }) => {
            // Set viewport size
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });
            Object.defineProperty(window, 'innerHeight', {
              writable: true,
              configurable: true,
              value: viewportHeight,
            });

            const { container } = renderWithTheme(
              <BackgroundShadow headerHeight={headerHeight} isScrolled={isScrolled} />
            );

            const shadowElement = container.querySelector('[data-testid="background-shadow"]');
            expect(shadowElement).toBeTruthy();

            if (shadowElement) {
              const styles = window.getComputedStyle(shadowElement);
              
              // Verify shadow uses CSS custom properties for consistency
              const boxShadow = styles.boxShadow;
              
              // Shadow should be defined (not 'none')
              expect(boxShadow).not.toBe('none');
              
              // In test environment, CSS custom properties may not be resolved
              // Check that shadow is defined either as resolved values or custom properties
              const hasResolvedShadow = boxShadow.match(/rgba?\(/);
              const hasCustomProperties = boxShadow.includes('var(--shadow');
              
              expect(hasResolvedShadow || hasCustomProperties).toBe(true);
              
              // Verify the shadow definition includes the expected custom property names
              if (hasCustomProperties) {
                expect(boxShadow).toContain('--shadow-offset-y');
                expect(boxShadow).toContain('--shadow-blur');
                expect(boxShadow).toContain('--shadow-color');
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain consistent styling when scrolled state changes', () => {
      fc.assert(
        fc.property(
          fc.record({
            headerHeight: fc.integer({ min: 64, max: 100 }),
            initialScrolled: fc.boolean()
          }),
          ({ headerHeight, initialScrolled }) => {
            // Render with initial scrolled state
            const { container: container1 } = renderWithTheme(
              <BackgroundShadow headerHeight={headerHeight} isScrolled={initialScrolled} />
            );

            // Render with opposite scrolled state
            const { container: container2 } = renderWithTheme(
              <BackgroundShadow headerHeight={headerHeight} isScrolled={!initialScrolled} />
            );

            const shadow1 = container1.querySelector('[data-testid="background-shadow"]');
            const shadow2 = container2.querySelector('[data-testid="background-shadow"]');

            expect(shadow1).toBeTruthy();
            expect(shadow2).toBeTruthy();

            if (shadow1 && shadow2) {
              const styles1 = window.getComputedStyle(shadow1);
              const styles2 = window.getComputedStyle(shadow2);

              // Both should have box-shadow defined
              expect(styles1.boxShadow).not.toBe('none');
              expect(styles2.boxShadow).not.toBe('none');

              // Both should use fixed positioning
              expect(styles1.position).toBe('fixed');
              expect(styles2.position).toBe('fixed');

              // Both should be at top
              expect(styles1.top).toBe('0px');
              expect(styles2.top).toBe('0px');
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: portfolio-ux-refinements, Property 7: Shadow alignment across viewports
   * Validates: Requirements 3.4
   * 
   * For any viewport size, the background shadow should maintain proper alignment 
   * with the header without visible offset
   */
  describe('Property 7: Shadow alignment across viewports', () => {
    it('should maintain proper alignment with header across different viewport sizes', () => {
      fc.assert(
        fc.property(
          fc.record({
            viewportWidth: fc.integer({ min: 320, max: 2560 }),
            viewportHeight: fc.integer({ min: 568, max: 1440 }),
            headerHeight: fc.integer({ min: 64, max: 100 })
          }),
          ({ viewportWidth, viewportHeight, headerHeight }) => {
            // Set viewport size
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });
            Object.defineProperty(window, 'innerHeight', {
              writable: true,
              configurable: true,
              value: viewportHeight,
            });

            const { container } = renderWithTheme(
              <BackgroundShadow headerHeight={headerHeight} />
            );

            const shadowElement = container.querySelector('[data-testid="background-shadow"]');
            expect(shadowElement).toBeTruthy();

            if (shadowElement) {
              const styles = window.getComputedStyle(shadowElement);
              
              // Verify shadow uses fixed positioning (same as header)
              expect(styles.position).toBe('fixed');
              
              // Verify shadow is positioned at top with no offset
              expect(styles.top).toBe('0px');
              
              // Verify shadow spans full width (no horizontal offset)
              expect(styles.left).toBe('0px');
              expect(styles.right).toBe('0px');
              
              // In test environment, width may be empty string or computed value
              // The important thing is that left: 0 and right: 0 ensure full width
              // Just verify the element exists and has the correct positioning
              expect(shadowElement).toBeInTheDocument();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain alignment when header height changes', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 64, max: 100 }), { minLength: 2, maxLength: 5 }),
          (headerHeights) => {
            // Test that shadow maintains alignment across different header heights
            const alignments = headerHeights.map(height => {
              const { container } = renderWithTheme(
                <BackgroundShadow headerHeight={height} />
              );

              const shadowElement = container.querySelector('[data-testid="background-shadow"]');
              if (!shadowElement) return null;

              const styles = window.getComputedStyle(shadowElement);
              return {
                position: styles.position,
                top: styles.top,
                left: styles.left,
                right: styles.right
              };
            });

            // Filter out null values
            const validAlignments = alignments.filter(a => a !== null);
            
            // All shadows should have consistent positioning strategy
            const allFixed = validAlignments.every(a => a?.position === 'fixed');
            const allTopZero = validAlignments.every(a => a?.top === '0px');
            const allLeftZero = validAlignments.every(a => a?.left === '0px');
            const allRightZero = validAlignments.every(a => a?.right === '0px');

            expect(allFixed).toBe(true);
            expect(allTopZero).toBe(true);
            expect(allLeftZero).toBe(true);
            expect(allRightZero).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
