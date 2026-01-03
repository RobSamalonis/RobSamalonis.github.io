import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { theme } from './styles';
import { 
  PageTransition, 
  LoadingSpinner, 
  PerformanceOptimizer,
  BackToTop
} from './components/common';
import { useSEO } from './hooks/useSEO';
import { initializePerformanceOptimizations } from './utils/performance';
import './App.css';
import './styles/accessibility.css';

// Lazy load components for better performance
const Hero = lazy(() => import('./components/sections/Hero'));
const Resume = lazy(() => import('./components/sections/Resume'));
const Contact = lazy(() => import('./components/sections/Contact'));

function App() {
  // Initialize SEO with default configuration
  useSEO();

  // Initialize performance optimizations
  useEffect(() => {
    initializePerformanceOptimizations();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PerformanceOptimizer>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ minHeight: '100vh' }}
          >
            <Box 
              component="div"
              sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}
              role="main"
              aria-label="Robert Samalonis Portfolio Website"
            >
              {/* Back to Top Button */}
              <BackToTop />
              
              {/* Main content sections with page transitions */}
              <PageTransition>
                <main id="main-content">
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
          </motion.div>
        </AnimatePresence>
      </PerformanceOptimizer>
    </ThemeProvider>
  );
}

export default App;
