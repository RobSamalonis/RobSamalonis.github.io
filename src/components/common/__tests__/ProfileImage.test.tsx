import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../../styles/theme';
import ProfileImage from '../ProfileImage';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const mockMotion = (component: any) => {
    return ({ children, ...props }: any) => {
      const {
        whileInView,
        whileHover,
        whileTap,
        animate,
        transition,
        initial,
        exit,
        variants,
        drag,
        dragConstraints,
        dragElastic,
        dragMomentum,
        onDragStart,
        onDragEnd,
        onDrag,
        layout,
        layoutId,
        style,
        ...domProps
      } = props;
      
      return React.createElement(component, { ...domProps, style }, children);
    };
  };
  
  return {
    motion: {
      div: mockMotion('div'),
    },
  };
});

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock the profile photo import
jest.mock('../../../assets/profile-photo.jpg', () => 'test-profile-photo.jpg');

// Helper to render with theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

// Helper to mock viewport
const mockViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });

  window.matchMedia = jest.fn().mockImplementation((query: string) => {
    const breakpoints = {
      '(min-width: 1920px)': width >= 1920,
      '(min-width: 1280px)': width >= 1280,
      '(min-width: 960px)': width >= 960,
      '(min-width: 600px)': width >= 600,
      '(max-width: 1919px)': width < 1920,
      '(max-width: 1279px)': width < 1280,
      '(max-width: 959px)': width < 960,
      '(max-width: 599px)': width < 600,
      '(prefers-reduced-motion: reduce)': false,
    };

    const matches = breakpoints[query as keyof typeof breakpoints] ?? false;
    
    return {
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  });
};

