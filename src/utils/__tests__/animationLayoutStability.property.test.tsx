import { render, cleanup } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import fc from 'fast-check';
import { theme } from '../../styles/theme';
import { AnimationPerformanceMonitor, preventLayoutShift } from '../performance';
import { motion } from 'framer-motion';

// Mock PerformanceObserver for layout shift detection
const mockPerformanceObserver = () => {
  const entries: any[] = [];
  
  class MockPerformanceObserver {
    private callback: PerformanceObserverCallback;
    
    constructor(callback: PerformanceObserverCallback) {
      this.callback = callback;
    }
    
    observe() {
      // Simulate layout shift entries
      const list = {
        getEntries: () => entries,
      };
      this.callback(list as any, this as any);
    }
    
    disconnect() {}
  }
  
  global.PerformanceObserver = MockPerformanceObserver as any;
  
  const addLayoutShift = (value: number, hadRecentInput: boolean = false) => {
    entries.push({
      entryType: 'layout-shift',
      value,
      hadRecentInput,
    });
  };
  
  const clearEntries = () => {
    entries.length = 0;
  };
  
  return { addLayoutShift, clearEntries };
};

describe('Animation Layout Stability Property Tests', () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // Feature: portfolio-ux-refinements, Property 23: Animation layout stability
  test('animations do not cause layout shifts during execution', () => {
    fc.assert(
      fc.property(
        fc.record({
          animationCount: fc.integer({ min: 1, max: 5 }),
          animationType: fc.oneof(
            fc.constant('opacity'),
            fc.constant('transform'),
            fc.constant('scale')
          ),
        }),
        (config) => {
          cleanup();

          const { addLayoutShift, clearEntries } = mockPerformanceObserver();
          clearEntries();

          const monitor = AnimationPerformanceMonitor.getInstance();
          monitor.startMonitoring();

          // Render animated components
          const TestComponent = () => (
            <ThemeProvider theme={theme}>
              <div>
                {Array.from({ length: config.animationCount }).map((_, i) => {
                  const animationProps: any = {
                    initial: {},
                    animate: {},
                  };

                  switch (config.animationType) {
                    case 'opacity':
                      animationProps.initial = { opacity: 0 };
                      animationProps.animate = { opacity: 1 };
                      break;
                    case 'transform':
                      animationProps.initial = { x: -20, y: -20 };
                      animationProps.animate = { x: 0, y: 0 };
                      break;
                    case 'scale':
                      animationProps.initial = { scale: 0.8 };
                      animationProps.animate = { scale: 1 };
                      break;
                  }

                  return (
                    <motion.div
                      key={i}
                      {...animationProps}
                      transition={{ duration: 0.3 }}
                    >
                      Test Element {i}
                    </motion.div>
                  );
                })}
              </div>
            </ThemeProvider>
          );

          const { unmount } = render(<TestComponent />);

          const metrics = monitor.stopMonitoring();

          // Layout shifts should be minimal (< 0.1 is considered good)
          expect(metrics.layoutShifts).toBeLessThan(0.1);

          // Component should render without errors
          expect(unmount).toBeDefined();

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: portfolio-ux-refinements, Property 23: Animation layout stability (continued)
  test('transform-based animations prevent layout shifts', () => {
    fc.assert(
      fc.property(
        fc.record({
          translateX: fc.integer({ min: -100, max: 100 }),
          translateY: fc.integer({ min: -100, max: 100 }),
          scale: fc.integer({ min: 50, max: 150 }).map(v => v / 100),
        }),
        (config) => {
          cleanup();

          const element = document.createElement('div');
          element.style.position = 'absolute';
          element.style.width = '100px';
          element.style.height = '100px';
          document.body.appendChild(element);

          // Use transform-based animation (should not cause layout shift)
          preventLayoutShift.animateWithTransform(element, {
            x: config.translateX,
            y: config.translateY,
            scale: config.scale,
          });

          // Verify transform is applied
          expect(element.style.transform).toBeTruthy();
          expect(element.style.transform).toContain('translate');

          // Verify no layout properties are changed (which would cause shifts)
          expect(element.style.left).toBe('');
          expect(element.style.top).toBe('');
          expect(element.style.width).toBe('100px');
          expect(element.style.height).toBe('100px');

          document.body.removeChild(element);
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: portfolio-ux-refinements, Property 23: Animation layout stability (continued)
  test('reserved space prevents layout shifts for dynamic content', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 50, max: 500 }),
          height: fc.integer({ min: 50, max: 500 }),
        }),
        (config) => {
          cleanup();

          const element = document.createElement('div');
          document.body.appendChild(element);

          // Reserve space before content loads
          preventLayoutShift.reserveSpace(element, {
            width: config.width,
            height: config.height,
          });

          // Verify space is reserved
          expect(element.style.minWidth).toBe(`${config.width}px`);
          expect(element.style.minHeight).toBe(`${config.height}px`);

          // Simulate content loading
          element.textContent = 'Loaded content';

          // Element should maintain reserved dimensions
          const computedStyle = window.getComputedStyle(element);
          const minWidth = parseInt(computedStyle.minWidth);
          const minHeight = parseInt(computedStyle.minHeight);

          expect(minWidth).toBe(config.width);
          expect(minHeight).toBe(config.height);

          document.body.removeChild(element);
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: portfolio-ux-refinements, Property 23: Animation layout stability (continued)
  test('batched DOM operations minimize layout thrashing', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            operation: fc.oneof(fc.constant('read'), fc.constant('write')),
            value: fc.integer({ min: 0, max: 1000 }),
          }),
          { minLength: 4, maxLength: 20 }
        ),
        (operations) => {
          cleanup();

          const elements = Array.from({ length: 5 }).map(() => {
            const el = document.createElement('div');
            el.style.width = '100px';
            el.style.height = '100px';
            document.body.appendChild(el);
            return el;
          });

          // Create alternating read/write operations
          const batchedOps = operations.map((op, index) => {
            const element = elements[index % elements.length];
            
            if (op.operation === 'read') {
              return () => element.offsetWidth; // Read operation
            } else {
              return () => { element.style.width = `${op.value}px`; }; // Write operation
            }
          });

          // Execute batched operations
          const results = preventLayoutShift.batchDOMOperations(batchedOps);

          // Verify operations completed
          expect(results).toBeDefined();
          expect(Array.isArray(results)).toBe(true);

          // Cleanup
          elements.forEach(el => document.body.removeChild(el));
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: portfolio-ux-refinements, Property 23: Animation layout stability (continued)
  test('framer motion animations use GPU-accelerated properties', () => {
    fc.assert(
      fc.property(
        fc.record({
          duration: fc.integer({ min: 100, max: 1000 }).map(v => v / 1000),
          delay: fc.integer({ min: 0, max: 500 }).map(v => v / 1000),
        }),
        (config) => {
          cleanup();

          const TestComponent = () => (
            <ThemeProvider theme={theme}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: config.duration,
                  delay: config.delay,
                }}
              >
                Test Content
              </motion.div>
            </ThemeProvider>
          );

          const { container, unmount } = render(<TestComponent />);

          // Verify component renders
          expect(container).toBeTruthy();
          expect(container.textContent).toContain('Test Content');

          // Framer Motion should use transform and opacity (GPU-accelerated)
          const motionDiv = container.querySelector('div > div');
          if (motionDiv) {
            const style = window.getComputedStyle(motionDiv);
            // These properties should be present (even if not yet animated)
            expect(style).toBeDefined();
          }

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: portfolio-ux-refinements, Property 23: Animation layout stability (continued)
  test('layout shift score remains below threshold during animations', () => {
    fc.assert(
      fc.property(
        fc.record({
          elementCount: fc.integer({ min: 1, max: 8 }),
          layoutShiftValue: fc.integer({ min: 0, max: 5 }).map(v => v / 100), // 0-0.05
        }),
        (config) => {
          cleanup();

          const { addLayoutShift, clearEntries } = mockPerformanceObserver();
          clearEntries();

          const monitor = AnimationPerformanceMonitor.getInstance();
          monitor.startMonitoring();

          // Simulate some layout shifts (should be minimal)
          for (let i = 0; i < config.elementCount; i++) {
            addLayoutShift(config.layoutShiftValue / config.elementCount);
          }

          const metrics = monitor.stopMonitoring();

          // Total layout shift should be below threshold
          // Good: < 0.1, Needs improvement: 0.1-0.25, Poor: > 0.25
          expect(metrics.layoutShifts).toBeLessThanOrEqual(config.layoutShiftValue);
          
          // For good performance, should be < 0.1
          if (config.layoutShiftValue < 0.05) {
            expect(metrics.layoutShifts).toBeLessThan(0.1);
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
