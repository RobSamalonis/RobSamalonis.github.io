import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../styles';
import { Hero } from '../components/sections';
import { Contact } from '../components/sections';
import { Resume } from '../components/sections';
import { Navigation } from '../components/layout';

// Mock framer-motion to avoid animation complexities
jest.mock('framer-motion', () => ({
  motion: Object.assign(
    (component: any) => {
      const MotionComponent = ({ children, ...props }: any) => {
        const { whileHover, whileTap, animate, transition, initial, exit, variants, whileInView, ...domProps } = props;
        return React.createElement(component, domProps, children);
      };
      return MotionComponent;
    },
    {
      div: ({ children, ...props }: any) => {
        const { whileHover, whileTap, animate, transition, initial, exit, variants, whileInView, ...domProps } = props;
        return <div {...domProps}>{children}</div>;
      },
    }
  ),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock animation components
jest.mock('../components/common/AnimatedSection', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/common/EntranceAnimation', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock scroll utilities
const mockScrollIntoView = jest.fn();
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: mockScrollIntoView,
  writable: true,
});

describe('Component Interactions Integration Tests', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
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
    expect(screen.getByRole('heading', { level: 1, name: /robert samalonis/i })).toBeInTheDocument();

    // Navigation works
    const getInTouchButton = screen.getByRole('button', { name: /get in touch/i });
    await user.click(getInTouchButton);
    expect(mockScrollIntoView).toHaveBeenCalled();

    // Contact form works
    const nameInput = screen.getByRole('textbox', { name: /name/i });
    await user.type(nameInput, 'Test User');
    expect(nameInput).toHaveValue('Test User');
  });

  test('navigation component works with sections', async () => {
    const user = userEvent.setup();
    const mockSectionChange = jest.fn();

    renderWithTheme(
      <Navigation currentSection="hero" onSectionChange={mockSectionChange} />
    );

    const navButtons = screen.getAllByRole('button');
    expect(navButtons.length).toBe(3);

    // Click first nav button
    await user.click(navButtons[0]);
    expect(mockSectionChange).toHaveBeenCalled();
  });

  test('resume section displays and download works', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    renderWithTheme(<Resume />);

    // Content is visible
    expect(screen.getByText('eMoney Advisor')).toBeInTheDocument();
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();

    // Download button works
    const downloadButton = screen.getByRole('button', { name: /download pdf version of resume/i });
    await user.click(downloadButton);
    expect(consoleSpy).toHaveBeenCalledWith('PDF download functionality to be implemented');
    
    consoleSpy.mockRestore();
  });

  test('contact form validation works', async () => {
    const user = userEvent.setup();
    
    renderWithTheme(<Contact />);

    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    // Validation error appears
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    // Fill form and error clears
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    await user.type(emailInput, 'test@example.com');
    
    await waitFor(() => {
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });
  });
});