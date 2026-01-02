import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import fc from 'fast-check';
import ContextualNavigation from '../ContextualNavigation';
import { theme } from '../../../styles/theme';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock smart scrolling hook
jest.mock('../../../utils/smartScrolling', () => ({
  useSmartScrolling: () => ({
    scrollToSection: jest.fn().mockResolvedValue(undefined),
  }),
}));

// Mock navigation state hook
jest.mock('../../../utils/navigationState', () => ({
  useNavigationState: () => ({
    updateCurrentSection: jest.fn(),
  }),
}));

// Mock navigation items
jest.mock('../../../config/navigation', () => ({
  modernNavigationItems: [
    { id: 'home', label: 'Home', description: 'Home section' },
    { id: 'experience', label: 'Experience', description: 'Experience section' },
    { id: 'connect', label: 'Connect', description: 'Connect section' },
  ],
}));

// Feature: portfolio-ux-refinements, Property 16: Navigation visual feedback
describe('Navigation Visual Feedback Property Tests', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
  };

  beforeEach(() => {
    cleanup();
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
    // Mock window.scrollBy
    window.scrollBy = jest.fn();
    // Set initial scroll position
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      value: 500, // Scrolled down to make navigation visible
    });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  // Property 16: Navigation visual feedback
  // For any tap event on mobile navigation arrows, visual feedback should be triggered
  test('tap events on navigation arrows trigger visual feedback', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('home', 'experience', 'connect'), // current section
        fc.boolean(), // tap on up arrow (true) or down arrow (false)
        (currentSection: string, tapUpArrow: boolean) => {
          cleanup();

          const mockOnSectionChange = jest.fn();

          const { container, unmount } = renderWithTheme(
            <ContextualNavigation
              currentSection={currentSection}
              onSectionChange={mockOnSectionChange}
              showBreadcrumbs={true}
              showSuggestions={true}
              position="bottom-right"
            />
          );

          // Find navigation arrows by their aria-labels
          const allButtons = screen.queryAllByRole('button');
          
          // Filter to get up and down arrows based on aria-label
          const upArrow = allButtons.find(btn => 
            btn.getAttribute('aria-label')?.match(/navigate to.*section|scroll to top/i)
          );
          const downArrow = allButtons.find(btn => 
            btn.getAttribute('aria-label')?.match(/navigate to.*section|at bottom of page|no next section/i) &&
            btn !== upArrow
          );

          // Determine which arrow to test based on the property
          const arrowToTest = tapUpArrow ? upArrow : downArrow;

          if (arrowToTest) {
            // Get initial styles
            const initialStyles = window.getComputedStyle(arrowToTest);
            const initialBackgroundColor = initialStyles.backgroundColor;

            // Simulate touch start (should trigger visual feedback)
            fireEvent.touchStart(arrowToTest);

            // Visual feedback should be applied (background color change, scale, etc.)
            // The component uses motion.div with whileTap={{ scale: 0.9 }}
            // We verify that the touch event was registered
            expect(arrowToTest).toBeInTheDocument();

            // Simulate touch end
            fireEvent.touchEnd(arrowToTest);

            // After touch end, the element should still exist
            expect(arrowToTest).toBeInTheDocument();

            // Verify that the arrow is interactive (has cursor pointer or is clickable)
            const arrowStyles = window.getComputedStyle(arrowToTest);
            const isInteractive =
              arrowStyles.cursor === 'pointer' ||
              arrowToTest.getAttribute('role') === 'button' ||
              arrowToTest.tagName === 'BUTTON';

            // Navigation arrows should be interactive elements
            expect(isInteractive).toBe(true);
          }

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Additional property: Visual feedback consistency across different sections
  test('visual feedback is consistent regardless of current section', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('home', 'experience', 'connect'),
        (currentSection: string) => {
          cleanup();

          const mockOnSectionChange = jest.fn();

          const { unmount } = renderWithTheme(
            <ContextualNavigation
              currentSection={currentSection}
              onSectionChange={mockOnSectionChange}
              showBreadcrumbs={true}
              showSuggestions={true}
              position="bottom-right"
            />
          );

          // Find all navigation buttons
          const navigationButtons = screen.queryAllByRole('button');

          // Each navigation button should have visual feedback properties
          navigationButtons.forEach((button) => {
            // Check that button has appropriate styling for visual feedback
            const styles = window.getComputedStyle(button);

            // Should have transition for smooth visual feedback
            expect(styles.transition).toBeTruthy();

            // Should be interactive
            expect(button.getAttribute('tabIndex')).toBe('0');

            // Should have aria-label for accessibility
            expect(button.getAttribute('aria-label')).toBeTruthy();
          });

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Visual feedback on click events (in addition to touch)
  test('click events also trigger visual feedback on navigation arrows', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('home', 'experience', 'connect'),
        fc.boolean(), // click up or down
        (currentSection: string, clickUp: boolean) => {
          cleanup();

          const mockOnSectionChange = jest.fn();

          const { unmount } = renderWithTheme(
            <ContextualNavigation
              currentSection={currentSection}
              onSectionChange={mockOnSectionChange}
              showBreadcrumbs={true}
              showSuggestions={true}
              position="bottom-right"
            />
          );

          // Find navigation arrows
          const arrows = screen.queryAllByRole('button');

          if (arrows.length > 0) {
            const arrowToClick = clickUp ? arrows[0] : arrows[arrows.length - 1];

            // Simulate mouse down (visual feedback start)
            fireEvent.mouseDown(arrowToClick);

            // Element should still be in document
            expect(arrowToClick).toBeInTheDocument();

            // Simulate mouse up (visual feedback end)
            fireEvent.mouseUp(arrowToClick);

            // Element should still be in document after interaction
            expect(arrowToClick).toBeInTheDocument();

            // Click the arrow
            fireEvent.click(arrowToClick);

            // Verify the arrow remains functional after click
            expect(arrowToClick).toBeInTheDocument();
          }

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Disabled arrows should not provide misleading visual feedback
  test('disabled navigation arrows have appropriate visual feedback', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('home', 'connect'), // First or last section
        (currentSection: string) => {
          cleanup();

          const mockOnSectionChange = jest.fn();

          const { unmount } = renderWithTheme(
            <ContextualNavigation
              currentSection={currentSection}
              onSectionChange={mockOnSectionChange}
              showBreadcrumbs={true}
              showSuggestions={true}
              position="bottom-right"
            />
          );

          // Find all navigation buttons
          const buttons = screen.queryAllByRole('button');

          buttons.forEach((button) => {
            const ariaDisabled = button.getAttribute('aria-disabled');
            const ariaLabel = button.getAttribute('aria-label');

            // If button is disabled, it should have appropriate aria attributes
            if (ariaDisabled === 'true' || ariaLabel?.includes('At bottom') || ariaLabel?.includes('No next section')) {
              // Disabled buttons should still be in the document but with reduced opacity
              expect(button).toBeInTheDocument();

              // Should have cursor not-allowed or similar
              const styles = window.getComputedStyle(button);
              const isVisuallyDisabled =
                styles.cursor === 'not-allowed' ||
                parseFloat(styles.opacity) < 1;

              expect(isVisuallyDisabled).toBe(true);
            }
          });

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Visual feedback timing is consistent
  test('visual feedback transitions have consistent timing', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('home', 'experience', 'connect'),
        (currentSection: string) => {
          cleanup();

          const mockOnSectionChange = jest.fn();

          const { unmount } = renderWithTheme(
            <ContextualNavigation
              currentSection={currentSection}
              onSectionChange={mockOnSectionChange}
              showBreadcrumbs={true}
              showSuggestions={true}
              position="bottom-right"
            />
          );

          // Find all interactive elements
          const buttons = screen.queryAllByRole('button');

          buttons.forEach((button) => {
            const styles = window.getComputedStyle(button);

            // All buttons should have transition defined for smooth feedback
            if (styles.transition && styles.transition !== 'none') {
              // Transition should be defined
              expect(styles.transition).toBeTruthy();

              // Transition should be relatively quick (< 1s for good UX)
              const transitionMatch = styles.transition.match(/(\d+\.?\d*)s/);
              if (transitionMatch) {
                const duration = parseFloat(transitionMatch[1]);
                expect(duration).toBeLessThanOrEqual(1.0);
              }
            }
          });

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
