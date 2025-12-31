import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { theme } from './styles';
import { Navigation } from './components/layout';
import { 
  PageTransition, 
  LoadingSpinner, 
  PerformanceOptimizer,
  ScrollProgressIndicator,
  ContextualNavigation 
} from './components/common';
import { useSEO } from './hooks/useSEO';
import { initializePerformanceOptimizations } from './utils/performance';
import { useSmartScrolling } from './utils/smartScrolling';
import { useNavigationState } from './utils/navigationState';
import './App.css';

// Lazy load components for better performance
const Hero = lazy(() => import('./components/sections/Hero'));
const Resume = lazy(() => import('./components/sections/Resume'));
const Contact = lazy(() => import('./components/sections/Contact'));

function App() {
  const [currentSection, setCurrentSection] = useState('hero');
  const [isLoading, setIsLoading] = useState(true);
  const { scrollToSection, getCurrentSection } = useSmartScrolling();
  const navigationState = useNavigationState({
    persistToStorage: true,
    trackHistory: true,
    maxHistoryEntries: 10
  });

  // Initialize SEO with default configuration
  useSEO();

  // Initialize performance optimizations and restore navigation state
  useEffect(() => {
    initializePerformanceOptimizations();
    
    // Restore navigation state from previous session
    const storedSection = navigationState.getCurrentSection();
    if (storedSection && storedSection !== currentSection) {
      setCurrentSection(storedSection);
    }
    
    // Restore state after component mount
    setTimeout(() => {
      navigationState.restoreState();
    }, 100);
  }, [navigationState, currentSection]);

  // Handle initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Brief loading state for smooth entrance animations

    return () => clearTimeout(timer);
  }, []);

  const handleSectionChange = useCallback(async (section: string) => {
    setCurrentSection(section);
    
    // Update navigation state for persistence
    navigationState.updateCurrentSection(section);
    
    // Use smart scrolling for enhanced navigation
    await scrollToSection(section, {
      offset: 80,
      duration: 800,
      easing: 'easeInOut',
      onComplete: () => {
        // Navigation completed
      }
    });
  }, [scrollToSection, navigationState]);

  // Enhanced scroll detection with smart scrolling utilities and state persistence
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sections = ['hero', 'resume', 'contact'];
          const newSection = getCurrentSection(sections);
          
          if (newSection && newSection !== currentSection) {
            setCurrentSection(newSection);
            navigationState.updateCurrentSection(newSection);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Call once to set initial section

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [getCurrentSection, currentSection, navigationState]);

  // Enhanced scroll utility for navigation with state persistence
  const scrollToSectionHandler = useCallback(async (sectionId: string) => {
    await scrollToSection(sectionId, {
      offset: 80,
      duration: 800,
      easing: 'easeInOut',
      onComplete: () => {
        // Navigation completed
      }
    });
    
    setCurrentSection(sectionId);
    navigationState.updateCurrentSection(sectionId);
  }, [scrollToSection, navigationState]);

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          sx={{ 
            minHeight: '100vh', 
            backgroundColor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Loading state - could add a loading animation here if desired */}
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PerformanceOptimizer>
        <AnimatePresence>
          <Box 
            component="div"
            sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}
            role="main"
            aria-label="Robert Samalonis Portfolio Website"
          >
            <Navigation 
              currentSection={currentSection} 
              onSectionChange={handleSectionChange} 
            />
            
            {/* Skip to main content link for screen readers */}
            <Box
              component="a"
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSectionHandler('hero');
              }}
              sx={{
                position: 'absolute',
                left: '-9999px',
                zIndex: 999,
                padding: '8px 16px',
                backgroundColor: 'primary.main',
                color: 'white',
                textDecoration: 'none',
                '&:focus': {
                  left: '10px',
                  top: '10px',
                },
              }}
            >
              Skip to main content
            </Box>
            
            {/* Scroll Progress Indicators */}
            <ScrollProgressIndicator 
              mode="page" 
              position="top" 
            />
            
            {/* Contextual Navigation - Responsive breadcrumb positioning */}
            <ContextualNavigation
              currentSection={currentSection}
              onSectionChange={handleSectionChange}
              showBreadcrumbs={true}
              showSuggestions={false} // Hide suggestions to focus on breadcrumbs
              position="responsive-breadcrumbs"
            />
            
            {/* Main content sections with page transitions */}
            <PageTransition>
              <main>
                <Suspense fallback={<LoadingSpinner message="Loading Hero section..." />}>
                  <Hero />
                </Suspense>
                <Suspense fallback={<LoadingSpinner message="Loading Resume section..." />}>
                  <Resume />
                </Suspense>
                <Suspense fallback={<LoadingSpinner message="Loading Contact section..." />}>
                  <Contact />
                </Suspense>
              </main>
            </PageTransition>
          </Box>
        </AnimatePresence>
      </PerformanceOptimizer>
    </ThemeProvider>
  );
}

export default App;
