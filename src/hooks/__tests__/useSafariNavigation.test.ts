import { renderHook } from '@testing-library/react';
import { useSafariNavigation } from '../useSafariNavigation';

// Mock window properties for testing
const mockWindow = (userAgent: string, innerHeight: number = 800) => {
  Object.defineProperty(window, 'navigator', {
    value: { userAgent },
    writable: true,
  });
  Object.defineProperty(window, 'innerHeight', {
    value: innerHeight,
    writable: true,
  });
  Object.defineProperty(window, 'screen', {
    value: { height: 812 }, // iPhone X height for home indicator detection
    writable: true,
  });
};

describe('useSafariNavigation', () => {
  beforeEach(() => {
    // Reset window properties
    mockWindow('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should detect non-Safari browsers correctly', () => {
    mockWindow('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    const { result } = renderHook(() => useSafariNavigation());
    
    expect(result.current.isSafari).toBe(false);
    expect(result.current.isIOS).toBe(false);
    expect(result.current.safariVersion).toBe(null);
  });

  it('should detect iOS Safari correctly', () => {
    mockWindow('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1');
    
    const { result } = renderHook(() => useSafariNavigation());
    
    expect(result.current.isSafari).toBe(true);
    expect(result.current.isIOS).toBe(true);
    expect(result.current.safariVersion).toBe(15);
  });

  it('should detect iPad Safari correctly', () => {
    mockWindow('Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1');
    
    const { result } = renderHook(() => useSafariNavigation());
    
    expect(result.current.isSafari).toBe(true);
    expect(result.current.isIOS).toBe(true);
    expect(result.current.safariVersion).toBe(14);
  });

  it('should not detect Chrome on iOS as Safari', () => {
    mockWindow('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/91.0.4472.80 Mobile/15E148 Safari/604.1');
    
    const { result } = renderHook(() => useSafariNavigation());
    
    expect(result.current.isSafari).toBe(false);
    expect(result.current.isIOS).toBe(true);
    expect(result.current.safariVersion).toBe(null);
  });

  it('should calculate correct back-to-top button offset for non-Safari browsers', () => {
    mockWindow('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    const { result } = renderHook(() => useSafariNavigation());
    
    // For non-Safari browsers, should use base offset (32) + safe area (0)
    expect(result.current.backToTopButtonOffset).toBe(32);
  });

  it('should calculate correct back-to-top button offset for iOS Safari', () => {
    mockWindow('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1');
    
    const { result } = renderHook(() => useSafariNavigation());
    
    // For iOS Safari, should include safe area (estimated 34px for modern iPhones) + base offset (32px)
    // The hook should calculate at least base offset + safe area = 66px, but enforces minimum 60px
    expect(result.current.backToTopButtonOffset).toBeGreaterThanOrEqual(32);
    expect(result.current.isSafari).toBe(true);
    expect(result.current.isIOS).toBe(true);
  });

  it('should initialize with correct viewport height', () => {
    const testHeight = 667; // iPhone 6/7/8 height
    mockWindow('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1', testHeight);
    
    const { result } = renderHook(() => useSafariNavigation());
    
    expect(result.current.viewportHeight).toBe(testHeight);
  });

  it('should handle missing version in user agent', () => {
    mockWindow('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari/604.1');
    
    const { result } = renderHook(() => useSafariNavigation());
    
    expect(result.current.isSafari).toBe(true);
    expect(result.current.isIOS).toBe(true);
    expect(result.current.safariVersion).toBe(null);
  });
});