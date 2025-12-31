interface NavigationState {
  currentSection: string;
  scrollPosition: number;
  timestamp: number;
  sessionId: string;
  visitHistory: string[];
  preferences: {
    reducedMotion: boolean;
    autoScroll: boolean;
    showContextualHints: boolean;
  };
}

interface NavigationStateOptions {
  /** Whether to persist state in localStorage */
  persistToStorage?: boolean;
  /** Whether to track visit history */
  trackHistory?: boolean;
  /** Maximum history entries to keep */
  maxHistoryEntries?: number;
  /** Session timeout in milliseconds */
  sessionTimeout?: number;
}

/**
 * Navigation state management utility for maintaining state across interactions
 */
export class NavigationStateManager {
  private static instance: NavigationStateManager | null = null;
  private state: NavigationState;
  private options: Required<NavigationStateOptions>;
  private listeners: Set<(state: NavigationState) => void> = new Set();
  private storageKey = 'portfolio-navigation-state';
  private sessionId: string;

  private constructor(options: NavigationStateOptions = {}) {
    this.options = {
      persistToStorage: true,
      trackHistory: true,
      maxHistoryEntries: 10,
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      ...options
    };

    this.sessionId = this.generateSessionId();
    this.state = this.initializeState();
    this.setupEventListeners();
  }

  /**
   * Get singleton instance
   */
  static getInstance(options?: NavigationStateOptions): NavigationStateManager {
    if (!NavigationStateManager.instance) {
      NavigationStateManager.instance = new NavigationStateManager(options);
    }
    return NavigationStateManager.instance;
  }

  /**
   * Initialize navigation state from storage or defaults
   */
  private initializeState(): NavigationState {
    const defaultState: NavigationState = {
      currentSection: 'hero',
      scrollPosition: 0,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      visitHistory: ['hero'],
      preferences: {
        reducedMotion: this.detectReducedMotionPreference(),
        autoScroll: true,
        showContextualHints: true
      }
    };

    if (!this.options.persistToStorage) {
      return defaultState;
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsedState: NavigationState = JSON.parse(stored);
        
        // Check if session is still valid
        const isSessionValid = Date.now() - parsedState.timestamp < this.options.sessionTimeout;
        
        if (isSessionValid) {
          // Update session info but keep other state
          return {
            ...parsedState,
            sessionId: this.sessionId,
            timestamp: Date.now(),
            preferences: {
              ...parsedState.preferences,
              reducedMotion: this.detectReducedMotionPreference() // Always use current preference
            }
          };
        }
      }
    } catch (error) {
      console.warn('Failed to load navigation state from storage:', error);
    }

