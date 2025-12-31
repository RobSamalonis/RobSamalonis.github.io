import { UserPreferences } from './accessibility';

interface ScrollOptions {
  /** Offset from the top when scrolling to element */
  offset?: number;
  /** Duration of scroll animation in milliseconds */
  duration?: number;
  /** Easing function for scroll animation */
  easing?: 'linear' | 'easeInOut' | 'easeOut' | 'easeIn';
  /** Callback when scroll completes */
  onComplete?: () => void;
}

interface SectionTransitionOptions {
  /** Whether to announce section changes to screen readers */
  announceToScreenReader?: boolean;
  /** Custom announcement text */
  customAnnouncement?: string;
  /** Whether to update browser history */
  updateHistory?: boolean;
}

/**
 * Enhanced scrolling utilities with smooth animations and accessibility support
 */
export class SmartScrolling {
  private static isScrolling = false;
  private static scrollController: AbortController | null = null;

  /**
   * Smoothly scroll to an element with enhanced options
   */
  static async scrollToElement(
    elementId: string, 
    options: ScrollOptions = {}
  ): Promise<void> {
    const {
      offset = 80,
      duration = 800,
      easing = 'easeInOut',
      onComplete
    } = options;

    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with id "${elementId}" not found`);
      return;
    }

    // Cancel any ongoing scroll
    this.cancelScroll();

    const startPosition = window.pageYOffset;
    const targetPosition = element.offsetTop - offset;
    const distance = targetPosition - startPosition;

    // Respect reduced motion preference
    if (UserPreferences.prefersReducedMotion()) {
      window.scrollTo(0, targetPosition);
      onComplete?.();
      return;
    }

    // Create abort controller for this scroll operation
    this.scrollController = new AbortController();
    const { signal } = this.scrollController;

    this.isScrolling = true;

    return new Promise((resolve) => {
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        if (signal.aborted) {
          this.isScrolling = false;
          resolve();
          return;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Apply easing function
        const easedProgress = this.applyEasing(progress, easing);
        const currentPosition = startPosition + (distance * easedProgress);

        window.scrollTo(0, currentPosition);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          this.isScrolling = false;
          this.scrollController = null;
          onComplete?.();
          resolve();
        }
      };

      requestAnimationFrame(animateScroll);
    });
  }

  /**
   * Enhanced section transition with accessibility and UX improvements
   */
  static async transitionToSection(
    sectionId: string,
    scrollOptions: ScrollOptions = {},
    transitionOptions: SectionTransitionOptions = {}
  ): Promise<void> {
    const {
      announceToScreenReader = true,
      customAnnouncement,
      updateHistory = true
    } = transitionOptions;

    // Scroll to section
    await this.scrollToElement(sectionId, scrollOptions);

    // Update browser history
    if (updateHistory && window.history.pushState) {
      const newUrl = `${window.location.pathname}#${sectionId}`;
      window.history.pushState({ section: sectionId }, '', newUrl);
    }

    // Announce to screen readers
    if (announceToScreenReader) {
      const element = document.getElementById(sectionId);
      const announcement = customAnnouncement || 
        element?.getAttribute('aria-label') || 
        `Navigated to ${sectionId} section`;
      
      this.announceToScreenReader(announcement);
    }

    // Focus management for accessibility
    this.manageFocusAfterScroll(sectionId);
  }

  /**
   * Get scroll progress within a section
   */
  static getSectionScrollProgress(sectionId: string): number {
    const section = document.getElementById(sectionId);
    if (!section) return 0;

    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + window.pageYOffset;
    const sectionHeight = rect.height;
    const scrollTop = window.pageYOffset;
    const viewportHeight = window.innerHeight;

    // Check if section is in viewport
    if (scrollTop + viewportHeight <= sectionTop || scrollTop >= sectionTop + sectionHeight) {
      return 0;
    }

    // Calculate progress within section
    const sectionScrollTop = Math.max(0, scrollTop - sectionTop);
    const maxScroll = Math.max(0, sectionHeight - viewportHeight);
    
    return maxScroll > 0 ? Math.min(100, (sectionScrollTop / maxScroll) * 100) : 100;
  }

  /**
   * Get the currently visible section based on scroll position
   */
  static getCurrentSection(sectionIds: string[]): string | null {
    const scrollPosition = window.pageYOffset + 100; // Offset for navbar

    for (const sectionId of sectionIds) {
      const element = document.getElementById(sectionId);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          return sectionId;
        }
      }
    }

    return sectionIds[0] || null; // Default to first section
  }

  /**
   * Cancel any ongoing scroll animation
   */
  static cancelScroll(): void {
    if (this.scrollController) {
      this.scrollController.abort();
      this.scrollController = null;
    }
    this.isScrolling = false;
  }

  /**
   * Check if currently scrolling
   */
  static get isCurrentlyScrolling(): boolean {
    return this.isScrolling;
  }

  /**
   * Apply easing function to progress value
   */
  private static applyEasing(progress: number, easing: string): number {
    switch (easing) {
      case 'linear':
        return progress;
      case 'easeInOut':
        return progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      case 'easeOut':
        return 1 - Math.pow(1 - progress, 2);
      case 'easeIn':
        return progress * progress;
      default:
        return progress;
    }
  }

  /**
   * Announce text to screen readers
   */
  private static announceToScreenReader(text: string): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    document.body.appendChild(announcement);
    
    // Delay to ensure screen reader picks up the announcement
    setTimeout(() => {
      announcement.textContent = text;
      
      // Remove after announcement
      setTimeout(() => {
        if (announcement.parentNode) {
          announcement.parentNode.removeChild(announcement);
        }
      }, 1000);
    }, 100);
  }

  /**
   * Manage focus after scrolling for accessibility
   */
  private static manageFocusAfterScroll(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Find the first focusable element in the section
    const focusableElements = section.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      // Focus the first focusable element
      (focusableElements[0] as HTMLElement).focus();
    } else {
      // Make the section itself focusable and focus it
      section.setAttribute('tabindex', '-1');
      section.focus();
      
      // Remove tabindex after focus to avoid affecting tab order
      setTimeout(() => {
        section.removeAttribute('tabindex');
      }, 100);
    }
  }
}

/**
 * Hook for managing smart scrolling in React components
 */
export const useSmartScrolling = () => {
  const scrollToSection = async (
    sectionId: string, 
    options?: ScrollOptions & SectionTransitionOptions
  ) => {
    const { announceToScreenReader, customAnnouncement, updateHistory, ...scrollOptions } = options || {};
    
    await SmartScrolling.transitionToSection(
      sectionId,
      scrollOptions,
      { announceToScreenReader, customAnnouncement, updateHistory }
    );
  };

  const getCurrentSection = (sectionIds: string[]) => {
    return SmartScrolling.getCurrentSection(sectionIds);
  };

  const getSectionProgress = (sectionId: string) => {
    return SmartScrolling.getSectionScrollProgress(sectionId);
  };

  const cancelScroll = () => {
    SmartScrolling.cancelScroll();
  };

  return {
    scrollToSection,
    getCurrentSection,
    getSectionProgress,
    cancelScroll,
    isScrolling: SmartScrolling.isCurrentlyScrolling
  };
};