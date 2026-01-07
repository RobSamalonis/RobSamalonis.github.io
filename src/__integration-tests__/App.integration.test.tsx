import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../styles';
import { Hero } from '../components/sections';
import { Contact } from '../components/sections';
import { Resume } from '../components/sections';

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

// Mock animation components
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

describe('App Integration Tests', () => {
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

  test('hero section renders and navigation buttons work', async () => {
    const user = userEvent.setup();

    renderWithTheme(<Hero />);

    // Check hero content
    expect(
      screen.getByRole('heading', { level: 1, name: /robert samalonis/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/senior software engineer/i)).toBeInTheDocument();

    // Test navigation buttons
    const getInTouchButton = screen.getByRole('button', {
      name: /get in touch/i,
    });
    const viewResumeButton = screen.getByRole('button', {
      name: /view resume/i,
    });

    await user.click(getInTouchButton);
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });

    await user.click(viewResumeButton);
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  test('contact section displays contact information', async () => {
    renderWithTheme(<Contact />);

    // Test contact buttons exist (now buttons instead of links due to full card clickability)
    expect(
      screen.getByRole('button', { name: /contact via email/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /contact via linkedin/i })
    ).toBeInTheDocument();
    expect(screen.getByText('robsamalonis@gmail.com')).toBeInTheDocument();
  });

  test('resume section displays content and download works', async () => {
    const user = userEvent.setup();
    const { generateResumePDF } = await import('../utils/pdfGenerator');

    renderWithTheme(<Resume />);

    // Check resume content
    expect(
      screen.getByRole('heading', { level: 2, name: /resume/i })
    ).toBeInTheDocument();
    expect(screen.getByText('eMoney Advisor')).toBeInTheDocument();
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();

    // Test PDF download
    const downloadButton = screen.getByRole('button', {
      name: /download pdf version of resume/i,
    });
    await user.click(downloadButton);

    // Wait for async operation
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify that the PDF generator was called
    expect(generateResumePDF).toHaveBeenCalled();
  });
});
