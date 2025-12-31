import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import Contact from '../Contact';
import { theme } from '../../../styles';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: (component: any) => {
    return ({ children, ...props }: any) => {
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
      return React.createElement(component, domProps, children);
    };
  },
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Contact Component', () => {
  beforeEach(() => {
    // Clear any previous DOM state
    document.body.innerHTML = '';
  });

  describe('Contact Information Display', () => {
    test('displays all contact methods with correct information', () => {
      renderWithTheme(<Contact />);
      
      // Check for contact information section
      expect(screen.getByText('Contact Information')).toBeInTheDocument();
      
      // Check for email - use getAllByText since "Email" appears in both contact info and form
      const emailTexts = screen.getAllByText('Email');
      expect(emailTexts.length).toBeGreaterThan(0);
      expect(screen.getByText('robsamalonis@gmail.com')).toBeInTheDocument();
      
      // Check for phone
      expect(screen.getByText('Phone')).toBeInTheDocument();
      expect(screen.getByText('267-772-1647')).toBeInTheDocument();
      
      // Check for LinkedIn
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByText('linkedin.com/in/robert-samalonis-4a092a137')).toBeInTheDocument();
    });

    test('generates correct contact links', () => {
      renderWithTheme(<Contact />);
      
      // Check email link
      const emailLink = screen.getByRole('link', { name: /robsamalonis@gmail.com/i });
      expect(emailLink).toHaveAttribute('href', 'mailto:robsamalonis@gmail.com');
      
      // Check phone link
      const phoneLink = screen.getByRole('link', { name: /267-772-1647/i });
      expect(phoneLink).toHaveAttribute('href', 'tel:267-772-1647');
      
      // Check LinkedIn link
      const linkedinLink = screen.getByRole('link', { name: /linkedin.com\/in\/robert-samalonis-4a092a137/i });
      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/robert-samalonis-4a092a137');
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('has proper accessibility attributes for contact links', () => {
      renderWithTheme(<Contact />);
      
      // Check ARIA labels for contact buttons
      expect(screen.getByLabelText('Contact via Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Contact via Phone')).toBeInTheDocument();
      expect(screen.getByLabelText('Contact via LinkedIn')).toBeInTheDocument();
    });
  });

  describe('Contact Form', () => {
    test('renders all form fields', () => {
      renderWithTheme(<Contact />);
      
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      // Use more specific query for email field to avoid conflict with contact info
      expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
      // Message field is a textarea, not a textbox
      expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    test('validates required fields', async () => {
      const user = userEvent.setup();
      renderWithTheme(<Contact />);
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      // Try to submit empty form
      await user.click(submitButton);
      
      // Check for validation errors
      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Subject is required')).toBeInTheDocument();
        expect(screen.getByText('Message is required')).toBeInTheDocument();
      });
    });

    test('validates email format', async () => {
      const user = userEvent.setup();
      renderWithTheme(<Contact />);
      
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      // Enter invalid email
      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    test('clears field errors when user starts typing', async () => {
      const user = userEvent.setup();
      renderWithTheme(<Contact />);
      
      const nameInput = screen.getByLabelText(/name/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      // Submit empty form to trigger validation
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
      
      // Start typing in name field
      await user.type(nameInput, 'John');
      
      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
      });
    });

    test('submits form with valid data', async () => {
      const user = userEvent.setup();
      renderWithTheme(<Contact />);
      
      // Fill out form
      await user.type(screen.getByRole('textbox', { name: /name/i }), 'John Doe');
      await user.type(screen.getByRole('textbox', { name: /email/i }), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /subject/i }), 'Test Subject');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message content');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      // Check for loading state
      await waitFor(() => {
        expect(screen.getByText('Sending...')).toBeInTheDocument();
      });
      
      // Check for success message
      await waitFor(() => {
        expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Form should be reset
      expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('');
      expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('');
      expect(screen.getByRole('textbox', { name: /subject/i })).toHaveValue('');
      expect(screen.getByRole('textbox', { name: /message/i })).toHaveValue('');
    });

    test('handles form submission errors', async () => {
      const user = userEvent.setup();
      
      // Mock console.error to avoid error logs in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock setTimeout to throw an error to simulate submission failure
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = jest.fn((callback, delay) => {
        if (delay === 1000) {
          // Simulate error in the promise chain
          throw new Error('Network error');
        }
        return originalSetTimeout(callback, delay);
      }) as any;
      
      renderWithTheme(<Contact />);
      
      // Fill out form
      await user.type(screen.getByRole('textbox', { name: /name/i }), 'John Doe');
      await user.type(screen.getByRole('textbox', { name: /email/i }), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /subject/i }), 'Test Subject');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message content');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      // Check for error message in Snackbar
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(/sorry, there was an error/i)).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Restore original setTimeout and console
      global.setTimeout = originalSetTimeout;
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    test('has proper heading structure', () => {
      renderWithTheme(<Contact />);
      
      const mainHeading = screen.getByRole('heading', { level: 2, name: /get in touch/i });
      expect(mainHeading).toBeInTheDocument();
      
      const subHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(subHeadings).toHaveLength(2);
      expect(subHeadings[0]).toHaveTextContent('Contact Information');
      expect(subHeadings[1]).toHaveTextContent('Send a Message');
    });

    test('form has proper labels and required attributes', () => {
      renderWithTheme(<Contact />);
      
      const nameInput = screen.getByRole('textbox', { name: /name/i });
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const subjectInput = screen.getByRole('textbox', { name: /subject/i });
      const messageInput = screen.getByRole('textbox', { name: /message/i });
      
      expect(nameInput).toBeRequired();
      expect(emailInput).toBeRequired();
      expect(subjectInput).toBeRequired();
      expect(messageInput).toBeRequired();
      
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    test('has proper section landmark', () => {
      renderWithTheme(<Contact />);
      
      const contactSection = document.querySelector('section#contact');
      expect(contactSection).toBeInTheDocument();
    });
  });
});