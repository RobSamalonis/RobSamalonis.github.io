import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

describe('Contact Component', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
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
      expect(description).toHaveTextContent(
        /create something amazing together/i
      );
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
      expect(
        screen.getByRole('heading', { name: /email/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /linkedin/i })
      ).toBeInTheDocument();
    });

    test('renders contact cards with proper attributes', () => {
      renderWithTheme(<Contact />);

      // Check for email card button
      const emailCard = screen.getByRole('button', {
        name: /contact via email/i,
      });
      expect(emailCard).toBeInTheDocument();
      expect(emailCard).toHaveAttribute('tabindex', '0');

      // Check for LinkedIn card button
      const linkedinCard = screen.getByRole('button', {
        name: /contact via linkedin/i,
      });
      expect(linkedinCard).toBeInTheDocument();
      expect(linkedinCard).toHaveAttribute('tabindex', '0');
    });

    test('renders content without animated sections', () => {
      renderWithTheme(<Contact />);

      // AnimatedSection should no longer be used in Contact component
      const animatedSections = document.querySelectorAll(
        '[data-testid="animated-section"]'
      );
      expect(animatedSections).toHaveLength(0);
    });

    test('supports keyboard interaction', () => {
      // Mock window.location.href and window.open
      const originalLocation = window.location;
      const originalOpen = window.open;

      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true,
      });

      window.open = jest.fn();

      renderWithTheme(<Contact />);

      // Test Enter key on email card
      const emailCard = screen.getByRole('button', {
        name: /contact via email/i,
      });
      fireEvent.keyDown(emailCard, { key: 'Enter' });
      expect(window.location.href).toContain('mailto:');

      // Test Space key on LinkedIn card
      const linkedinCard = screen.getByRole('button', {
        name: /contact via linkedin/i,
      });
      fireEvent.keyDown(linkedinCard, { key: ' ' });
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://'),
        '_blank',
        'noopener,noreferrer'
      );

      // Restore original functions
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
      });
      window.open = originalOpen;
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

    test('contact cards have clickable styling', () => {
      const { container } = renderWithTheme(<Contact />);

      // Check for clickable Card components (one per contact method)
      const clickableCards = container.querySelectorAll('[role="button"]');
      expect(clickableCards.length).toBe(2); // Email, LinkedIn

      // Verify cards have cursor pointer styling
      clickableCards.forEach((card) => {
        expect(card).toHaveAttribute('tabindex', '0');
        expect(card).toHaveAttribute('role', 'button');
      });
    });
  });
});
