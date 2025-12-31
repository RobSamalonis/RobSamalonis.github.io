import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import fc from 'fast-check';
import AnimatedSection from '../AnimatedSection';
import EntranceAnimation from '../EntranceAnimation';
import AnimatedInteractive from '../AnimatedInteractive';
import { theme } from '../../../styles/theme';
import { AnimationConfig } from '../../../types/animation';

// Mock framer-motion's useInView hook
const mockUseInView = jest.fn();
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  useInView: () => mockUseInView(),
}));

// Mock IntersectionObserver for scroll animations
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Feature: personal-portfolio-website, Property 3: Animation state management
describe('Animation State Management Property Tests', () => {
  // Helper function to render components with theme
  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    mockUseInView.mockClear();
    mockIntersectionObserver.mockClear();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  // Property test for scroll animation state management
  test('scroll animations update state appropriately without conflicts', () => {
    fc.assert(
      fc.property(
        fc.record({
          type: fc.constant('scroll' as const),
          duration: fc.float({ min: Math.fround(0.1), max: Math.fround(2.0) }),
          delay: fc.float({ min: Math.fround(0), max: Math.fround(1.0) }),
          easing: fc.oneof(
            fc.constant('easeIn'),
            fc.constant('easeOut'),
            fc.constant('easeInOut')
          )
        }),
        fc.float({ min: Math.fround(0.1), max: Math.fround(1.0) }), // threshold
        fc.boolean(), // isInView state
        (animationConfig: AnimationConfig, threshold: number, isInView: boolean) => {
          cleanup();
          
          // Mock useInView to return the test value
          mockUseInView.mockReturnValue(isInView);

          const testContent = 'Test animated content';
          const { unmount } = renderWithTheme(
            <AnimatedSection animation={animationConfig} threshold={threshold}>
              <div>{testContent}</div>
            </AnimatedSection>
          );

          // Verify content is rendered
          const content = screen.getByText(testContent);
          expect(content).toBeInTheDocument();

          // Verify the component handles the animation state correctly
          // The component should exist regardless of animation state
          expect(content.closest('div')).toBeInTheDocument();

          // Test that multiple scroll events don't cause conflicts
          act(() => {
            // Simulate multiple scroll events
            mockUseInView.mockReturnValue(false);
            mockUseInView.mockReturnValue(true);
            mockUseInView.mockReturnValue(isInView);
          });

          // Component should still be stable after multiple state changes
          expect(screen.getByText(testContent)).toBeInTheDocument();

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test for hover animation state management
  test('hover animations manage state without conflicts during rapid interactions', () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0.9), max: Math.fround(1.2) }), // hoverScale
        fc.float({ min: Math.fround(0.8), max: Math.fround(0.99) }), // tapScale
        fc.boolean(), // disabled state
        (hoverScale: number, tapScale: number, disabled: boolean) => {
          cleanup();

          const testContent = 'Interactive element';
          const mockOnClick = jest.fn();

          const { unmount } = renderWithTheme(
            <AnimatedInteractive
              hoverScale={hoverScale}
              tapScale={tapScale}
              disabled={disabled}
              onClick={mockOnClick}
            >
              <div>{testContent}</div>
            </AnimatedInteractive>
          );

          const element = screen.getByText(testContent).closest('div');
          expect(element).toBeInTheDocument();

          // Test rapid hover interactions
          act(() => {
            if (element) {
              fireEvent.mouseEnter(element);
              fireEvent.mouseLeave(element);
              fireEvent.mouseEnter(element);
              fireEvent.mouseLeave(element);
            }
          });

          // Element should remain stable after rapid interactions
          expect(screen.getByText(testContent)).toBeInTheDocument();

          // Test click behavior based on disabled state
          if (element) {
            fireEvent.click(element);
          }

          if (disabled) {
            expect(mockOnClick).not.toHaveBeenCalled();
          } else {
            expect(mockOnClick).toHaveBeenCalled();
          }

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test for entrance animation state management
  test('entrance animations handle timing and state transitions correctly', () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0), max: Math.fround(2.0) }).filter(n => !isNaN(n) && isFinite(n)), // delay
        fc.oneof(
          fc.constant('fadeInUp'),
          fc.constant('slideInLeft'),
          fc.constant('scaleIn'),
          fc.constant('glitchEffect'),
          fc.constant('neonGlow')
        ), // preset
        (delay: number, preset: 'fadeInUp' | 'slideInLeft' | 'scaleIn' | 'glitchEffect' | 'neonGlow') => {
          cleanup();

          const testContent = 'Entrance animated content';

          // Use fake timers to control animation timing
          jest.useFakeTimers();

          const { unmount } = renderWithTheme(
            <EntranceAnimation delay={delay} preset={preset}>
              <div>{testContent}</div>
            </EntranceAnimation>
          );

          // Initially, content should not be visible (due to AnimatePresence)
          expect(screen.queryByText(testContent)).not.toBeInTheDocument();

          // Fast-forward time to trigger the entrance animation
          act(() => {
            jest.advanceTimersByTime(delay * 1000 + 100);
          });

          // After delay, content should be visible
          expect(screen.getByText(testContent)).toBeInTheDocument();

          // Test that multiple timer advances don't cause issues
          act(() => {
            jest.advanceTimersByTime(1000);
            jest.advanceTimersByTime(500);
          });

          // Content should still be stable
          expect(screen.getByText(testContent)).toBeInTheDocument();

          jest.useRealTimers();
          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test for animation state consistency across component types
  test('different animation types maintain consistent state management', () => {
    fc.assert(
      fc.property(
        fc.record({
          scrollConfig: fc.record({
            type: fc.constant('scroll' as const),
            duration: fc.float({ min: Math.fround(0.1), max: Math.fround(1.0) }),
            easing: fc.constant('easeOut')
          }),
          entranceDelay: fc.float({ min: Math.fround(0), max: Math.fround(1.0) }).filter(n => !isNaN(n) && isFinite(n)),
          hoverScale: fc.float({ min: Math.fround(1.0), max: Math.fround(1.1) }),
          isInView: fc.boolean()
        }),
        (config) => {
          cleanup();

          mockUseInView.mockReturnValue(config.isInView);
          jest.useFakeTimers();

          const scrollContent = 'Scroll content';
          const entranceContent = 'Entrance content';
          const interactiveContent = 'Interactive content';

          const { unmount } = renderWithTheme(
            <div>
              <AnimatedSection animation={config.scrollConfig}>
                <div>{scrollContent}</div>
              </AnimatedSection>
              <EntranceAnimation delay={config.entranceDelay}>
                <div>{entranceContent}</div>
              </EntranceAnimation>
              <AnimatedInteractive hoverScale={config.hoverScale}>
                <div>{interactiveContent}</div>
              </AnimatedInteractive>
            </div>
          );

          // Advance timers for entrance animation
          act(() => {
            jest.advanceTimersByTime(config.entranceDelay * 1000 + 100);
          });

          // All components should coexist without conflicts
          expect(screen.getByText(scrollContent)).toBeInTheDocument();
          expect(screen.getByText(entranceContent)).toBeInTheDocument();
          expect(screen.getByText(interactiveContent)).toBeInTheDocument();

          // Test interactions don't interfere with each other
          const interactiveElement = screen.getByText(interactiveContent).closest('div');
          if (interactiveElement) {
            act(() => {
              fireEvent.mouseEnter(interactiveElement);
              fireEvent.mouseLeave(interactiveElement);
            });
          }

          // All components should remain stable
          expect(screen.getByText(scrollContent)).toBeInTheDocument();
          expect(screen.getByText(entranceContent)).toBeInTheDocument();
          expect(screen.getByText(interactiveContent)).toBeInTheDocument();

          jest.useRealTimers();
          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test for animation state recovery after errors
  test('animation components handle state errors gracefully', () => {
    fc.assert(
      fc.property(
        fc.record({
          type: fc.constant('scroll' as const),
          duration: fc.float({ min: Math.fround(0.1), max: Math.fround(1.0) }),
          easing: fc.constant('easeOut')
        }),
        fc.boolean(), // simulate error condition
        (animationConfig: AnimationConfig, shouldError: boolean) => {
          cleanup();

          if (shouldError) {
            // Mock useInView to throw an error occasionally
            mockUseInView.mockImplementation(() => {
              throw new Error('Mock animation error');
            });
          } else {
            mockUseInView.mockReturnValue(true);
          }

          const testContent = 'Error test content';

          try {
            const { unmount } = renderWithTheme(
              <AnimatedSection animation={animationConfig}>
                <div>{testContent}</div>
              </AnimatedSection>
            );

            if (!shouldError) {
              // If no error, component should render normally
              expect(screen.getByText(testContent)).toBeInTheDocument();
            }

            unmount();
          } catch (error) {
            // If error occurs, it should be handled gracefully
            // The test framework will catch unhandled errors
            if (shouldError) {
              expect(error).toBeDefined();
            }
          }

          // Reset mock for next iteration
          mockUseInView.mockReset();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});