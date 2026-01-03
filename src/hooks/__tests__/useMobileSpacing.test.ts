import { renderHook, act } from '@testing-library/react';
import { useMobileSpacing } from '../useMobileSpacing';

// Mock window properties
const mockWindow = {
  innerWidth: 1024,
  innerHeight: 768,
  scrollY: 0,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  scrollTo: jest.fn(),
};

// Mock navigator
const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
};

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: mockWindow.innerWidth,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: mockWindow.innerHeight,
});

Object.defineProperty(window, 'scrollY', {
  writable: true,
  configurable: true,
  value: mockWindow.scrollY,
});

Object.defineProperty(navigator, 'userAgent', {
  writable: true,
  configurable: true,
  value: mockNavigator.userAgent,
});

describe('useMobileSpacing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window properties
    (window as any).innerWidth = 1024;
    (window as any).innerHeight = 768;
    (window as any).scrollY = 0;
    (navigator as any).userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
  });

  it('should initialize with desktop defaults', () => {
    const { result } = renderHook(() => useMobileSpacing());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isBackToTopVisible).toBe(false);
    expect(result.current.safeBottomPadding).toBe('var(--spacing-4xl)');
    expect(result.current.viewportHeight).toBe(768);
  });

  it('should detect mobile device by screen width', () => {
    (window as any).innerWidth = 600;
    
    const { result } = renderHook(() => useMobileSpacing());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.safeBottomPadding).toBe('max(var(--spacing-3xl), calc(env(safe-area-inset-bottom) + 64px))');
  });

  it('should detect mobile device by user agent', () => {
    (navigator as any).userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';
    
    const { result } = renderHook(() => useMobileSpacing());

    expect(result.current.isMobile).toBe(true);
  });

  it('should show back-to-top button after scrolling past threshold', () => {
    (window as any).innerWidth = 600; // Mobile width
    (window as any).scrollY = 500; // Past 400px threshold
    
    const { result } = renderHook(() => useMobileSpacing());

    expect(result.current.isBackToTopVisible).toBe(true);
    expect(result.current.safeBottomPadding).toBe('max(var(--spacing-4xl), calc(env(safe-area-inset-bottom) + 120px))');
  });

  it('should use desktop spacing when not mobile', () => {
    (window as any).innerWidth = 1200;
    (window as any).scrollY = 500;
    
    const { result } = renderHook(() => useMobileSpacing());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.safeBottomPadding).toBe('var(--spacing-4xl)');
  });

  it('should add event listeners on mount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    
    renderHook(() => useMobileSpacing());

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function), { passive: true });
    expect(addEventListenerSpy).toHaveBeenCalledWith('orientationchange', expect.any(Function), { passive: true });
  });

  it('should remove event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    const { unmount } = renderHook(() => useMobileSpacing());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('orientationchange', expect.any(Function));
  });
});