    return defaultState;
  }

  /**
   * Update current section and manage state
   */
  updateCurrentSection(sectionId: string): void {
    const previousSection = this.state.currentSection;
    
    this.state = {
      ...this.state,
      currentSection: sectionId,
      timestamp: Date.now(),
      scrollPosition: window.pageYOffset
    };

    // Update visit history
    if (this.options.trackHistory && sectionId !== previousSection) {
      this.addToHistory(sectionId);
    }

    this.persistState();
    this.notifyListeners();
  }

  /**
   * Update scroll position
   */
  updateScrollPosition(position: number): void {
    this.state = {
      ...this.state,
      scrollPosition: position,
      timestamp: Date.now()
    };

    // Throttle storage updates for scroll position
    this.throttledPersistState();
  }

  /**
   * Update user preferences
   */
  updatePreferences(preferences: Partial<NavigationState['preferences']>): void {
    this.state = {
      ...this.state,
      preferences: {
        ...this.state.preferences,
        ...preferences
      },
      timestamp: Date.now()
    };

    this.persistState();
    this.notifyListeners();
  }

  /**
   * Get current navigation state
   */
  getState(): Readonly<NavigationState> {
    return { ...this.state };
  }

  /**
   * Get current section
   */
  getCurrentSection(): string {
    return this.state.currentSection;
  }

  /**
   * Get visit history
   */
  getVisitHistory(): string[] {
    return [...this.state.visitHistory];
  }

  /**
   * Get user preferences
   */
  getPreferences(): NavigationState['preferences'] {
    return { ...this.state.preferences };
  }

  /**
   * Check if section has been visited
   */
  hasVisited(sectionId: string): boolean {
    return this.state.visitHistory.includes(sectionId);
  }

  /**
   * Get previous section in history
   */
  getPreviousSection(): string | null {
    const history = this.state.visitHistory;
    const currentIndex = history.lastIndexOf(this.state.currentSection);
    return currentIndex > 0 ? history[currentIndex - 1] : null;
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: NavigationState) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Restore navigation state (useful after page reload)
   */
  restoreState(): void {
    const { scrollPosition } = this.state;
    
    // Restore scroll position after a brief delay to ensure page is loaded
    setTimeout(() => {
      if (scrollPosition > 0) {
        window.scrollTo({
          top: scrollPosition,
          behavior: this.state.preferences.reducedMotion ? 'auto' : 'smooth'
        });
      }
    }, 100);

    this.notifyListeners();
  }

  /**
   * Clear navigation state
   */
  clearState(): void {
    this.state = {
      currentSection: 'hero',
      scrollPosition: 0,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      visitHistory: ['hero'],
      preferences: {
        reducedMotion: this.detectReducedMotionPreference(),
        autoScroll: true,
        showContextualHints: true
      }
    };

    if (this.options.persistToStorage) {
      localStorage.removeItem(this.storageKey);
    }

    this.notifyListeners();
  }

  /**
   * Add section to visit history
   */
  private addToHistory(sectionId: string): void {
    const history = [...this.state.visitHistory];
    
    // Remove if already exists to avoid duplicates
    const existingIndex = history.indexOf(sectionId);
    if (existingIndex !== -1) {
      history.splice(existingIndex, 1);
    }
    
    // Add to end
    history.push(sectionId);
    
    // Limit history size
    if (history.length > this.options.maxHistoryEntries) {
      history.shift();
    }
    
    this.state.visitHistory = history;
  }

  /**
   * Persist state to localStorage
   */
  private persistState(): void {
    if (!this.options.persistToStorage) return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (error) {
      console.warn('Failed to persist navigation state:', error);
    }
  }

  /**
   * Throttled version of persistState for scroll updates
   */
  private throttledPersistState = this.throttle(() => {
    this.persistState();
  }, 500);

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getState());
      } catch (error) {
        console.error('Error in navigation state listener:', error);
      }
    });
  }

  /**
   * Setup event listeners for automatic state management
   */
  private setupEventListeners(): void {
    // Track scroll position
    const handleScroll = () => {
      this.updateScrollPosition(window.pageYOffset);
    };

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        this.persistState();
      }
    };

    // Track before page unload
    const handleBeforeUnload = () => {
      this.persistState();
    };

    // Track media query changes for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMediaChange = () => {
      this.updatePreferences({
        reducedMotion: mediaQuery.matches
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    mediaQuery.addEventListener('change', handleMediaChange);

    // Cleanup function (though singleton won't typically be destroyed)
    this.cleanup = () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }

  private cleanup?: () => void;

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Detect user's reduced motion preference
   */
  private detectReducedMotionPreference(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Throttle utility function
   */
  private throttle<T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastExecTime = 0;
    
    return (...args: Parameters<T>) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
          timeoutId = null;
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  /**
   * Destroy instance (for testing or cleanup)
   */
  static destroy(): void {
    if (NavigationStateManager.instance?.cleanup) {
      NavigationStateManager.instance.cleanup();
    }
    NavigationStateManager.instance = null;
  }
}

/**
 * React hook for using navigation state management
 */
export const useNavigationState = (options?: NavigationStateOptions) => {
  const manager = NavigationStateManager.getInstance(options);
  
  return {
    state: manager.getState(),
    updateCurrentSection: (sectionId: string) => manager.updateCurrentSection(sectionId),
    updatePreferences: (preferences: Partial<NavigationState['preferences']>) => 
      manager.updatePreferences(preferences),
    getCurrentSection: () => manager.getCurrentSection(),
    getVisitHistory: () => manager.getVisitHistory(),
    hasVisited: (sectionId: string) => manager.hasVisited(sectionId),
    getPreviousSection: () => manager.getPreviousSection(),
    subscribe: (listener: (state: NavigationState) => void) => manager.subscribe(listener),
    restoreState: () => manager.restoreState(),
    clearState: () => manager.clearState()
  };
};