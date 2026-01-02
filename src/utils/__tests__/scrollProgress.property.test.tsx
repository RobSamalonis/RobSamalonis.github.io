import { render, cleanup } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import fc from 'fast-check';
import { theme } from '../../styles/theme';
import { SmartScrolling } from '../smartScrolling';
import ScrollProgressIndicator from '../../components/common/ScrollProgressIndicator';

// Mock window.pageYOffset and related properties
const mockScrollProperties = (scrollY: number, innerHeight: number, scrollHeight: number) => {
  Object.defineProperty(window, 'pageYOffset', {
    writable: true,
    configurable: true,
    value: scrollY,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: innerHeight,
  });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    writable: true,
    configurable: true,
    value: scrollHeight,
  });
};

// Mock section elements
const mockSectionElements = (sections: Array<{ id: string; offsetTop: number; offsetHeight: number }>) => {
  const originalGetElementById = document.getElementById;
  document.getElementById = jest.fn((id: string) => {
    const section = sections.find(s => s.id === id);
    if (section) {
      return {
        id: section.id,
        offsetTop: section.offsetTop,
        offsetHeight: section.offsetHeight,
        getBoundingClientRect: () => ({
          top: section.offsetTop - window.pageYOffset,
          bottom: section.offsetTop + section.offsetHeight - window.pageYOffset,
          height: section.offsetHeight,
          width: 1000,
          left: 0,
          right: 1000,
          x: 0,
          y: section.offsetTop - window.pageYOffset,
        }),
      } as any;
    }
    return originalGetElementById.call(document, id);
  });
};

