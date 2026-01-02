import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import Contact from '../Contact';
import { theme } from '../../../styles/theme';

// Mock framer-motion to avoid animation complexities in unit tests
jest.mock('framer-motion', () => ({
  motion: {
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
        viewport,
        ...domProps 
      } = props;
      return <div {...domProps}>{children}</div>;
    },
  },
}));

// Mock AnimatedSection component
jest.mock('../../common/AnimatedSection', () => {
  const MockAnimatedSection = ({ children }: { children: React.ReactNode }) => {
    return <div data-testid="animated-section">{children}</div>;
  };
  return {
    __esModule: true,
    default: MockAnimatedSection,
  };
});

describe('Contact Component', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  describe('Contact Content Rendering', () => {
    test('renders main heading', () => {
      renderWithTheme(<Contact />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Get In Touch');
    });

    test('renders subtitle description', () => {
      renderWithTheme(<Contact />);
      
      const description = screen.getByText(/Ready to collaborate/i);
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent(/create something amazing together/i);
    });

    test('renders contact section with proper semantic structure', () => {
      renderWithTheme(<Contact />);
      
      const contactSection = document.getElementById('contact');
      expect(contactSection).toBeInTheDocument();
      expect(contactSection).toHaveAttribute('id', 'contact');
      expect(contactSection?.tagName.toLowerCase()).toBe('section');
    });

    test('renders all contact methods', () => {
      renderWithTheme(<Contact />);
      
      // Check for contact method headings
      expect(screen.getByRole('heading', { name: /email/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /phone/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /linkedin/i })).toBeInTheDocument();
    });

    test('renders contact links with proper attributes', () => {
      renderWithTheme(<Contact />);
      
      // Check for email link
      const emailLink = screen.getByRole('link', { name: /contact via email/i });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', expect.stringContaining('mailto:'));
      
      // Check for phone link
      const phoneLink = screen.getByRole('link', { name: /contact via phone/i });
      expect(phoneLink).toBeInTheDocument();
      expect(phoneLink).toHaveAttribute('href', expect.stringContaining('tel:'));
      
      // Check for LinkedIn link
      const linkedinLink = screen.getByRole('link', { name: /contact via linkedin/i });
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute('href', expect.stringContaining('https://'));
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('renders content within animated sections', () => {
      renderWithTheme(<Contact />);
      
      const animatedSections = screen.getAllByTestId('animated-section');
      expect(animatedSections).toHaveLength(1); // Header section
    });
  });

  describe('Visual Design Requirements', () => {
    test('contact section has proper styling and background', () => {
      renderWithTheme(<Contact />);
      
      const contactSection = document.getElementById('contact');
      expect(contactSection).toBeInTheDocument();
      
      // Check that it's positioned relatively for background effects
      expect(contactSection).toHaveStyle({
        position: 'relative',
      });
    });

    test('contact cards have retro-futuristic styling', () => {
      const { container } = renderWithTheme(<Contact />);
      
      // Check for MUI Card components (each contact method has a card + nested elements)
      const cards = container.querySelectorAll('[class*="MuiCard"]');
      expect(cards.length).toBeGreaterThanOrEqual(3); // At least 3 contact methods
    });

    test('contact icons have angled corner styling', () => {
      const { container } = renderWithTheme(<Contact />);
      
      // Check for IconButton components (one per contact method)
      const iconButtons = container.querySelectorAll('[class*="MuiIconButton"]');
      expect(iconButtons.length).toBe(3); // Email, Phone, LinkedIn
    });
  });
});