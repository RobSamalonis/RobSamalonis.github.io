// Mock framer-motion to avoid animation complexities in unit tests
jest.mock('framer-motion', () => {
  const React = require('react');
  
  const createMotionComponent = (component: any) => {
    return React.forwardRef(({ children, ...props }: any, ref: any) => {
      const { 
        whileHover, whileTap, animate, transition, initial, exit,
        variants, whileInView, drag, dragConstraints, dragElastic,
        dragMomentum, onDragStart, onDragEnd, onDrag, layout, layoutId,
        style, onAnimationStart, onAnimationComplete, x, y,
        ...domProps 
      } = props;
      return React.createElement(component, { ...domProps, ref }, children);
    });
  };
  
  // Create motion as a callable function
  const motionFunction = (component: any) => createMotionComponent(component);
  
  // Add properties for HTML elements
  motionFunction.div = createMotionComponent('div');
  motionFunction.section = createMotionComponent('section');
  motionFunction.button = createMotionComponent('button');
  motionFunction.span = createMotionComponent('span');
  motionFunction.a = createMotionComponent('a');
  motionFunction.form = createMotionComponent('form');
  motionFunction.input = createMotionComponent('input');
  motionFunction.textarea = createMotionComponent('textarea');
  
  return {
    motion: motionFunction,
    AnimatePresence: ({ children }: any) => children,
    useScroll: () => ({
      scrollY: { get: () => 0, on: jest.fn(), destroy: jest.fn() },
      scrollYProgress: { get: () => 0, on: jest.fn(), destroy: jest.fn() }
    }),
    useTransform: () => ({ 
      get: () => 0, 
      on: jest.fn(), 
      destroy: jest.fn() 
    }),
    useSpring: (value: any) => value || { 
      get: () => 0, 
      on: jest.fn(), 
      destroy: jest.fn() 
    },
    useMotionValue: (initial: any) => ({ 
      get: () => initial, 
      set: jest.fn(), 
      on: jest.fn(), 
      destroy: jest.fn() 
    }),
    useInView: () => true,
  };
});

import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders developer name in hero section', async () => {
    render(<App />);
    // Wait for lazy-loaded Hero component to render
    const heading = await waitFor(() => screen.getByText(/Robert/i));
    expect(heading).toBeInTheDocument();
  });

  test('renders main sections', async () => {
    const { container } = render(<App />);
    // Wait for lazy-loaded components to render
    await waitFor(() => {
      const heroSection = container.querySelector('#hero');
      expect(heroSection).toBeInTheDocument();
    });
  });

  test('renders hero section with correct id', async () => {
    const { container } = render(<App />);
    // Wait for lazy-loaded Hero component to render
    await waitFor(() => {
      const heroSection = container.querySelector('#hero');
      expect(heroSection).toBeInTheDocument();
    });
  });
});
