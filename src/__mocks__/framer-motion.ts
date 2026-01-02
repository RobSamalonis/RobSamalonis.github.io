// Mock Framer Motion for testing
import React from 'react';

// Create a function that can be called directly or accessed as a property
const createMotionComponent = (component: any) => {
  return React.forwardRef(({ children, ...props }: any, ref: any) => {
    const { 
      initial, animate, exit, transition, variants, 
      whileHover, whileTap, whileInView, whileFocus,
      drag, dragConstraints, dragElastic, dragMomentum,
      layout, layoutId, style, onAnimationStart, onAnimationComplete,
      x, y,
      ...domProps 
    } = props;
    
    // Use React.createElement to create the element with ref
    return React.createElement(component, { ...domProps, ref }, children);
  });
};

// Create motion as a callable function
function motionFunction(component: any) {
  return createMotionComponent(component);
}

// Add properties for HTML elements
motionFunction.div = createMotionComponent('div');
motionFunction.section = createMotionComponent('section');
motionFunction.button = createMotionComponent('button');
motionFunction.span = createMotionComponent('span');
motionFunction.a = createMotionComponent('a');
motionFunction.h1 = createMotionComponent('h1');
motionFunction.h2 = createMotionComponent('h2');
motionFunction.h3 = createMotionComponent('h3');
motionFunction.h4 = createMotionComponent('h4');
motionFunction.h5 = createMotionComponent('h5');
motionFunction.h6 = createMotionComponent('h6');
motionFunction.p = createMotionComponent('p');
motionFunction.ul = createMotionComponent('ul');
motionFunction.li = createMotionComponent('li');
motionFunction.form = createMotionComponent('form');
motionFunction.input = createMotionComponent('input');
motionFunction.textarea = createMotionComponent('textarea');

module.exports = {
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
  useAnimationControls: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn()
  }),
  useInView: () => true
};
