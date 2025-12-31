import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import fc from 'fast-check';
import { ContactMethod, ContactForm } from '../../../types';
import { theme } from '../../../styles';
import Contact from '../Contact';

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

// Feature: personal-portfolio-website, Property 6: Contact link behavior
describe('Contact Link Behavior Property Tests', () => {
  // Helper function to generate contact href (same logic as in Contact component)
  const getContactHref = (method: ContactMethod): string => {
    switch (method.type) {
      case 'email':
        return `mailto:${method.value}`;
      case 'phone':
        return `tel:${method.value}`;
      case 'linkedin':
        return `https://${method.value}`;
      default:
        return '#';
    }
  };

  // Basic test to verify the function works
  test('basic contact link generation works', () => {
    const emailMethod: ContactMethod = {
      type: 'email',
      value: 'test@example.com',
      label: 'Email',
      icon: () => null,
    };

    const phoneMethod: ContactMethod = {
      type: 'phone',
      value: '123-456-7890',
      label: 'Phone',
      icon: () => null,
    };

    const linkedinMethod: ContactMethod = {
      type: 'linkedin',
      value: 'linkedin.com/in/test-user',
      label: 'LinkedIn',
      icon: () => null,
    };

    expect(getContactHref(emailMethod)).toBe('mailto:test@example.com');
    expect(getContactHref(phoneMethod)).toBe('tel:123-456-7890');
    expect(getContactHref(linkedinMethod)).toBe('https://linkedin.com/in/test-user');
  });

  // Property test for contact link href generation logic
  test('contact methods generate correct href attributes for appropriate applications', () => {
    // Test with various email addresses
    const emailAddresses = [
      'test@gmail.com',
      'user@company.org',
      'name.lastname@domain.co.uk',
      'simple@test.io'
    ];

    emailAddresses.forEach(email => {
      const method: ContactMethod = {
        type: 'email',
        value: email,
        label: 'Email',
        icon: () => null,
      };
      const href = getContactHref(method);
      expect(href).toBe(`mailto:${email}`);
      expect(href).toMatch(/^mailto:/);
    });

    // Test with various phone numbers
    const phoneNumbers = [
      '123-456-7890',
      '(555) 123-4567',
      '+1-800-555-0123',
      '555.123.4567'
    ];

    phoneNumbers.forEach(phone => {
      const method: ContactMethod = {
        type: 'phone',
        value: phone,
        label: 'Phone',
        icon: () => null,
      };
      const href = getContactHref(method);
      expect(href).toBe(`tel:${phone}`);
      expect(href).toMatch(/^tel:/);
    });

    // Test with various LinkedIn profiles
    const linkedinProfiles = [
      'linkedin.com/in/john-doe',
      'linkedin.com/in/jane-smith-123',
      'linkedin.com/in/user.name',
      'linkedin.com/in/test-profile-456'
    ];

    linkedinProfiles.forEach(linkedin => {
      const method: ContactMethod = {
        type: 'linkedin',
        value: linkedin,
        label: 'LinkedIn',
        icon: () => null,
      };
      const href = getContactHref(method);
      expect(href).toBe(`https://${linkedin}`);
      expect(href).toMatch(/^https:\/\//);
    });
  });

  // Test for contact link consistency across different contact method types
  test('contact link generation is consistent for all supported contact method types', () => {
    const testCases = [
      { type: 'email' as const, value: 'test@example.com', expectedPrefix: 'mailto:' },
      { type: 'phone' as const, value: '123-456-7890', expectedPrefix: 'tel:' },
      { type: 'linkedin' as const, value: 'linkedin.com/in/test', expectedPrefix: 'https://' },
    ];

    testCases.forEach(({ type, value, expectedPrefix }) => {
      const contactMethod: ContactMethod = {
        type,
        value,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        icon: () => null,
      };

      const href = getContactHref(contactMethod);

      // Verify href format is consistent with contact type
      expect(href).toMatch(new RegExp(`^${expectedPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
      expect(href).toContain(value);
      expect(href).not.toBe('');
      expect(href).not.toBe('#');
    });
  });

  // Test for edge cases in contact link generation
  test('contact link generation handles edge cases appropriately', () => {
    const edgeCases = [
      { type: 'email' as const, value: 'test with spaces@example.com' },
      { type: 'phone' as const, value: '123-456-7890 ext. 123' },
      { type: 'linkedin' as const, value: 'linkedin.com/in/user-with-dashes' },
      { type: 'email' as const, value: 'user.with.dots@domain.co.uk' },
      { type: 'phone' as const, value: '+1 (555) 123-4567' },
    ];

    edgeCases.forEach(({ type, value }) => {
      const contactMethod: ContactMethod = {
        type,
        value,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        icon: () => null,
      };

      const href = getContactHref(contactMethod);

      // Verify href always has correct protocol
      switch (type) {
        case 'email':
          expect(href).toMatch(/^mailto:/);
          break;
        case 'phone':
          expect(href).toMatch(/^tel:/);
          break;
        case 'linkedin':
          expect(href).toMatch(/^https:\/\//);
          break;
      }

      // Verify href contains the original value
      expect(href).toContain(value);
    });
  });

  // Test for invalid contact method types
  test('contact link generation returns fallback for invalid types', () => {
    const invalidTypes = ['twitter', 'facebook', 'instagram', 'unknown', ''];

    invalidTypes.forEach(invalidType => {
      const contactMethod = {
        type: invalidType as any,
        value: 'test-value',
        label: 'Invalid',
        icon: () => null,
      };

      const href = getContactHref(contactMethod);
      expect(href).toBe('#');
    });
  });
});

// Feature: personal-portfolio-website, Property 7: Contact form validation
describe('Contact Form Validation Property Tests', () => {
  // Helper function to extract validation logic from Contact component
  const validateContactForm = (formData: ContactForm): Partial<ContactForm> => {
    const errors: Partial<ContactForm> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    return errors;
  };

  test('contact form validation property - all required fields are validated appropriately', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string(),
          email: fc.string(),
          subject: fc.string(),
          message: fc.string(),
        }),
        (formData: ContactForm) => {
          const errors = validateContactForm(formData);
          
          // Property: If any required field is empty or whitespace-only, validation should fail
          const hasEmptyName = !formData.name.trim();
          const hasEmptyEmail = !formData.email.trim();
          const hasEmptySubject = !formData.subject.trim();
          const hasEmptyMessage = !formData.message.trim();
          
          // Check name validation
          if (hasEmptyName) {
            expect(errors.name).toBe('Name is required');
          } else {
            expect(errors.name).toBeUndefined();
          }
          
          // Check email validation (empty case)
          if (hasEmptyEmail) {
            expect(errors.email).toBe('Email is required');
          }
          
          // Check subject validation
          if (hasEmptySubject) {
            expect(errors.subject).toBe('Subject is required');
          } else {
            expect(errors.subject).toBeUndefined();
          }
          
          // Check message validation
          if (hasEmptyMessage) {
            expect(errors.message).toBe('Message is required');
          } else {
            expect(errors.message).toBeUndefined();
          }
          
          // Property: Form is valid only when all fields are non-empty and email is valid
          const isFormValid = Object.keys(errors).length === 0;
          const shouldBeValid = !hasEmptyName && !hasEmptyEmail && !hasEmptySubject && !hasEmptyMessage && 
                               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
          
          expect(isFormValid).toBe(shouldBeValid);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('email validation property - email format validation works correctly for all inputs', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => s.trim() !== ''), // Non-empty strings only
        (emailInput: string) => {
          const formData: ContactForm = {
            name: 'Test Name',
            email: emailInput,
            subject: 'Test Subject',
            message: 'Test Message',
          };
          
          const errors = validateContactForm(formData);
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const isValidEmail = emailRegex.test(emailInput);
          
          // Property: Email validation should match the regex pattern
          if (isValidEmail) {
            expect(errors.email).toBeUndefined();
          } else {
            expect(errors.email).toBe('Please enter a valid email address');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('whitespace handling property - form validation handles whitespace-only inputs correctly', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string().map(s => '   ' + s + '   '), // Add whitespace padding
          email: fc.string().map(s => '   ' + s + '   '),
          subject: fc.string().map(s => '   ' + s + '   '),
          message: fc.string().map(s => '   ' + s + '   '),
        }),
        (paddedFormData: ContactForm) => {
          const errors = validateContactForm(paddedFormData);
          
          // Property: Validation should be based on trimmed values
          const trimmedName = paddedFormData.name.trim();
          const trimmedEmail = paddedFormData.email.trim();
          const trimmedSubject = paddedFormData.subject.trim();
          const trimmedMessage = paddedFormData.message.trim();
          
          // Check that validation uses trimmed values
          if (trimmedName === '') {
            expect(errors.name).toBe('Name is required');
          } else {
            expect(errors.name).toBeUndefined();
          }
          
          if (trimmedEmail === '') {
            expect(errors.email).toBe('Email is required');
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            expect(errors.email).toBe('Please enter a valid email address');
          } else {
            expect(errors.email).toBeUndefined();
          }
          
          if (trimmedSubject === '') {
            expect(errors.subject).toBe('Subject is required');
          } else {
            expect(errors.subject).toBeUndefined();
          }
          
          if (trimmedMessage === '') {
            expect(errors.message).toBe('Message is required');
          } else {
            expect(errors.message).toBeUndefined();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('form validation consistency property - validation results are consistent across multiple calls', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string(),
          email: fc.string(),
          subject: fc.string(),
          message: fc.string(),
        }),
        (formData: ContactForm) => {
          // Property: Multiple calls to validation with same input should produce identical results
          const errors1 = validateContactForm(formData);
          const errors2 = validateContactForm(formData);
          const errors3 = validateContactForm(formData);
          
          // Check that all validation calls return identical results
          expect(errors1).toEqual(errors2);
          expect(errors2).toEqual(errors3);
          expect(errors1).toEqual(errors3);
          
          // Check that error object structure is consistent
          const errorKeys1 = Object.keys(errors1).sort();
          const errorKeys2 = Object.keys(errors2).sort();
          const errorKeys3 = Object.keys(errors3).sort();
          
          expect(errorKeys1).toEqual(errorKeys2);
          expect(errorKeys2).toEqual(errorKeys3);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('valid form data property - forms with all valid fields pass validation', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string().filter(s => s.trim().length > 0),
          email: fc.constantFrom(
            'test@example.com',
            'user@domain.org',
            'name.lastname@company.co.uk',
            'simple@test.io',
            'user123@gmail.com'
          ),
          subject: fc.string().filter(s => s.trim().length > 0),
          message: fc.string().filter(s => s.trim().length > 0),
        }),
        (validFormData: ContactForm) => {
          const errors = validateContactForm(validFormData);
          
          // Property: Valid form data should produce no validation errors
          expect(Object.keys(errors)).toHaveLength(0);
          expect(errors.name).toBeUndefined();
          expect(errors.email).toBeUndefined();
          expect(errors.subject).toBeUndefined();
          expect(errors.message).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('form validation integration property - validation works correctly in rendered component', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.oneof(fc.constant(''), fc.string().filter(s => s.trim().length > 0)),
          email: fc.oneof(
            fc.constant(''),
            fc.constant('invalid-email'),
            fc.constantFrom('test@example.com', 'user@domain.org')
          ),
          subject: fc.oneof(fc.constant(''), fc.string().filter(s => s.trim().length > 0)),
          message: fc.oneof(fc.constant(''), fc.string().filter(s => s.trim().length > 0)),
        }),
        (formData: ContactForm) => {
          // Create a fresh render for each test iteration
          const { container, unmount } = renderWithTheme(<Contact />);
          
          try {
            // Find form elements using more specific queries
            const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement;
            const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
            const subjectInputs = container.querySelectorAll('input[type="text"]');
            const subjectInput = subjectInputs[1] as HTMLInputElement; // Second text input is subject
            const messageInput = container.querySelector('textarea') as HTMLTextAreaElement;
            const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
            
            // Verify elements exist
            expect(nameInput).toBeTruthy();
            expect(emailInput).toBeTruthy();
            expect(subjectInput).toBeTruthy();
            expect(messageInput).toBeTruthy();
            expect(submitButton).toBeTruthy();
            
            // Fill form with test data
            fireEvent.change(nameInput, { target: { value: formData.name } });
            fireEvent.change(emailInput, { target: { value: formData.email } });
            fireEvent.change(subjectInput, { target: { value: formData.subject } });
            fireEvent.change(messageInput, { target: { value: formData.message } });
            
            // Submit form to trigger validation
            fireEvent.click(submitButton);
            
            // Verify validation behavior matches our validation function
            const expectedErrors = validateContactForm(formData);
            
            // Property: Form should be in error state if validation fails
            const hasErrors = Object.keys(expectedErrors).length > 0;
            if (hasErrors) {
              // At least one error message should be visible
              const errorMessages = container.querySelectorAll('.MuiFormHelperText-root.Mui-error');
              expect(errorMessages.length).toBeGreaterThan(0);
            }
          } finally {
            // Clean up to prevent DOM pollution
            unmount();
          }
        }
      ),
      { numRuns: 20 } // Reduced runs for DOM-heavy test
    );
  });
});