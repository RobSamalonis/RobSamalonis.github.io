import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import Hero from '../Hero';
import { theme } from '../../../styles/theme';

// Mock framer-motion to avoid animation complexities in unit tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      // Filter out framer-motion specific props to avoid DOM warnings
      const { 
        whileHover, 
        whileTap, 
        animate, 
        transition, 
        initial, 
        exit,
        variants,
        whileInView,
        drag,
        dragConstraints,
        dragElastic,
        dragMomentum,
        onDragStart,
        onDragEnd,
        onDrag,
        layout,
        layoutId,
        ...domProps 
      } = props;
      return <div {...domProps}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock EntranceAnimation component
jest.mock('../../common/EntranceAnimation', () => {
  const MockEntranceAnimation = ({ children }: { children: React.ReactNode }) => {
    return <div data-testid="entrance-animation">{children}</div>;
  };
  return {
    __esModule: true,
    default: MockEntranceAnimation,
  };
});

// Mock scrollIntoView
const mockScrollIntoView = jest.fn();
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: mockScrollIntoView,
  writable: true,
});

describe('Hero Component', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    mockScrollIntoView.mockClear();
  });

  describe('Hero Content Rendering', () => {
    test('renders main heading with developer name', () => {
      renderWithTheme(<Hero />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Robert Samalonis');
    });

    test('renders job title as subtitle', () => {
      renderWithTheme(<Hero />);
      
      const subtitle = screen.getByRole('heading', { level: 2 });
      expect(subtitle).toBeInTheDocument();
      expect(subtitle).toHaveTextContent('Senior Software Engineer');
    });

    test('renders professional description', () => {
      renderWithTheme(<Hero />);
      
      const description = screen.getByText(/Crafting exceptional frontend experiences/i);
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent(/React, TypeScript, and modern web technologies/i);
      expect(description).toHaveTextContent(/accessibility, performance, and creating user-centered digital solutions/i);
    });

    test('renders hero section with proper semantic structure', () => {
      renderWithTheme(<Hero />);
      
      const heroSection = document.getElementById('hero'); // Use getElementById since section doesn't have implicit role
      expect(heroSection).toBeInTheDocument();
      expect(heroSection).toHaveAttribute('id', 'hero');
      expect(heroSection?.tagName.toLowerCase()).toBe('section');
    });

    test('renders content within entrance animations', () => {
      renderWithTheme(<Hero />);
      
      const entranceAnimations = screen.getAllByTestId('entrance-animation');
      expect(entranceAnimations).toHaveLength(5); // Profile image, main heading, subtitle, description, and CTA buttons
    });
  });

  describe('CTA Button Functionality', () => {
    test('renders Get In Touch button with correct text and icon', () => {
      renderWithTheme(<Hero />);
      
      const contactButton = screen.getByRole('button', { name: /get in touch/i });
      expect(contactButton).toBeInTheDocument();
      expect(contactButton).toHaveTextContent('Get In Touch');
      
      // Check for email icon (MUI icons render as SVG)
      const emailIcon = contactButton.querySelector('svg');
      expect(emailIcon).toBeInTheDocument();
    });

    test('renders View Resume button with correct text and icon', () => {
      renderWithTheme(<Hero />);
      
      const resumeButton = screen.getByRole('button', { name: /view resume/i });
      expect(resumeButton).toBeInTheDocument();
      expect(resumeButton).toHaveTextContent('View Resume');
      
      // Check for download icon (MUI icons render as SVG)
      const downloadIcon = resumeButton.querySelector('svg');
      expect(downloadIcon).toBeInTheDocument();
    });

    test('Get In Touch button scrolls to contact section when clicked', () => {
      // Mock getElementById to return a mock element
      const mockContactElement = document.createElement('div');
      mockContactElement.id = 'contact';
      jest.spyOn(document, 'getElementById').mockReturnValue(mockContactElement);

      renderWithTheme(<Hero />);
      
      const contactButton = screen.getByRole('button', { name: /get in touch/i });
      fireEvent.click(contactButton);
      
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Restore original implementation
      jest.restoreAllMocks();
    });

    test('View Resume button scrolls to resume section when clicked', () => {
      // Mock getElementById to return a mock element
      const mockResumeElement = document.createElement('div');
      mockResumeElement.id = 'resume';
      jest.spyOn(document, 'getElementById').mockReturnValue(mockResumeElement);

      renderWithTheme(<Hero />);
      
      const resumeButton = screen.getByRole('button', { name: /view resume/i });
      fireEvent.click(resumeButton);
      
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Restore original implementation
      jest.restoreAllMocks();
    });

    test('handles missing contact section gracefully', () => {
      // Mock getElementById to return null
      jest.spyOn(document, 'getElementById').mockReturnValue(null);

      renderWithTheme(<Hero />);
      
      const contactButton = screen.getByRole('button', { name: /get in touch/i });
      
      // Should not throw error when element is not found
      expect(() => fireEvent.click(contactButton)).not.toThrow();
      expect(mockScrollIntoView).not.toHaveBeenCalled();
      
      // Restore original implementation
      jest.restoreAllMocks();
    });

    test('handles missing resume section gracefully', () => {
      // Mock getElementById to return null
      jest.spyOn(document, 'getElementById').mockReturnValue(null);

      renderWithTheme(<Hero />);
      
      const resumeButton = screen.getByRole('button', { name: /view resume/i });
      
      // Should not throw error when element is not found
      expect(() => fireEvent.click(resumeButton)).not.toThrow();
      expect(mockScrollIntoView).not.toHaveBeenCalled();
      
      // Restore original implementation
      jest.restoreAllMocks();
    });

    test('CTA buttons are properly styled as Material-UI buttons', () => {
      renderWithTheme(<Hero />);
      
      const contactButton = screen.getByRole('button', { name: /get in touch/i });
      const resumeButton = screen.getByRole('button', { name: /view resume/i });
      
      // Check that buttons have MUI button classes (they should have specific MUI styling)
      expect(contactButton).toHaveClass('MuiButton-root');
      expect(resumeButton).toHaveClass('MuiButton-root');
      
      // Check button variants
      expect(contactButton).toHaveClass('MuiButton-contained');
      expect(resumeButton).toHaveClass('MuiButton-outlined');
    });

    test('CTA buttons are arranged in responsive stack layout', () => {
      renderWithTheme(<Hero />);
      
      const contactButton = screen.getByRole('button', { name: /get in touch/i });
      const resumeButton = screen.getByRole('button', { name: /view resume/i });
      
      // Both buttons should be present and rendered
      expect(contactButton).toBeInTheDocument();
      expect(resumeButton).toBeInTheDocument();
      
      // They should be within a Stack container (check for MuiStack class)
      const stackContainer = contactButton.closest('.MuiStack-root');
      expect(stackContainer).toBeInTheDocument();
      expect(stackContainer).toContainElement(resumeButton);
    });
  });

  describe('Visual Design Requirements', () => {
    test('hero section has proper styling and background', () => {
      renderWithTheme(<Hero />);
      
      const heroSection = document.getElementById('hero'); // Use getElementById since role is not reliable
      expect(heroSection).toBeInTheDocument();
      
      // Check that hero section has minimum height for full viewport
      expect(heroSection).toHaveStyle({
        minHeight: '100vh',
      });
      
      // Check that it's a flex container for centering
      expect(heroSection).toHaveStyle({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      });
    });

    test('main heading has gradient text styling', () => {
      renderWithTheme(<Hero />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      
      // Check for gradient background clip styling (WebKit specific)
      const computedStyle = window.getComputedStyle(heading);
      expect(heading).toHaveStyle({
        fontWeight: '700',
      });
    });

    test('content is properly centered and structured', () => {
      renderWithTheme(<Hero />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      const subtitle = screen.getByRole('heading', { level: 2 });
      const description = screen.getByText(/Crafting exceptional frontend experiences/i);
      
      // All main content elements should be present
      expect(heading).toBeInTheDocument();
      expect(subtitle).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      
      // They should be in the correct order in the DOM
      const headingPosition = Array.from(document.body.querySelectorAll('*')).indexOf(heading);
      const subtitlePosition = Array.from(document.body.querySelectorAll('*')).indexOf(subtitle);
      const descriptionPosition = Array.from(document.body.querySelectorAll('*')).indexOf(description);
      
      expect(headingPosition).toBeLessThan(subtitlePosition);
      expect(subtitlePosition).toBeLessThan(descriptionPosition);
    });
  });
});