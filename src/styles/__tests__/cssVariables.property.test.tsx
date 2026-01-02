import fc from 'fast-check';
import { cssVariables } from '../theme';

// Feature: portfolio-ux-refinements, Property 5: Theme consistency
describe('CSS Custom Properties Theme Consistency', () => {
  test('spacing custom properties are consistently defined', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('xs'),
          fc.constant('sm'),
          fc.constant('md'),
          fc.constant('lg'),
          fc.constant('xl'),
          fc.constant('2xl'),
          fc.constant('3xl'),
          fc.constant('4xl')
        ),
        (spacingKey) => {
          const spacingValue = cssVariables.spacing[spacingKey as keyof typeof cssVariables.spacing];
          
          // Verify spacing variable is defined and follows CSS var() format
          expect(spacingValue).toBeDefined();
          expect(spacingValue).toMatch(/^var\(--spacing-/);
          expect(spacingValue).toMatch(/\)$/);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('color custom properties are consistently defined', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.record({
            category: fc.constant('primary' as const),
            key: fc.oneof(fc.constant('black' as const), fc.constant('darkGray' as const), fc.constant('charcoal' as const))
          }),
          fc.record({
            category: fc.constant('accent' as const),
            key: fc.oneof(
              fc.constant('electricBlue' as const),
              fc.constant('hotPink' as const),
              fc.constant('neonGreen' as const),
              fc.constant('vibrantPurple' as const)
            )
          }),
          fc.record({
            category: fc.constant('neutral' as const),
            key: fc.oneof(
              fc.constant('white' as const),
              fc.constant('gray100' as const),
              fc.constant('gray200' as const),
              fc.constant('gray300' as const),
              fc.constant('gray400' as const),
              fc.constant('gray500' as const)
            )
          })
        ),
        ({ category, key }) => {
          const colors = cssVariables.colors[category];
          const colorValue = colors[key as keyof typeof colors];
          
          // Verify color variable is defined and follows CSS var() format
          expect(colorValue).toBeDefined();
          expect(colorValue).toMatch(/^var\(--color-/);
          expect(colorValue).toMatch(/\)$/);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('typography custom properties are consistently defined', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('xs'),
          fc.constant('sm'),
          fc.constant('base'),
          fc.constant('lg'),
          fc.constant('xl'),
          fc.constant('2xl'),
          fc.constant('3xl'),
          fc.constant('4xl')
        ),
        (sizeKey) => {
          const fontSize = cssVariables.typography.fontSize[sizeKey as keyof typeof cssVariables.typography.fontSize];
          const lineHeight = cssVariables.typography.lineHeight[sizeKey as keyof typeof cssVariables.typography.lineHeight];
          const letterSpacing = cssVariables.typography.letterSpacing[sizeKey as keyof typeof cssVariables.typography.letterSpacing];
          
          // Verify typography variables are defined and follow CSS var() format
          expect(fontSize).toBeDefined();
          expect(fontSize).toMatch(/^var\(--font-size-/);
          expect(lineHeight).toBeDefined();
          expect(lineHeight).toMatch(/^var\(--line-height-/);
          expect(letterSpacing).toBeDefined();
          expect(letterSpacing).toMatch(/^var\(--letter-spacing-/);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('shadow custom properties are consistently defined', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('sm'),
          fc.constant('md'),
          fc.constant('lg'),
          fc.constant('xl'),
          fc.constant('2xl'),
          fc.constant('inner')
        ),
        (shadowKey) => {
          const shadowValue = cssVariables.shadows[shadowKey as keyof typeof cssVariables.shadows];
          
          // Verify shadow variable is defined and follows CSS var() format
          expect(shadowValue).toBeDefined();
          expect(shadowValue).toMatch(/^var\(--shadow-/);
          expect(shadowValue).toMatch(/\)$/);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('glow effect custom properties are consistently defined', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('blue'),
          fc.constant('pink'),
          fc.constant('green'),
          fc.constant('purple')
        ),
        (glowKey) => {
          const glowValue = cssVariables.shadows.glow[glowKey as keyof typeof cssVariables.shadows.glow];
          
          // Verify glow variable is defined and follows CSS var() format
          expect(glowValue).toBeDefined();
          expect(glowValue).toMatch(/^var\(--glow-/);
          expect(glowValue).toMatch(/\)$/);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('animation custom properties are consistently defined', () => {
    fc.assert(
      fc.property(
        fc.record({
          duration: fc.oneof(
            fc.constant('fast'),
            fc.constant('normal'),
            fc.constant('slow'),
            fc.constant('slower')
          ),
          easing: fc.oneof(
            fc.constant('easeIn'),
            fc.constant('easeOut'),
            fc.constant('easeInOut'),
            fc.constant('spring')
          )
        }),
        ({ duration, easing }) => {
          const durationValue = cssVariables.animations.duration[duration as keyof typeof cssVariables.animations.duration];
          const easingValue = cssVariables.animations.easing[easing as keyof typeof cssVariables.animations.easing];
          
          // Verify animation variables are defined and follow CSS var() format
          expect(durationValue).toBeDefined();
          expect(durationValue).toMatch(/^var\(--duration-/);
          expect(easingValue).toBeDefined();
          expect(easingValue).toMatch(/^var\(--easing-/);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('font weight custom properties are consistently defined', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('light'),
          fc.constant('regular'),
          fc.constant('medium'),
          fc.constant('semibold'),
          fc.constant('bold'),
          fc.constant('extrabold')
        ),
        (weightKey) => {
          const weightValue = cssVariables.typography.fontWeight[weightKey as keyof typeof cssVariables.typography.fontWeight];
          
          // Verify font weight variable is defined and follows CSS var() format
          expect(weightValue).toBeDefined();
          expect(weightValue).toMatch(/^var\(--font-weight-/);
          expect(weightValue).toMatch(/\)$/);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('CSS custom properties maintain consistent naming convention', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.record({ type: fc.constant('color'), value: fc.constant(cssVariables.colors.accent.electricBlue) }),
          fc.record({ type: fc.constant('spacing'), value: fc.constant(cssVariables.spacing.md) }),
          fc.record({ type: fc.constant('fontSize'), value: fc.constant(cssVariables.typography.fontSize.base) }),
          fc.record({ type: fc.constant('shadow'), value: fc.constant(cssVariables.shadows.md) }),
          fc.record({ type: fc.constant('duration'), value: fc.constant(cssVariables.animations.duration.normal) })
        ),
        ({ type, value }) => {
          // All CSS variables should follow the var(--prefix-name) format
          expect(value).toMatch(/^var\(--[a-z-]+\)$/);
          
          // Verify the prefix matches the type
          switch (type) {
            case 'color':
              expect(value).toMatch(/^var\(--color-/);
              break;
            case 'spacing':
              expect(value).toMatch(/^var\(--spacing-/);
              break;
            case 'fontSize':
              expect(value).toMatch(/^var\(--font-size-/);
              break;
            case 'shadow':
              expect(value).toMatch(/^var\(--shadow-|--glow-/);
              break;
            case 'duration':
              expect(value).toMatch(/^var\(--duration-/);
              break;
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
