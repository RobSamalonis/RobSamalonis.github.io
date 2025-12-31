/**
 * Accessibility utilities for maintaining WCAG 2.1 AA compliance
 * and enhancing navigation accessibility features
 */

// ARIA live region manager for dynamic content updates
class AriaLiveRegionManager {
  private static instance: AriaLiveRegionManager;
  private politeRegion: HTMLElement | null = null;
  private assertiveRegion: HTMLElement | null = null;

  static getInstance(): AriaLiveRegionManager {
    if (!AriaLiveRegionManager.instance) {
      AriaLiveRegionManager.instance = new AriaLiveRegionManager();
    }
    return AriaLiveRegionManager.instance;
  }

  private createLiveRegion(politeness: 'polite' | 'assertive'): HTMLElement {
    const region = document.createElement('div');
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');
    region.style.position = 'absolute';
    region.style.left = '-10000px';
    region.style.width = '1px';
    region.style.height = '1px';
    region.style.overflow = 'hidden';
    document.body.appendChild(region);
    return region;
  }

  private getPoliteRegion(): HTMLElement {
    if (!this.politeRegion) {
      this.politeRegion = this.createLiveRegion('polite');
    }
    return this.politeRegion;
  }

  private getAssertiveRegion(): HTMLElement {
    if (!this.assertiveRegion) {
      this.assertiveRegion = this.createLiveRegion('assertive');
    }
    return this.assertiveRegion;
  }

  /**
   * Announce navigation changes to screen readers
   */
  announceNavigation(sectionName: string, description?: string): void {
    const message = description 
      ? `Navigated to ${sectionName} section. ${description}`
      : `Navigated to ${sectionName} section`;
    
    const region = this.getPoliteRegion();
    region.textContent = message;
  }

  /**
   * Announce important status changes
   */
  announceStatus(message: string, urgent = false): void {
    const region = urgent ? this.getAssertiveRegion() : this.getPoliteRegion();
    region.textContent = message;
  }

  /**
   * Clear announcements
   */
  clear(): void {
    if (this.politeRegion) {
      this.politeRegion.textContent = '';
    }
    if (this.assertiveRegion) {
      this.assertiveRegion.textContent = '';
    }
  }
}

// Focus management utilities
class FocusManager {
  private static focusStack: HTMLElement[] = [];
  private static trapStack: HTMLElement[] = [];

  /**
   * Save current focus and set new focus
   */
  static saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      this.focusStack.push(activeElement);
    }
  }

  /**
   * Restore previously saved focus
   */
  static restoreFocus(): void {
    const previousFocus = this.focusStack.pop();
    if (previousFocus && document.contains(previousFocus)) {
      // Use setTimeout to ensure DOM updates are complete
      setTimeout(() => {
        previousFocus.focus();
      }, 0);
    }
  }

  /**
   * Set focus to first focusable element in container
   */
  static focusFirst(container: HTMLElement): boolean {
    const focusableElement = this.getFirstFocusableElement(container);
    if (focusableElement) {
      focusableElement.focus();
      return true;
    }
    return false;
  }

  /**
   * Set focus to last focusable element in container
   */
  static focusLast(container: HTMLElement): boolean {
    const focusableElements = this.getFocusableElements(container);
    const lastElement = focusableElements[focusableElements.length - 1];
    if (lastElement) {
      lastElement.focus();
      return true;
    }
    return false;
  }

  /**
   * Get all focusable elements in container
   */
  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="link"]',
      '[role="menuitem"]',
      '[role="tab"]'
    ].join(', ');

    const elements = Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
    
    return elements.filter(element => {
      // Check if element is visible and not in an aria-hidden container
      const style = window.getComputedStyle(element);
      const isVisible = style.display !== 'none' && 
                       style.visibility !== 'hidden' && 
                       style.opacity !== '0';
      
      const isNotHidden = !element.closest('[aria-hidden="true"]') &&
                         element.getAttribute('aria-hidden') !== 'true';
      
      return isVisible && isNotHidden;
    });
  }

  /**
   * Get first focusable element in container
   */
  static getFirstFocusableElement(container: HTMLElement): HTMLElement | null {
    const focusableElements = this.getFocusableElements(container);
    return focusableElements[0] || null;
  }

  /**
   * Create focus trap for modal/drawer components
   */
  static trapFocus(container: HTMLElement): () => void {
    this.trapStack.push(container);
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      
      const focusableElements = this.getFocusableElements(container);
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Return cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const index = this.trapStack.indexOf(container);
      if (index > -1) {
        this.trapStack.splice(index, 1);
      }
    };
  }
}