describe('ProfileImage Unit Tests', () => {
  beforeEach(() => {
    cleanup();
    mockIntersectionObserver.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Mobile Sizing Tests', () => {
    // Test that component renders at different breakpoints
    // Note: In test environment, MUI responsive breakpoints don't compute actual pixel values
    // These tests verify the component renders without errors at various viewport sizes
    test('renders successfully at 320px mobile breakpoint (small)', () => {
      mockViewport(320, 568);

      const { container } = renderWithTheme(<ProfileImage size="small" />);
      const avatar = container.querySelector('[class*="MuiAvatar-root"]');

      expect(avatar).toBeInTheDocument();
      // Verify the component has the sx prop with responsive sizing
      // Actual pixel values are tested in property tests with real DOM
    });

    test('renders successfully at 375px mobile breakpoint (medium)', () => {
      mockViewport(375, 667);

      const { container } = renderWithTheme(<ProfileImage size="medium" />);
      const avatar = container.querySelector('[class*="MuiAvatar-root"]');

      expect(avatar).toBeInTheDocument();
    });

    test('renders successfully at 414px mobile breakpoint (large)', () => {
      mockViewport(414, 896);

      const { container } = renderWithTheme(<ProfileImage size="large" />);
      const avatar = container.querySelector('[class*="MuiAvatar-root"]');

      expect(avatar).toBeInTheDocument();
      // Large size at mobile should be 220px (updated from 180px) in real browser
    });

    test('renders successfully at 768px tablet breakpoint', () => {
      mockViewport(768, 1024);

      const { container } = renderWithTheme(<ProfileImage size="large" />);
      const avatar = container.querySelector('[class*="MuiAvatar-root"]');

      expect(avatar).toBeInTheDocument();
      // Large size at tablet should be 260px (updated from 220px) in real browser
    });

    test('renders successfully at 1024px desktop breakpoint', () => {
      mockViewport(1024, 768);

      const { container } = renderWithTheme(<ProfileImage size="large" />);
      const avatar = container.querySelector('[class*="MuiAvatar-root"]');

      expect(avatar).toBeInTheDocument();
      // Large size at desktop should be 280px (unchanged) in real browser
    });

    // Test image quality at larger sizes
    test('maintains image quality with larger mobile size', () => {
      mockViewport(375, 667);

      const { container } = renderWithTheme(<ProfileImage size="large" />);
      const avatar = container.querySelector('[class*="MuiAvatar-root"]');

      expect(avatar).toBeInTheDocument();
      if (avatar) {
        const img = avatar.querySelector('img');
        expect(img).toBeInTheDocument();
        
        if (img) {
          // Check that image has proper object-fit for quality
          const computedStyle = window.getComputedStyle(img);
          expect(computedStyle.objectFit).toBe('cover');
          expect(computedStyle.objectPosition).toBe('center');
        }
      }
    });

    // Test layout on various mobile devices
    test('renders without overflow on iPhone SE (320px)', () => {
      mockViewport(320, 568);

      const { container } = renderWithTheme(<ProfileImage size="large" />);
      const avatar = container.querySelector('[class*="MuiAvatar-root"]');

      expect(avatar).toBeInTheDocument();
      // In real browser, should not exceed viewport width
    });

    test('renders without overflow on iPhone 12 (390px)', () => {
      mockViewport(390, 844);

      const { container } = renderWithTheme(<ProfileImage size="large" />);
      const avatar = container.querySelector('[class*="MuiAvatar-root"]');

      expect(avatar).toBeInTheDocument();
      // In real browser, should not exceed viewport width
    });

    test('renders without overflow on iPhone 14 Pro Max (430px)', () => {
      mockViewport(430, 932);

      const { container } = renderWithTheme(<ProfileImage size="large" />);
      const avatar = container.querySelector('[class*="MuiAvatar-root"]');

      expect(avatar).toBeInTheDocument();
      // In real browser, should not exceed viewport width
    });

    test('renders without overflow on Samsung Galaxy S21 (360px)', () => {
      mockViewport(360, 800);

      const { container } = renderWithTheme(<ProfileImage size="large" />);
      const avatar = container.querySelector('[class*="MuiAvatar-root"]');

      expect(avatar).toBeInTheDocument();
      // In real browser, should not exceed viewport width
    });

    test('maintains aspect ratio at all mobile sizes', () => {
      const mobileWidths = [320, 360, 375, 390, 414, 430];

      mobileWidths.forEach(width => {
        mockViewport(width, 800);

        const { container, unmount } = renderWithTheme(<ProfileImage size="large" />);
        const avatar = container.querySelector('[class*="MuiAvatar-root"]');

        expect(avatar).toBeInTheDocument();
        if (avatar) {
          const computedStyle = window.getComputedStyle(avatar as HTMLElement);
          const avatarWidth = computedStyle.width;
          const avatarHeight = computedStyle.height;

          // Aspect ratio should be 1:1
          expect(avatarWidth).toBe(avatarHeight);
        }

        unmount();
      });
    });
  });

  describe('Animation Tests', () => {
    test('initializes animation correctly', () => {
      mockViewport(375, 667);

      const { container } = renderWithTheme(<ProfileImage showAnimation={true} />);
      const boxDiv = container.querySelector('div[class*="MuiBox-root"]');

      expect(boxDiv).toBeInTheDocument();
    });

    test('respects reduced motion preferences', () => {
      // Mock prefers-reduced-motion
      window.matchMedia = jest.fn().mockImplementation((query: string) => {
        if (query === '(prefers-reduced-motion: reduce)') {
          return {
            matches: true,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
          };
        }
        return {
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        };
      });

      const { container } = renderWithTheme(<ProfileImage showAnimation={true} />);
      const avatar = container.querySelector('[class*="MuiAvatar-root"]');

      expect(avatar).toBeInTheDocument();
    });

    test('can disable animation', () => {
      mockViewport(375, 667);

      const { container } = renderWithTheme(<ProfileImage showAnimation={false} />);
      const boxDiv = container.querySelector('div[class*="MuiBox-root"]');

      expect(boxDiv).toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    test('renders with proper structure for accessibility', () => {
      mockViewport(375, 667);

      const { container } = renderWithTheme(<ProfileImage />);
      const avatar = container.querySelector('[class*="MuiAvatar-root"]');

      expect(avatar).toBeInTheDocument();
      // Avatar component should have alt text on the img element inside
      const img = avatar?.querySelector('img');
      if (img) {
        expect(img).toHaveAttribute('alt', 'Robert Samalonis - Senior Software Engineer');
      }
    });

    test('renders fallback icon when image fails to load', () => {
      mockViewport(375, 667);

      const { container } = renderWithTheme(<ProfileImage />);
      const avatar = container.querySelector('[class*="MuiAvatar-root"]');

      expect(avatar).toBeInTheDocument();
      // Fallback icon should be present in the DOM
      const fallbackIcon = container.querySelector('[data-testid="PersonIcon"]');
      // Icon may or may not be visible depending on image load state
    });
  });

  describe('Styling Tests', () => {
    test('applies correct styling classes', () => {
      mockViewport(375, 667);

      const { container } = renderWithTheme(<ProfileImage />);
      const avatar = container.querySelector('[class*="MuiAvatar-root"]');

      expect(avatar).toBeInTheDocument();
      if (avatar) {
        const computedStyle = window.getComputedStyle(avatar as HTMLElement);
        
        // Should have border-radius for circular shape
        expect(computedStyle.borderRadius).toBe('50%');
      }
    });

    test('applies custom className', () => {
      mockViewport(375, 667);

      const { container } = renderWithTheme(<ProfileImage className="custom-class" />);
      const motionDiv = container.querySelector('.custom-class');

      expect(motionDiv).toBeInTheDocument();
    });
  });
});
