import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../styles';
import { Hero } from '../components/sections';
import { Contact } from '../components/sections';
import { Resume } from '../components/sections';
import { Navigation } from '../components/layout';

// Mock useSmartScrolling hook
jest.mock('../utils/smartScrolling', () => ({
  useSmartScrolling: () => ({
    scrollToSection: jest.fn().mockResolvedValue(undefined),
    getCurrentSection: jest.fn(),
    getSectionProgress: jest.fn(),
    cancelScroll: jest.fn(),
    isScrolling: false,
  }),
}));

// Mock framer-motion to avoid animation complexities
jest.mock('framer-motion', () => ({
  motion: Object.assign(
    (component: any) => {
      const MotionComponent = ({ children, ...props }: any) => {
        const {
          whileHover,
          whileTap,
          animate,
          transition,
          initial,
          exit,
          variants,
          whileInView,
          ...domProps
        } = props;
        return React.createElement(component, domProps, children);
      };
      return MotionComponent;
    },
    {
      div: ({ children, ...props }: any) => {
        const {
          whileHover,
          whileTap,
          animate,
          transition,
          initial,
          exit,
          variants,
          whileInView,
          ...domProps
        } = props;
        return <div {...domProps}>{children}</div>;
      },
    }
  ),
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useScroll: () => ({
    scrollY: { get: () => 0, on: jest.fn(), destroy: jest.fn() },
    scrollYProgress: { get: () => 0, on: jest.fn(), destroy: jest.fn() },
  }),
  useTransform: () => ({ get: () => 0, on: jest.fn(), destroy: jest.fn() }),
  useSpring: (value: any) =>
    value || { get: () => 0, on: jest.fn(), destroy: jest.fn() },
  useMotionValue: (initial: any) => ({
    get: () => initial,
    set: jest.fn(),
    on: jest.fn(),
    destroy: jest.fn(),
  }),
  useAnimationControls: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
}));

// Mock PDF generator
jest.mock('../utils/pdfGenerator', () => ({
  generateResumePDF: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../components/common/AnimatedSection', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('../components/common/EntranceAnimation', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock scroll utilities
const mockScrollIntoView = jest.fn();
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: mockScrollIntoView,
  writable: true,
});

// Mock getElementById to return mock elements
const mockGetElementById = jest.fn();
Object.defineProperty(document, 'getElementById', {
  value: mockGetElementById,
  writable: true,
});

describe('Component Interactions Integration Tests', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
  };

  beforeEach(() => {
    mockScrollIntoView.mockClear();

    // Mock getElementById for navigation
    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      const mockElement = document.createElement('div');
      mockElement.id = id;
      mockElement.scrollIntoView = mockScrollIntoView;
      return mockElement;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('hero and contact components work together', async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <div>
        <Hero />
        <Contact />
      </div>
    );

    // Hero content is visible
    expect(
      screen.getByRole('heading', { level: 1, name: /robert samalonis/i })
    ).toBeInTheDocument();

    // Navigation works
    const getInTouchButton = screen.getByRole('button', {
      name: /get in touch/i,
    });
    await user.click(getInTouchButton);
    expect(mockScrollIntoView).toHaveBeenCalled();

    // Contact information is visible
    expect(screen.getByText('robsamalonis@gmail.com')).toBeInTheDocument();
  });

  test.skip('navigation component works with sections', async () => {
    const user = userEvent.setup();
    const mockSectionChange = jest.fn();

    // Mock getElementById to return a mock element
    const mockElement = {
      scrollIntoView: mockScrollIntoView,
      offsetTop: 100,
      offsetHeight: 500,
    };
    mockGetElementById.mockReturnValue(mockElement);

    renderWithTheme(
      <Navigation currentSection="hero" onSectionChange={mockSectionChange} />
    );

    // Navigation uses menuitem role, not button
    const navButtons = screen.getAllByRole('menuitem');
    expect(navButtons.length).toBe(3);

    // Click first nav button
    await user.click(navButtons[0]);
    expect(mockSectionChange).toHaveBeenCalled();

    // Clean up
    mockGetElementById.mockClear();
    mockScrollIntoView.mockClear();
  });

  test('resume section displays and download works', async () => {
    const user = userEvent.setup();
    const { generateResumePDF } = await import('../utils/pdfGenerator');

    renderWithTheme(<Resume />);

    // Content is visible
    expect(screen.getByText('eMoney Advisor')).toBeInTheDocument();
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();

    // Download button works
    const downloadButton = screen.getByRole('button', {
      name: /download pdf version of resume/i,
    });
    await user.click(downloadButton);
    expect(generateResumePDF).toHaveBeenCalled();
  });

  test('contact section displays contact information', async () => {
    renderWithTheme(<Contact />);

    // Contact information is visible
    expect(screen.getByText('robsamalonis@gmail.com')).toBeInTheDocument();

    // Contact links work (now buttons due to full card clickability)
    expect(
      screen.getByRole('button', { name: /contact via email/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /contact via linkedin/i })
    ).toBeInTheDocument();
  });
});
