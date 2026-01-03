/**
 * Comprehensive accessibility validation utility
 * Validates WCAG 2.1 AA compliance and provides real-time accessibility feedback
 */

import { ColorContrast } from './accessibility';

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  category: 'contrast' | 'focus' | 'aria' | 'keyboard' | 'structure';
  element: string;
  description: string;
  recommendation: string;
  wcagReference?: string;
}

export class AccessibilityValidator {
  private static issues: AccessibilityIssue[] = [];

  /**
   * Validate all accessibility aspects of the current page
   */
  static validatePage(): AccessibilityIssue[] {
    this.issues = [];
    
    this.validateColorContrast();
    this.validateFocusManagement();
    this.validateAriaLabels();
    this.validateKeyboardNavigation();
    this.validateHeadingStructure();
    this.validateFormAccessibility();
    this.validateImageAccessibility();
    
    return this.issues;
  }

  /**
   * Validate color contrast for all text elements
   */
  private static validateColorContrast(): void {
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label');
    
    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = this.getEffectiveBackgroundColor(element);
      
      if (color && backgroundColor) {
        const ratio = ColorContrast.getContrastRatio(color, backgroundColor);
        const isLargeText = this.isLargeText(element, styles);
        const meetsAA = ColorContrast.meetsWCAGAA(color, backgroundColor, isLargeText);
        
        if (!meetsAA) {
          this.addIssue({
            type: 'error',
            category: 'contrast',
            element: this.getElementSelector(element),
            description: `Text contrast ratio ${ratio.toFixed(2)}:1 is below WCAG AA minimum`,
            recommendation: `Increase contrast to at least ${isLargeText ? '3:1' : '4.5:1'}`,
            wcagReference: 'WCAG 2.1 SC 1.4.3'
          });
        }
      }
    });
  }

  /**
   * Validate focus management
   */
  private static validateFocusManagement(): void {
    const focusableElements = document.querySelectorAll(
      'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
      // Check for visible focus indicators
      const styles = window.getComputedStyle(element, ':focus');
      const hasOutline = styles.outline !== 'none' && styles.outline !== '0px';
      const hasBoxShadow = styles.boxShadow !== 'none';
      
      if (!hasOutline && !hasBoxShadow) {
        this.addIssue({
          type: 'warning',
          category: 'focus',
          element: this.getElementSelector(element),
          description: 'Interactive element lacks visible focus indicator',
          recommendation: 'Add outline or box-shadow on :focus-visible',
          wcagReference: 'WCAG 2.1 SC 2.4.7'
        });
      }
      
      // Check for proper tabindex values
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex && parseInt(tabIndex) > 0) {
        this.addIssue({
          type: 'warning',
          category: 'focus',
          element: this.getElementSelector(element),
          description: 'Positive tabindex values can disrupt natural tab order',
          recommendation: 'Use tabindex="0" or rely on natural DOM order',
          wcagReference: 'WCAG 2.1 SC 2.4.3'
        });
      }
    });
  }

  /**
   * Validate ARIA labels and roles
   */
  private static validateAriaLabels(): void {
    // Check for missing alt text on images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      const alt = img.getAttribute('alt');
      const ariaLabel = img.getAttribute('aria-label');
      const ariaLabelledby = img.getAttribute('aria-labelledby');
      
      if (!alt && !ariaLabel && !ariaLabelledby) {
        this.addIssue({
          type: 'error',
          category: 'aria',
          element: this.getElementSelector(img),
          description: 'Image missing alternative text',
          recommendation: 'Add alt attribute or aria-label',
          wcagReference: 'WCAG 2.1 SC 1.1.1'
        });
      }
    });

    // Check for proper button labels
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      const hasText = button.textContent?.trim();
      const ariaLabel = button.getAttribute('aria-label');
      const ariaLabelledby = button.getAttribute('aria-labelledby');
      
      if (!hasText && !ariaLabel && !ariaLabelledby) {
        this.addIssue({
          type: 'error',
          category: 'aria',
          element: this.getElementSelector(button),
          description: 'Button missing accessible name',
          recommendation: 'Add text content, aria-label, or aria-labelledby',
          wcagReference: 'WCAG 2.1 SC 4.1.2'
        });
      }
    });

    // Check for proper form labels
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledby = input.getAttribute('aria-labelledby');
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;
      
      if (!label && !ariaLabel && !ariaLabelledby) {
        this.addIssue({
          type: 'error',
          category: 'aria',
          element: this.getElementSelector(input),
          description: 'Form control missing label',
          recommendation: 'Add associated label element or aria-label',
          wcagReference: 'WCAG 2.1 SC 3.3.2'
        });
      }
    });
  }

  /**
   * Validate keyboard navigation
   */
  private static validateKeyboardNavigation(): void {
    const interactiveElements = document.querySelectorAll(
      'button, a[href], input, textarea, select, [role="button"], [role="link"]'
    );
    
    interactiveElements.forEach(element => {
      const tabIndex = element.getAttribute('tabindex');
      
      // Check if interactive element is keyboard accessible
      if (tabIndex === '-1' && !element.closest('[role="menu"]')) {
        this.addIssue({
          type: 'warning',
          category: 'keyboard',
          element: this.getElementSelector(element),
          description: 'Interactive element not keyboard accessible',
          recommendation: 'Remove tabindex="-1" or ensure alternative keyboard access',
          wcagReference: 'WCAG 2.1 SC 2.1.1'
        });
      }
    });
  }

  /**
   * Validate heading structure
   */
  private static validateHeadingStructure(): void {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;
    
    headings.forEach(heading => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      
      if (currentLevel > previousLevel + 1) {
        this.addIssue({
          type: 'warning',
          category: 'structure',
          element: this.getElementSelector(heading),
          description: `Heading level ${currentLevel} follows h${previousLevel}, skipping levels`,
          recommendation: 'Use sequential heading levels (h1, h2, h3, etc.)',
          wcagReference: 'WCAG 2.1 SC 1.3.1'
        });
      }
      
      previousLevel = currentLevel;
    });
    
    // Check for missing h1
    const h1Elements = document.querySelectorAll('h1');
    if (h1Elements.length === 0) {
      this.addIssue({
        type: 'warning',
        category: 'structure',
        element: 'document',
        description: 'Page missing h1 heading',
        recommendation: 'Add an h1 element to identify the main page content',
        wcagReference: 'WCAG 2.1 SC 1.3.1'
      });
    } else if (h1Elements.length > 1) {
      this.addIssue({
        type: 'info',
        category: 'structure',
        element: 'document',
        description: 'Multiple h1 elements found',
        recommendation: 'Consider using only one h1 per page for better structure',
        wcagReference: 'WCAG 2.1 SC 1.3.1'
      });
    }
  }

  /**
   * Validate form accessibility
   */
  private static validateFormAccessibility(): void {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Check for fieldsets with legends
      const fieldsets = form.querySelectorAll('fieldset');
      fieldsets.forEach(fieldset => {
        const legend = fieldset.querySelector('legend');
        if (!legend) {
          this.addIssue({
            type: 'warning',
            category: 'structure',
            element: this.getElementSelector(fieldset),
            description: 'Fieldset missing legend',
            recommendation: 'Add legend element to describe the fieldset purpose',
            wcagReference: 'WCAG 2.1 SC 1.3.1'
          });
        }
      });
      
      // Check for error messages
      const errorElements = form.querySelectorAll('[aria-invalid="true"]');
      errorElements.forEach(element => {
        const describedBy = element.getAttribute('aria-describedby');
        if (!describedBy) {
          this.addIssue({
            type: 'warning',
            category: 'aria',
            element: this.getElementSelector(element),
            description: 'Invalid form field missing error description',
            recommendation: 'Add aria-describedby pointing to error message',
            wcagReference: 'WCAG 2.1 SC 3.3.3'
          });
        }
      });
    });
  }

  /**
   * Validate image accessibility
   */
  private static validateImageAccessibility(): void {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      const alt = img.getAttribute('alt');
      const src = img.getAttribute('src');
      
      // Check for decorative images
      if (alt === '' && !img.getAttribute('role')) {
        // This is correct for decorative images
        return;
      }
      
      // Check for missing src
      if (!src) {
        this.addIssue({
          type: 'error',
          category: 'structure',
          element: this.getElementSelector(img),
          description: 'Image missing src attribute',
          recommendation: 'Add src attribute or remove img element',
          wcagReference: 'WCAG 2.1 SC 1.1.1'
        });
      }
      
      // Check for overly long alt text
      if (alt && alt.length > 125) {
        this.addIssue({
          type: 'info',
          category: 'aria',
          element: this.getElementSelector(img),
          description: 'Alt text is very long (over 125 characters)',
          recommendation: 'Consider using shorter alt text or longdesc attribute',
          wcagReference: 'WCAG 2.1 SC 1.1.1'
        });
      }
    });
  }

  /**
   * Helper methods
   */
  private static addIssue(issue: AccessibilityIssue): void {
    this.issues.push(issue);
  }

  private static getElementSelector(element: Element): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `${element.tagName.toLowerCase()}.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  private static getEffectiveBackgroundColor(element: Element): string | null {
    let current = element as HTMLElement;
    
    while (current && current !== document.body) {
      const styles = window.getComputedStyle(current);
      const bgColor = styles.backgroundColor;
      
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        return bgColor;
      }
      
      current = current.parentElement as HTMLElement;
    }
    
    return '#000000'; // Default to black if no background found
  }

  private static isLargeText(element: Element, styles: CSSStyleDeclaration): boolean {
    const fontSize = parseFloat(styles.fontSize);
    const fontWeight = styles.fontWeight;
    
    // Large text is 18pt (24px) or 14pt (18.66px) bold
    return fontSize >= 24 || (fontSize >= 18.66 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
  }

  /**
   * Generate accessibility report
   */
  static generateReport(): string {
    const issues = this.validatePage();
    const errors = issues.filter(i => i.type === 'error');
    const warnings = issues.filter(i => i.type === 'warning');
    const infos = issues.filter(i => i.type === 'info');
    
    let report = '# Accessibility Validation Report\n\n';
    
    report += `## Summary\n`;
    report += `- Total issues: ${issues.length}\n`;
    report += `- Errors: ${errors.length}\n`;
    report += `- Warnings: ${warnings.length}\n`;
    report += `- Info: ${infos.length}\n\n`;
    
    if (errors.length > 0) {
      report += `## ❌ Errors\n\n`;
      errors.forEach(issue => {
        report += `### ${issue.element}\n`;
        report += `- **Issue:** ${issue.description}\n`;
        report += `- **Recommendation:** ${issue.recommendation}\n`;
        report += `- **WCAG Reference:** ${issue.wcagReference}\n\n`;
      });
    }
    
    if (warnings.length > 0) {
      report += `## ⚠️ Warnings\n\n`;
      warnings.forEach(issue => {
        report += `### ${issue.element}\n`;
        report += `- **Issue:** ${issue.description}\n`;
        report += `- **Recommendation:** ${issue.recommendation}\n`;
        report += `- **WCAG Reference:** ${issue.wcagReference}\n\n`;
      });
    }
    
    if (infos.length > 0) {
      report += `## ℹ️ Information\n\n`;
      infos.forEach(issue => {
        report += `### ${issue.element}\n`;
        report += `- **Issue:** ${issue.description}\n`;
        report += `- **Recommendation:** ${issue.recommendation}\n`;
        report += `- **WCAG Reference:** ${issue.wcagReference}\n\n`;
      });
    }
    
    if (issues.length === 0) {
      report += `## ✅ No accessibility issues found!\n\n`;
      report += `The page appears to meet WCAG 2.1 AA standards.\n`;
    }
    
    return report;
  }
}

export default AccessibilityValidator;