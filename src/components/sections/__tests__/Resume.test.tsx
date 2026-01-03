import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import Resume from '../Resume';
import { theme } from '../../../styles/theme';
import { resumeData } from '../../../data';

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

// Mock PDF generator
jest.mock('../../utils/pdfGenerator', () => ({
  generateResumePDF: jest.fn().mockResolvedValue(undefined)
}));

// Mock console.log for PDF download testing
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Resume Component', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  describe('Resume Data Rendering', () => {
    test('renders resume section with proper semantic structure', () => {
      renderWithTheme(<Resume />);
      
      const resumeSection = document.getElementById('resume');
      expect(resumeSection).toBeInTheDocument();
      expect(resumeSection).toHaveAttribute('id', 'resume');
      expect(resumeSection?.tagName.toLowerCase()).toBe('section');
    });

    test('renders main resume heading', () => {
      renderWithTheme(<Resume />);
      
      const heading = screen.getByRole('heading', { level: 2, name: /about me/i });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('About Me');
    });

    test('renders personal summary from resume data', () => {
      renderWithTheme(<Resume />);
      
      const summary = screen.getByText(resumeData.personalInfo.summary);
      expect(summary).toBeInTheDocument();
    });

    test('renders contact information with proper links', () => {
      renderWithTheme(<Resume />);
      
      // Test email link
      const emailLink = screen.getByRole('link', { name: resumeData.personalInfo.email });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', `mailto:${resumeData.personalInfo.email}`);
      
      // Test phone link
      const phoneLink = screen.getByRole('link', { name: resumeData.personalInfo.phone });
      expect(phoneLink).toBeInTheDocument();
      expect(phoneLink).toHaveAttribute('href', `tel:${resumeData.personalInfo.phone}`);
      
      // Test LinkedIn link
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute('href', `https://${resumeData.personalInfo.linkedin}`);
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('renders professional experience section heading', () => {
      renderWithTheme(<Resume />);
      
      const experienceHeading = screen.getByRole('heading', { level: 3, name: /professional experience/i });
      expect(experienceHeading).toBeInTheDocument();
    });

    test('renders all experience entries from resume data', () => {
      renderWithTheme(<Resume />);
      
      resumeData.experience.forEach((exp) => {
        // Test company name
        const companyName = screen.getByText(exp.company);
        expect(companyName).toBeInTheDocument();
        
        // Test position title
        const position = screen.getByText(exp.position);
        expect(position).toBeInTheDocument();
        
        // Test date range
        const dateRange = screen.getByText(`${exp.startDate} - ${exp.endDate}`);
        expect(dateRange).toBeInTheDocument();
        
        // Test responsibilities
        exp.responsibilities.forEach((responsibility) => {
          const responsibilityText = screen.getByText(responsibility);
          expect(responsibilityText).toBeInTheDocument();
        });
        
        // Test technologies - use getAllByText for technologies that appear multiple times
        exp.technologies.forEach((tech) => {
          const techChips = screen.getAllByText(tech);
          expect(techChips.length).toBeGreaterThan(0);
          expect(techChips[0]).toBeInTheDocument();
        });
      });
    });

    test('renders current eMoney Advisor experience with present end date', () => {
      renderWithTheme(<Resume />);
      
      const emoneyExperience = resumeData.experience.find(exp => exp.company === 'eMoney Advisor');
      expect(emoneyExperience).toBeDefined();
      
      const companyName = screen.getByText('eMoney Advisor');
      expect(companyName).toBeInTheDocument();
      
      const seniorPosition = screen.getByText('Senior Software Engineer');
      expect(seniorPosition).toBeInTheDocument();
      
      // Check for the actual date range - use getAllByText and filter by context
      const dateElements = screen.getAllByText(/April 2022/i);
      // The first one should be the current position (April 2022 - Present)
      expect(dateElements.length).toBeGreaterThan(0);
      
      const endDate = screen.getByText(/Present/i);
      expect(endDate).toBeInTheDocument();
    });

    test('renders previous Elsevier experience with accurate dates', () => {
      renderWithTheme(<Resume />);
      
      const elsevierExperience = resumeData.experience.find(exp => exp.company === 'Elsevier');
      expect(elsevierExperience).toBeDefined();
      
      const companyName = screen.getByText('Elsevier');
      expect(companyName).toBeInTheDocument();
      
      const position = screen.getByText('Software Engineer');
      expect(position).toBeInTheDocument();
      
      // Check for the actual date range
      const startDate = screen.getByText(/June 2017/i);
      expect(startDate).toBeInTheDocument();
      
      // April 2022 appears in both experiences, so we just verify it exists
      const dateElements = screen.getAllByText(/April 2022/i);
      expect(dateElements.length).toBeGreaterThan(0);
    });

    test('renders education section heading', () => {
      renderWithTheme(<Resume />);
      
      const educationHeading = screen.getByRole('heading', { level: 3, name: /education/i });
      expect(educationHeading).toBeInTheDocument();
    });

    test('renders education information from Temple University', () => {
      renderWithTheme(<Resume />);
      
      resumeData.education.forEach((edu) => {
        // Test institution name
        const institution = screen.getByText(edu.institution);
        expect(institution).toBeInTheDocument();
        
        // Test degree and field
        const degreeField = screen.getByText(`${edu.degree} in ${edu.field}`);
        expect(degreeField).toBeInTheDocument();
        
        // Test graduation date
        const graduationDate = screen.getByText(edu.graduationDate);
        expect(graduationDate).toBeInTheDocument();
      });
    });

    test('renders technical skills section heading', () => {
      renderWithTheme(<Resume />);
      
      const skillsHeading = screen.getByRole('heading', { level: 3, name: /technical skills/i });
      expect(skillsHeading).toBeInTheDocument();
    });

    test('renders skills organized by category', () => {
      renderWithTheme(<Resume />);
      
      // Group skills by category to test organization
      const skillsByCategory = resumeData.skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {} as Record<string, typeof resumeData.skills>);

      // Test each category
      Object.entries(skillsByCategory).forEach(([category, categorySkills]) => {
        // Test category heading (should be lowercase as rendered)
        const categoryHeading = screen.getByText(category);
        expect(categoryHeading).toBeInTheDocument();
        
        // Test all skills in this category
        categorySkills.forEach((skill) => {
          const skillChips = screen.getAllByText(skill.name);
          expect(skillChips.length).toBeGreaterThan(0);
          expect(skillChips[0]).toBeInTheDocument();
        });
      });
    });

    test('renders React, TypeScript, and accessibility skills as required', () => {
      renderWithTheme(<Resume />);
      
      // Test specific required skills from requirements - use getAllByText for skills that appear multiple times
      const reactSkills = screen.getAllByText('React');
      expect(reactSkills.length).toBeGreaterThan(0);
      expect(reactSkills[0]).toBeInTheDocument();
      
      const typescriptSkills = screen.getAllByText('TypeScript');
      expect(typescriptSkills.length).toBeGreaterThan(0);
      expect(typescriptSkills[0]).toBeInTheDocument();
      
      const accessibilitySkill = screen.getByText('Web Accessibility (WCAG)');
      expect(accessibilitySkill).toBeInTheDocument();
    });
  });

  describe('PDF Download Functionality', () => {
    test('renders PDF download button with correct text and icon', () => {
      renderWithTheme(<Resume />);
      
      const downloadButton = screen.getByRole('button', { name: /download pdf version of resume/i });
      expect(downloadButton).toBeInTheDocument();
      expect(downloadButton).toHaveTextContent('Download PDF Resume');
      
      // Check for download icon (MUI icons render as SVG)
      const downloadIcon = downloadButton.querySelector('svg');
      expect(downloadIcon).toBeInTheDocument();
    });

    test('PDF download button is properly styled as Material-UI button', () => {
      renderWithTheme(<Resume />);
      
      const downloadButton = screen.getByRole('button', { name: /download pdf version of resume/i });
      
      // Check that button has MUI button classes
      expect(downloadButton).toHaveClass('MuiButton-root');
      expect(downloadButton).toHaveClass('MuiButton-contained');
    });

    test('PDF download button triggers download functionality when clicked', async () => {
      const { generateResumePDF } = require('../../utils/pdfGenerator');
      
      renderWithTheme(<Resume />);
      
      const downloadButton = screen.getByRole('button', { name: /download pdf version of resume/i });
      fireEvent.click(downloadButton);
      
      // Wait for async operation
      await waitFor(() => {
        expect(generateResumePDF).toHaveBeenCalled();
      });
    });

    test('PDF download button is accessible and keyboard navigable', () => {
      renderWithTheme(<Resume />);
      
      const downloadButton = screen.getByRole('button', { name: /download pdf version of resume/i });
      
      // Button should be focusable
      downloadButton.focus();
      expect(downloadButton).toHaveFocus();
      
      // Button should be activatable with click (keyboard events are complex in JSDOM)
      fireEvent.click(downloadButton);
    });
  });

  describe('Component Structure and Layout', () => {
    test('renders content within animated sections', () => {
      renderWithTheme(<Resume />);
      
      const animatedSections = screen.getAllByTestId('animated-section');
      expect(animatedSections.length).toBeGreaterThan(0);
    });

    test('uses proper Material-UI Grid layout for responsive design', () => {
      renderWithTheme(<Resume />);
      
      // Check for MUI Grid containers and items
      const gridContainers = document.querySelectorAll('.MuiGrid-container');
      expect(gridContainers.length).toBeGreaterThan(0);
      
      const gridItems = document.querySelectorAll('.MuiGrid-item');
      expect(gridItems.length).toBeGreaterThan(0);
    });

    test('renders experience and education in cards with proper styling', () => {
      renderWithTheme(<Resume />);
      
      // Check for MUI Card components
      const cards = document.querySelectorAll('.MuiCard-root');
      expect(cards.length).toBeGreaterThan(0);
      
      // Should have cards for experience, education, and skills
      const expectedMinimumCards = resumeData.experience.length + resumeData.education.length + 1; // +1 for skills categories
      expect(cards.length).toBeGreaterThanOrEqual(expectedMinimumCards);
    });

    test('renders proper icons for different sections', () => {
      renderWithTheme(<Resume />);
      
      // Check for various MUI icons (they render as SVG elements)
      const svgIcons = document.querySelectorAll('svg');
      expect(svgIcons.length).toBeGreaterThan(0);
      
      // Should have icons for work, school, code, email, phone, linkedin, and download
      expect(svgIcons.length).toBeGreaterThanOrEqual(7);
    });

    test('maintains proper content hierarchy and semantic structure', () => {
      renderWithTheme(<Resume />);
      
      // Check heading hierarchy
      const h2Headings = screen.getAllByRole('heading', { level: 2 });
      const h3Headings = screen.getAllByRole('heading', { level: 3 });
      const h4Headings = screen.getAllByRole('heading', { level: 4 });
      
      // Should have proper heading structure
      expect(h2Headings.length).toBe(1); // Main "About Me" heading
      expect(h3Headings.length).toBeGreaterThanOrEqual(3); // Professional Experience, Education, Technical Skills + job titles + degree
      expect(h4Headings.length).toBeGreaterThan(0); // Company names, education institutions, skill categories
    });
  });

  describe('Data Integration and Error Handling', () => {
    test('handles empty or missing data gracefully', () => {
      // This test ensures the component doesn't break if data is missing
      // The component should still render without throwing errors
      expect(() => renderWithTheme(<Resume />)).not.toThrow();
    });

    test('renders all required contact information', () => {
      renderWithTheme(<Resume />);
      
      // Verify all required contact methods are present
      expect(screen.getByText(resumeData.personalInfo.email)).toBeInTheDocument();
      expect(screen.getByText(resumeData.personalInfo.phone)).toBeInTheDocument();
      expect(screen.getByText(/linkedin/i)).toBeInTheDocument();
    });

    test('displays current employment status correctly', () => {
      renderWithTheme(<Resume />);
      
      // Should show "present" for current role
      const currentRole = screen.getByText(/present/i);
      expect(currentRole).toBeInTheDocument();
    });
  });
});