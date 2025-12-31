import '@testing-library/jest-dom';

// Configure React Testing Library to automatically wrap state updates in act()
global.IS_REACT_ACT_ENVIRONMENT = true;

// Suppress specific React act() warnings that are caused by Material-UI animations
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (
        args[0].includes('Warning: An update to') ||
        args[0].includes('inside a test was not wrapped in act') ||
        args[0].includes('ReactDOMTestUtils.act is deprecated') ||
        args[0].includes('Warning: `ReactDOMTestUtils.act` is deprecated')
      )
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
