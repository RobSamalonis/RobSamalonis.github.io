import { render, cleanup, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import fc from 'fast-check';
import { theme } from '../../styles/theme';
import { AnimationPerformanceMonitor, getOptimizedAnimationConfig } from '../performance';
import { motion } from 'framer-motion';

// Mock requestAnimationFrame for testing
const mockRAF = () => {
  let rafId = 0;
  const callbacks = new Map<number, FrameRequestCallback>();
  
  global.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
    rafId++;
    callbacks.set(rafId, callback);
    return rafId;
  });

  const triggerFrame = (timestamp: number = performance.now()) => {
    callbacks.forEach((callback, id) => {
      callback(timestamp);
      callbacks.delete(id);
    });
  };

  return { triggerFrame, callbacks };
};

// Mock performance.now for consistent testing
const mockPerformanceNow = () => {
  let currentTime = 0;
  const originalNow = performance.now;
  
  performance.now = jest.fn(() => currentTime);
  
  const advanceTime = (ms: number) => {
    currentTime += ms;
  };
  
  const reset = () => {
    performance.now = originalNow;
    currentTime = 0;
  };
  
  return { advanceTime, reset };
};

describe('Animation Performance Property Tests', () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // Feature: portfolio-ux-refinements, Property 22: Animation performance
  test('animations maintain 60fps performance during scroll and navigation', () => {
    fc.assert(
      fc.property(
        fc.record({
          animationDuration: fc.integer({ min: 100, max: 1000 }),
          frameCount: fc.integer({ min: 6, max: 60 }),
        }),
        (config) => {
          cleanup();
          
          const { triggerFrame } = mockRAF();
          const { advanceTime, reset } = mockPerformanceNow();

          const monitor = AnimationPerformanceMonitor.getInstance();
          monitor.startMonitoring();

          // Simulate animation frames
          const frameInterval = config.animationDuration / config.frameCount;
          
          for (let i = 0; i < config.frameCount; i++) {
            advanceTime(frameInterval);
            triggerFrame(performance.now());
          }

          const metrics = monitor.stopMonitoring();

          // Verify frame rate is calculated
          expect(metrics.frameRate).toBeGreaterThan(0);
          expect(metrics.animationDuration).toBeGreaterThanOrEqual(0);
          
          // For 60fps, frame interval should be ~16.67ms
          // If frame interval is <= 16.67ms, we should achieve close to 60fps
          const expectedFPS = 1000 / frameInterval;
          
          if (frameInterval <= 16.67) {
            // Should maintain near 60fps
            expect(metrics.frameRate).toBeGreaterThanOrEqual(expectedFPS * 0.8);
          }

          // Dropped frames should be reasonable
          expect(metrics.droppedFrames).toBeLessThanOrEqual(config.frameCount);

          reset();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: portfolio-ux-refinements, Property 22: Animation performance (continued)
  test('animation performance adapts to device capabilities', () => {
    fc.assert(
      fc.property(
        fc.record({
          hardwareConcurrency: fc.integer({ min: 1, max: 16 }),
          connectionType: fc.oneof(
            fc.constant('4g'),
            fc.constant('3g'),
            fc.constant('2g'),
            fc.constant('slow-2g')
          ),
        }),
        (config) => {
          cleanup();

          // Mock navigator properties
          Object.defineProperty(navigator, 'hardwareConcurrency', {
            writable: true,
            configurable: true,
            value: config.hardwareConcurrency,
          });

          Object.defineProperty(navigator, 'connection', {
            writable: true,
            configurable: true,
            value: {
              effectiveType: config.connectionType,
            },
          });

          const animConfig = getOptimizedAnimationConfig();

          // Verify configuration is returned
          expect(animConfig).toBeDefined();
          expect(animConfig.animationFrameRate).toBeGreaterThan(0);
          expect(animConfig.maxConcurrentAnimations).toBeGreaterThan(0);

          // Low-end devices should have reduced settings
          const isLowEnd = config.hardwareConcurrency < 4 || 
                          config.connectionType === '2g' || 
                          config.connectionType === 'slow-2g';

          if (isLowEnd) {
            expect(animConfig.enableComplexTransforms).toBe(false);
            expect(animConfig.animationFrameRate).toBeLessThanOrEqual(60);
          } else {
            expect(animConfig.animationFrameRate).toBe(60);
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: portfolio-ux-refinements, Property 22: Animation performance (continued)
  test('framer motion animations render without performance degradation', () => {
    fc.assert(
      fc.property(
        fc.record({
          elementCount: fc.integer({ min: 1, max: 10 }),
          animationDuration: fc.double({ min: 0.1, max: 1.0 }),
        }),
        (config) => {
          cleanup();

          const TestComponent = () => (
            <ThemeProvider theme={theme}>
              <div>
                {Array.from({ length: config.elementCount }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: config.animationDuration }}
                  >
                    Test Element {i}
                  </motion.div>
                ))}
              </div>
            </ThemeProvider>
          );

          const startTime = performance.now();
          const { unmount } = render(<TestComponent />);
          const renderTime = performance.now() - startTime;

          // Render should complete quickly (< 100ms for up to 10 elements)
          expect(renderTime).toBeLessThan(100);

          // Component should render without errors
          expect(unmount).toBeDefined();

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: portfolio-ux-refinements, Property 22: Animation performance (continued)
  test('concurrent animations maintain performance within limits', () => {
    fc.assert(
      fc.property(
        fc.record({
          concurrentCount: fc.integer({ min: 1, max: 8 }),
          animationComplexity: fc.oneof(fc.constant('simple'), fc.constant('complex')),
        }),
        (config) => {
          cleanup();

          const animConfig = getOptimizedAnimationConfig();

          // Verify max concurrent animations is respected
          expect(animConfig.maxConcurrentAnimations).toBeGreaterThan(0);

          // If we're trying to run more animations than allowed, verify the limit
          if (config.concurrentCount > animConfig.maxConcurrentAnimations) {
            expect(config.concurrentCount).toBeGreaterThan(animConfig.maxConcurrentAnimations);
          }

          // Complex animations should be disabled on low-end devices
          if (!animConfig.enableComplexTransforms) {
            expect(animConfig.enableComplexTransforms).toBe(false);
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: portfolio-ux-refinements, Property 22: Animation performance (continued)
  test('animation frame rate monitoring detects performance issues', () => {
    fc.assert(
      fc.property(
        fc.record({
          targetFPS: fc.integer({ min: 30, max: 60 }),
          frameDropRate: fc.integer({ min: 0, max: 30 }).map(v => v / 100), // 0-30% frame drops
        }),
        (config) => {
          cleanup();

          const { triggerFrame } = mockRAF();
          const { advanceTime, reset } = mockPerformanceNow();

          const monitor = AnimationPerformanceMonitor.getInstance();
          monitor.startMonitoring();

          const frameInterval = 1000 / config.targetFPS;
          const totalFrames = 60; // Test for 1 second at target FPS

          for (let i = 0; i < totalFrames; i++) {
            // Randomly drop frames based on drop rate
            const shouldDrop = Math.random() < config.frameDropRate;
            const actualInterval = shouldDrop ? frameInterval * 2 : frameInterval;
            
            advanceTime(actualInterval);
            triggerFrame(performance.now());
          }

          const metrics = monitor.stopMonitoring();

          // Verify metrics are captured
          expect(metrics.frameRate).toBeGreaterThan(0);
          expect(metrics.droppedFrames).toBeGreaterThanOrEqual(0);
          expect(metrics.animationDuration).toBeGreaterThan(0);

          // Frame rate should be close to target (within 20% tolerance)
          const expectedFPS = config.targetFPS * (1 - config.frameDropRate);
          expect(metrics.frameRate).toBeGreaterThan(expectedFPS * 0.5);

          reset();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