// Keyboard navigation utilities
class KeyboardNavigation {
  /**
   * Handle arrow key navigation for menu items
   */
  static handleArrowNavigation(
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (index: number) => void,
    orientation: 'horizontal' | 'vertical' = 'horizontal'
  ): void {
    const { key } = event;
    let newIndex = currentIndex;
    
    if (orientation === 'horizontal') {
      if (key === 'ArrowLeft') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      } else if (key === 'ArrowRight') {
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      }
    } else {
      if (key === 'ArrowUp') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      } else if (key === 'ArrowDown') {
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      }
    }
    
    if (newIndex !== currentIndex) {
      event.preventDefault();
      onIndexChange(newIndex);
      items[newIndex]?.focus();
    }
  }

  /**
   * Handle Home/End key navigation
   */
  static handleHomeEndNavigation(
    event: KeyboardEvent,
    items: HTMLElement[],
    onIndexChange: (index: number) => void
  ): void {
    const { key } = event;
    
    if (key === 'Home') {
      event.preventDefault();
      onIndexChange(0);
      items[0]?.focus();
    } else if (key === 'End') {
      event.preventDefault();
      const lastIndex = items.length - 1;
      onIndexChange(lastIndex);
      items[lastIndex]?.focus();
    }
  }
}

// Color contrast utilities
class ColorContrast {
  /**
   * Calculate relative luminance of a color
   */
  static getRelativeLuminance(color: string): number {
    // Convert color to RGB values
    const rgb = this.hexToRgb(color) || this.parseRgb(color);
    if (!rgb) return 0;
    
    // Convert to relative luminance
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  static getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getRelativeLuminance(color1);
    const lum2 = this.getRelativeLuminance(color2);
    
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Check if color combination meets WCAG AA standards
   */
  static meetsWCAGAA(foreground: string, background: string, isLargeText = false): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  }

  /**
   * Check if color combination meets WCAG AAA standards
   */
  static meetsWCAGAAA(foreground: string, background: string, isLargeText = false): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }

  private static hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }

  private static parseRgb(rgb: string): [number, number, number] | null {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    return match ? [
      parseInt(match[1], 10),
      parseInt(match[2], 10),
      parseInt(match[3], 10)
    ] : null;
  }
}

// User preference detection
class UserPreferences {
  /**
   * Check if user prefers reduced motion
   */
  static prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Check if user prefers high contrast
   */
  static prefersHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }

  /**
   * Check if user prefers dark color scheme
   */
  static prefersDarkMode(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Listen for preference changes
   */
  static onPreferenceChange(
    preference: 'reduced-motion' | 'high-contrast' | 'dark-mode',
    callback: (matches: boolean) => void
  ): () => void {
    const queries = {
      'reduced-motion': '(prefers-reduced-motion: reduce)',
      'high-contrast': '(prefers-contrast: high)',
      'dark-mode': '(prefers-color-scheme: dark)'
    };
    
    const mediaQuery = window.matchMedia(queries[preference]);
    const handler = (e: MediaQueryListEvent) => callback(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }
}

// Semantic markup utilities
class SemanticMarkup {
  /**
   * Generate unique IDs for ARIA relationships
   */
  static generateId(prefix = 'a11y'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create ARIA describedby relationship
   */
  static createDescribedBy(element: HTMLElement, description: string): string {
    const descriptionId = this.generateId('desc');
    const descriptionElement = document.createElement('div');
    
    descriptionElement.id = descriptionId;
    descriptionElement.textContent = description;
    descriptionElement.style.position = 'absolute';
    descriptionElement.style.left = '-10000px';
    descriptionElement.setAttribute('aria-hidden', 'true');
    
    document.body.appendChild(descriptionElement);
    element.setAttribute('aria-describedby', descriptionId);
    
    return descriptionId;
  }

  /**
   * Validate heading hierarchy
   */
  static validateHeadingHierarchy(container: HTMLElement = document.body): boolean {
    const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;
    
    for (const heading of headings) {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      
      if (currentLevel > previousLevel + 1) {
        console.warn(`Heading hierarchy violation: ${heading.tagName} follows h${previousLevel}`);
        return false;
      }
      
      previousLevel = currentLevel;
    }
    
    return true;
  }
}

// Export singleton instances
export const ariaLiveRegionManager = AriaLiveRegionManager.getInstance();
export const focusManager = new FocusManager();
export const keyboardNavigation = new KeyboardNavigation();
export const colorContrast = new ColorContrast();
export const userPreferences = new UserPreferences();
export const semanticMarkup = new SemanticMarkup();

// Export all utilities as default exports to avoid conflicts
export {
  AriaLiveRegionManager,
  FocusManager,
  KeyboardNavigation,
  ColorContrast,
  UserPreferences,
  SemanticMarkup
};