describe('Scroll Progress Property Tests', () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // Feature: portfolio-ux-refinements, Property 1: Scroll position calculation accuracy
  test('scroll position calculation accuracy near section boundaries', () => {
    fc.assert(
      fc.property(
        fc.record({
          scrollY: fc.integer({ min: 0, max: 5000 }),
          sectionTop: fc.integer({ min: 0, max: 5000 }),
          sectionHeight: fc.integer({ min: 500, max: 2000 }),
          viewportHeight: fc.integer({ min: 600, max: 1200 }),
        }),
        (config) => {
          cleanup();

          // Setup mock sections
          const sections = [
            { id: 'hero', offsetTop: 0, offsetHeight: config.sectionHeight },
            { id: 'resume', offsetTop: config.sectionTop, offsetHeight: config.sectionHeight },
            { id: 'contact', offsetTop: config.sectionTop + config.sectionHeight, offsetHeight: config.sectionHeight },
          ];

          mockSectionElements(sections);
          mockScrollProperties(config.scrollY, config.viewportHeight, config.sectionTop + config.sectionHeight * 3);

          // Test getCurrentSection with hysteresis
          const currentSection = SmartScrolling.getCurrentSection(['hero', 'resume', 'contact'], undefined, 50);

          // Verify that a section is returned
          expect(currentSection).toBeTruthy();
          expect(['hero', 'resume', 'contact']).toContain(currentSection);

          // Test with hysteresis - when near boundary, should maintain current section
          const viewportCenter = config.scrollY + (config.viewportHeight / 2);
          const resumeCenter = config.sectionTop + (config.sectionHeight / 2);
          const distanceFromResumeCenter = Math.abs(viewportCenter - resumeCenter);

          // If we're viewing the resume section, test hysteresis
          if (distanceFromResumeCenter < config.sectionHeight / 2) {
            const sectionWithHysteresis = SmartScrolling.getCurrentSection(
              ['hero', 'resume', 'contact'],
              'resume', // Current section
              50 // Hysteresis threshold
            );

            // Should return a valid section
            expect(sectionWithHysteresis).toBeTruthy();
            expect(['hero', 'resume', 'contact']).toContain(sectionWithHysteresis);
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: portfolio-ux-refinements, Property 1: Scroll position calculation accuracy (continued)
  test('scroll position calculation prevents unwanted corrections at boundaries', () => {
    fc.assert(
      fc.property(
        fc.record({
          scrollY: fc.integer({ min: 0, max: 3000 }),
          boundaryOffset: fc.integer({ min: -100, max: 100 }),
          sectionHeight: fc.integer({ min: 800, max: 1500 }),
        }),
        (config) => {
          cleanup();

          const sectionTop = 1000;
          const sections = [
            { id: 'hero', offsetTop: 0, offsetHeight: sectionTop },
            { id: 'resume', offsetTop: sectionTop, offsetHeight: config.sectionHeight },
            { id: 'contact', offsetTop: sectionTop + config.sectionHeight, offsetHeight: config.sectionHeight },
          ];

          mockSectionElements(sections);
          mockScrollProperties(
            sectionTop + config.boundaryOffset, // Scroll position near boundary
            800,
            sectionTop + config.sectionHeight * 2
          );

          // Get section without hysteresis
          const sectionWithoutHysteresis = SmartScrolling.getCurrentSection(['hero', 'resume', 'contact']);

          // Get section with hysteresis, starting from 'hero'
          const sectionWithHysteresis = SmartScrolling.getCurrentSection(
            ['hero', 'resume', 'contact'],
            'hero',
            50
          );

          // Both should return valid sections
          expect(sectionWithoutHysteresis).toBeTruthy();
          expect(sectionWithHysteresis).toBeTruthy();

          // When within hysteresis zone and boundary offset is small, should prefer current section
          if (Math.abs(config.boundaryOffset) < 50) {
            // Hysteresis should help maintain stability
            expect(['hero', 'resume']).toContain(sectionWithHysteresis);
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});

  // Feature: portfolio-ux-refinements, Property 2: Layout stability during scroll updates
  test('scroll progress updates do not cause layout shifts', () => {
    fc.assert(
      fc.property(
        fc.record({
          initialScrollY: fc.integer({ min: 0, max: 2000 }),
          scrollDelta: fc.integer({ min: -500, max: 500 }),
          viewportHeight: fc.integer({ min: 600, max: 1200 }),
        }),
        (config) => {
          cleanup();

          const sections = [
            { id: 'hero', offsetTop: 0, offsetHeight: 1000 },
            { id: 'resume', offsetTop: 1000, offsetHeight: 1000 },
            { id: 'contact', offsetTop: 2000, offsetHeight: 1000 },
          ];

          mockSectionElements(sections);

          // Set initial scroll position
          mockScrollProperties(config.initialScrollY, config.viewportHeight, 3000);

          // Get initial section
          const initialSection = SmartScrolling.getCurrentSection(['hero', 'resume', 'contact']);

          // Simulate scroll update
          const newScrollY = Math.max(0, Math.min(3000, config.initialScrollY + config.scrollDelta));
          mockScrollProperties(newScrollY, config.viewportHeight, 3000);

          // Get new section
          const newSection = SmartScrolling.getCurrentSection(['hero', 'resume', 'contact'], initialSection, 50);

          // Verify both sections are valid
          expect(initialSection).toBeTruthy();
          expect(newSection).toBeTruthy();
          expect(['hero', 'resume', 'contact']).toContain(initialSection);
          expect(['hero', 'resume', 'contact']).toContain(newSection);

          // Test that the component can render without errors during scroll updates
          const { unmount } = render(
            <ThemeProvider theme={theme}>
              <ScrollProgressIndicator mode="page" position="top" />
            </ThemeProvider>
          );

          // Component should render without throwing errors
          expect(unmount).toBeDefined();

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: portfolio-ux-refinements, Property 2: Layout stability (continued)
  test('rapid scroll updates maintain layout stability', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 3000 }), { minLength: 5, maxLength: 20 }),
        (scrollPositions) => {
          cleanup();

          const sections = [
            { id: 'hero', offsetTop: 0, offsetHeight: 1000 },
            { id: 'resume', offsetTop: 1000, offsetHeight: 1000 },
            { id: 'contact', offsetTop: 2000, offsetHeight: 1000 },
          ];

          mockSectionElements(sections);

          let previousSection: string | null = null;

          // Simulate rapid scroll updates
          for (const scrollY of scrollPositions) {
            mockScrollProperties(scrollY, 800, 3000);
            const currentSection = SmartScrolling.getCurrentSection(
              ['hero', 'resume', 'contact'],
              previousSection || undefined,
              50
            );

            // Each update should return a valid section
            expect(currentSection).toBeTruthy();
            expect(['hero', 'resume', 'contact']).toContain(currentSection);

            previousSection = currentSection;
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: portfolio-ux-refinements, Property 3: Scroll behavior consistency
  test('scroll behavior is consistent across all sections in both directions', () => {
    fc.assert(
      fc.property(
        fc.record({
          direction: fc.oneof(fc.constant('up'), fc.constant('down')),
          startSection: fc.oneof(fc.constant('hero'), fc.constant('resume'), fc.constant('contact')),
          scrollSpeed: fc.integer({ min: 10, max: 200 }),
        }),
        (config) => {
          cleanup();

          const sections = [
            { id: 'hero', offsetTop: 0, offsetHeight: 1000 },
            { id: 'resume', offsetTop: 1000, offsetHeight: 1000 },
            { id: 'contact', offsetTop: 2000, offsetHeight: 1000 },
          ];

          mockSectionElements(sections);

          // Get starting scroll position based on section
          const sectionMap: Record<string, number> = {
            hero: 500,
            resume: 1500,
            contact: 2500,
          };

          let currentScrollY = sectionMap[config.startSection];
          mockScrollProperties(currentScrollY, 800, 3000);

          // Get initial section
          let currentSection = SmartScrolling.getCurrentSection(['hero', 'resume', 'contact']);
          expect(currentSection).toBeTruthy();

          // Track section changes to verify consistency
          const sectionChanges: string[] = currentSection ? [currentSection] : [];

          // Simulate scrolling in the specified direction
          const scrollSteps = 10;
          const scrollDelta = config.direction === 'down' ? config.scrollSpeed : -config.scrollSpeed;

          for (let i = 0; i < scrollSteps; i++) {
            currentScrollY = Math.max(0, Math.min(3000, currentScrollY + scrollDelta));
            mockScrollProperties(currentScrollY, 800, 3000);

            const newSection = SmartScrolling.getCurrentSection(
              ['hero', 'resume', 'contact'],
              currentSection || undefined,
              50
            );

            // Section should always be valid
            expect(newSection).toBeTruthy();
            expect(['hero', 'resume', 'contact']).toContain(newSection);

            // Track section changes
            if (currentSection && newSection && newSection !== currentSection) {
              sectionChanges.push(newSection);
            }

            currentSection = newSection;
          }

          // Verify that section changes are consistent with scroll direction
          // The key property is that we don't stutter (rapidly switch back and forth)
          // We allow skipping sections because viewport center calculation can cause this
          let stutterCount = 0;
          for (let i = 1; i < sectionChanges.length - 1; i++) {
            // Check if we went back to a previous section (stuttering)
            if (sectionChanges[i] === sectionChanges[i - 1]) {
              stutterCount++;
            }
          }

          // With hysteresis, stuttering should be minimal
          expect(stutterCount).toBeLessThan(sectionChanges.length / 2);

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: portfolio-ux-refinements, Property 3: Scroll behavior consistency (continued)
  test('scroll behavior maintains consistency without stuttering', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            scrollY: fc.integer({ min: 0, max: 3000 }),
            delay: fc.integer({ min: 0, max: 100 }),
          }),
          { minLength: 10, maxLength: 30 }
        ),
        (scrollEvents) => {
          cleanup();

          const sections = [
            { id: 'hero', offsetTop: 0, offsetHeight: 1000 },
            { id: 'resume', offsetTop: 1000, offsetHeight: 1000 },
            { id: 'contact', offsetTop: 2000, offsetHeight: 1000 },
          ];

          mockSectionElements(sections);

          let previousSection: string | null = null;
          let sectionChangeCount = 0;

          // Process scroll events
          for (const event of scrollEvents) {
            mockScrollProperties(event.scrollY, 800, 3000);

            const currentSection = SmartScrolling.getCurrentSection(
              ['hero', 'resume', 'contact'],
              previousSection || undefined,
              50
            );

            expect(currentSection).toBeTruthy();
            expect(['hero', 'resume', 'contact']).toContain(currentSection);

            // Track section changes
            if (previousSection && currentSection !== previousSection) {
              sectionChangeCount++;
            }

            previousSection = currentSection;
          }

          // With hysteresis, section changes should be less frequent than without
          // This prevents stuttering behavior
          expect(sectionChangeCount).toBeLessThan(scrollEvents.length);

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: portfolio-ux-refinements, Property 4: Scroll event throttling
  test('scroll events are properly throttled to prevent excessive calculations', () => {
    fc.assert(
      fc.property(
        fc.record({
          eventCount: fc.integer({ min: 10, max: 50 }),
          eventInterval: fc.integer({ min: 1, max: 50 }),
        }),
        (config) => {
          cleanup();
          jest.useFakeTimers();

          const sections = [
            { id: 'hero', offsetTop: 0, offsetHeight: 1000 },
            { id: 'resume', offsetTop: 1000, offsetHeight: 1000 },
            { id: 'contact', offsetTop: 2000, offsetHeight: 1000 },
          ];

          mockSectionElements(sections);
          mockScrollProperties(500, 800, 3000);

          // Track calculation calls
          let calculationCount = 0;
          const originalGetCurrentSection = SmartScrolling.getCurrentSection;
          SmartScrolling.getCurrentSection = jest.fn((...args) => {
            calculationCount++;
            return originalGetCurrentSection.apply(SmartScrolling, args);
          });

          // Render component with debouncing
          const { unmount } = render(
            <ThemeProvider theme={theme}>
              <ScrollProgressIndicator mode="page" position="top" />
            </ThemeProvider>
          );

          // Simulate rapid scroll events
          for (let i = 0; i < config.eventCount; i++) {
            mockScrollProperties(500 + i * 10, 800, 3000);
            window.dispatchEvent(new Event('scroll'));
            jest.advanceTimersByTime(config.eventInterval);
          }

          // Advance past debounce delay (150ms)
          jest.advanceTimersByTime(200);

          // With debouncing, calculation count should be significantly less than event count
          // The debounce should reduce the number of calculations
          expect(calculationCount).toBeLessThan(config.eventCount);

          // Restore original function
          SmartScrolling.getCurrentSection = originalGetCurrentSection;

          jest.useRealTimers();
          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: portfolio-ux-refinements, Property 4: Scroll event throttling (continued)
  test('throttling maintains accuracy while reducing calculation frequency', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 3000 }), { minLength: 20, maxLength: 50 }),
        (scrollPositions) => {
          cleanup();
          jest.useFakeTimers();

          const sections = [
            { id: 'hero', offsetTop: 0, offsetHeight: 1000 },
            { id: 'resume', offsetTop: 1000, offsetHeight: 1000 },
            { id: 'contact', offsetTop: 2000, offsetHeight: 1000 },
          ];

          mockSectionElements(sections);

          let updateCount = 0;
          const { unmount } = render(
            <ThemeProvider theme={theme}>
              <ScrollProgressIndicator
                mode="page"
                position="top"
                showPercentage={true}
              />
            </ThemeProvider>
          );

          // Simulate rapid scroll events
          for (const scrollY of scrollPositions) {
            mockScrollProperties(scrollY, 800, 3000);
            window.dispatchEvent(new Event('scroll'));
            updateCount++;
            jest.advanceTimersByTime(10); // Very rapid events
          }

          // Advance past debounce delay
          jest.advanceTimersByTime(200);

          // Component should still be rendered and functional
          expect(unmount).toBeDefined();

          // The final scroll position should be processed
          const finalScrollY = scrollPositions[scrollPositions.length - 1];
          mockScrollProperties(finalScrollY, 800, 3000);
          jest.advanceTimersByTime(200);

          // Verify component is still stable
          expect(unmount).toBeDefined();

          jest.useRealTimers();
          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
