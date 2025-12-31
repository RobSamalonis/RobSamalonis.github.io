import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { theme } from './styles';
import { Navigation } from './components/layout';
import { PageTransition, LoadingSpinner, PerformanceOptimizer } from './components/common';
import { useSEO } from './hooks/useSEO';
import { initializePerformanceOptimizations } from './utils/performance';
import './App.css';

// Lazy load components for better performance
const Hero = lazy(() => import('./components/sections/Hero'));
const Resume = lazy(() => import('./components/sections/Resume'));
const Contact = lazy(() => import('./components/sections/Contact'));

function App() {
  const [currentSection, setCurrentSection] = useState('hero');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize SEO with default configuration
  useSEO();

  // Initialize performance optimizations
  useEffect(() => {
    initializePerformanceOptimizations();
  }, []);

  // Handle initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Brief loading state for smooth entrance animations

    return () => clearTimeout(timer);
  }, []);

  const handleSectionChange = useCallback((section: string) => {
    setCurrentSection(section);
  }, []);

  // Enhanced scroll detection with throttling for better performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sections = ['hero', 'resume', 'contact'];
          const scrollPosition = window.scrollY + 100; // Offset for navbar

          for (const sectionId of sections) {
            const element = document.getElementById(sectionId);
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setCurrentSection(sectionId);
                break;
              }
            }
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
  }, []);

  // Smooth scroll utility for better navigation
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Account for fixed header
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setCurrentSection(sectionId);
    }
  }, []);

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
                scrollToSection('hero');
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
