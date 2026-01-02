import React, { useState, useEffect, useCallback } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { modernNavigationItems } from '../../config/navigation';
import { useSmartScrolling } from '../../utils/smartScrolling';
import { useNavigationState } from '../../utils/navigationState';

interface ContextualNavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  /** Show breadcrumb-style navigation hints */
  showBreadcrumbs?: boolean;
  /** Show next/previous section suggestions */
  showSuggestions?: boolean;
  /** Position of the contextual navigation */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'overlay-top-left' | 'overlay-bottom-right' | 'responsive-breadcrumbs';
}

interface NavigationSuggestion {
  id: string;
  label: string;
  description?: string;
  direction: 'up' | 'down';
  icon: React.ReactNode;
}

const ContextualNavigation: React.FC<ContextualNavigationProps> = ({
  currentSection,
  onSectionChange,
  showBreadcrumbs = true,
  showSuggestions = true,
  position = 'bottom-right'
}) => {
  const theme = useTheme();
  const { scrollToSection } = useSmartScrolling();
  const navigationState = useNavigationState();
  const [hoveredSuggestion, setHoveredSuggestion] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  
  // Detect if we're on desktop (md and up) for responsive breadcrumb positioning
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Determine effective position based on responsive setting
  const effectivePosition = position === 'responsive-breadcrumbs' 
    ? (isDesktop ? 'overlay-top-left' : 'overlay-bottom-right')
    : position;

  // Hide breadcrumbs and navigation suggestions completely on desktop when using responsive-breadcrumbs position
  const shouldShowBreadcrumbs = position === 'responsive-breadcrumbs' 
    ? (isMobile && showBreadcrumbs) 
    : showBreadcrumbs;
    
  const shouldShowSuggestions = position === 'responsive-breadcrumbs' 
    ? (isMobile && showSuggestions) 
    : showSuggestions;

  // Get current section index and navigation suggestions
  const currentIndex = modernNavigationItems.findIndex(item => item.id === currentSection);
  const currentItem = modernNavigationItems[currentIndex];

  const suggestions: NavigationSuggestion[] = [];
  
  // Add previous section suggestion
  if (currentIndex > 0) {
    const prevItem = modernNavigationItems[currentIndex - 1];
    suggestions.push({
      id: prevItem.id,
      label: prevItem.label,
      description: prevItem.description,
      direction: 'up',
      icon: <ArrowUp size={16} />
    });
  }

  // Add next section suggestion
  if (currentIndex < modernNavigationItems.length - 1) {
    const nextItem = modernNavigationItems[currentIndex + 1];
    suggestions.push({
      id: nextItem.id,
      label: nextItem.label,
      description: nextItem.description,
      direction: 'down',
      icon: <ArrowDown size={16} />
    });
  }

  // Show contextual navigation after user starts scrolling
  // For responsive-breadcrumbs on desktop, hide completely since main nav is sufficient
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset > (effectivePosition === 'overlay-top-left' || effectivePosition === 'overlay-bottom-right' ? 50 : 200);
      
      // Check if we're at the bottom of the page
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset;
      const clientHeight = window.innerHeight;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
      
      setIsAtBottom(atBottom);
      
      // For responsive-breadcrumbs on desktop, don't show anything - main navigation is sufficient
      if (position === 'responsive-breadcrumbs' && isDesktop) {
        setIsVisible(false);
      } else {
        setIsVisible(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Call once to set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, [effectivePosition, position, isDesktop]);

  // Handle suggestion click with state persistence
  const handleSuggestionClick = useCallback(async (suggestionId: string) => {
    await scrollToSection(suggestionId, {
      offset: 80,
      duration: 900, // Smooth scroll animation (800-1000ms range)
      easing: 'easeInOut',
      onComplete: () => {
        // Navigation completed
      }
    });
    
    // Update navigation state for persistence
    navigationState.updateCurrentSection(suggestionId);
    onSectionChange(suggestionId);
  }, [scrollToSection, onSectionChange, navigationState]);

  // Handle keyboard navigation (arrow keys)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle arrow keys when not typing in an input/textarea
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        
        // Check if we're at the last section
        if (currentIndex >= modernNavigationItems.length - 1) {
          // If at the last section, try to scroll down within the section
          const currentSectionElement = document.getElementById(currentSection);
          if (currentSectionElement) {
            const currentScrollTop = window.pageYOffset;
            const sectionBottom = currentSectionElement.offsetTop + currentSectionElement.offsetHeight;
            const viewportBottom = currentScrollTop + window.innerHeight;
            
            // If there's more content below in the current section, scroll down smoothly
            if (viewportBottom < sectionBottom - 100) {
              window.scrollBy({
                top: window.innerHeight * 0.7, // Scroll down by 70% of viewport height
                behavior: 'smooth'
              });
            }
          }
        } else {
          // Navigate to next section
          const nextItem = modernNavigationItems[currentIndex + 1];
          handleSuggestionClick(nextItem.id);
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        
        // Check if we're at the first section
        if (currentIndex <= 0) {
          // If at first section, scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // Check if we need to scroll up within the current section first
          const currentSectionElement = document.getElementById(currentSection);
          if (currentSectionElement) {
            const currentScrollTop = window.pageYOffset;
            const sectionTop = currentSectionElement.offsetTop;
            
            // If we're not at the top of the current section, scroll up within it
            if (currentScrollTop > sectionTop + 100) {
              window.scrollBy({
                top: -(window.innerHeight * 0.7), // Scroll up by 70% of viewport height
                behavior: 'smooth'
              });
            } else {
              // Navigate to previous section
              const prevItem = modernNavigationItems[currentIndex - 1];
              handleSuggestionClick(prevItem.id);
            }
          } else {
            // Navigate to previous section
            const prevItem = modernNavigationItems[currentIndex - 1];
            handleSuggestionClick(prevItem.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentSection, handleSuggestionClick]);

  // Predictive hover behavior
  const handleSuggestionHover = useCallback((suggestionId: string | null) => {
    setHoveredSuggestion(suggestionId);
    
    // Preload section content or prepare for navigation
    if (suggestionId) {
      const element = document.getElementById(suggestionId);
      if (element) {
        // Subtle visual hint that section is ready for navigation
        element.style.transition = 'box-shadow 0.3s ease';
        element.style.boxShadow = `0 0 20px ${theme.palette.primary.main}20`;
        
        // Clear the hint after hover ends
        setTimeout(() => {
          if (hoveredSuggestion !== suggestionId) {
            element.style.boxShadow = 'none';
          }
        }, 300);
      }
    }
  }, [theme.palette.primary.main, hoveredSuggestion]);

  // Get position styles
  const getPositionStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      zIndex: 1000,
      pointerEvents: 'auto' as const,
    };

    // Calculate thumb-reach zone (bottom 20% of screen)
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const thumbReachZone = viewportHeight * 0.2; // Bottom 20% of screen
    const bottomPosition = Math.min(thumbReachZone, 120); // Cap at 120px for very tall screens

    switch (effectivePosition) {
      case 'bottom-right':
        return { 
          ...baseStyles, 
          bottom: isMobile ? `${bottomPosition}px` : '20px', 
          right: '20px' 
        };
      case 'bottom-left':
        return { 
          ...baseStyles, 
          bottom: isMobile ? `${bottomPosition}px` : '20px', 
          left: '20px' 
        };
      case 'top-right':
        return { ...baseStyles, top: '100px', right: '20px' };
      case 'top-left':
        return { ...baseStyles, top: '100px', left: '20px' };
      case 'overlay-top-left':
        return { 
          ...baseStyles, 
          top: isDesktop ? '100px' : '120px', // Adjust for desktop vs mobile nav height
          left: isDesktop ? '20px' : '40px',
          right: isDesktop ? 'auto' : 'auto',
          zIndex: 10 // Lower z-index to be below navigation but above content
        };
      case 'overlay-bottom-right':
        return { 
          ...baseStyles, 
          bottom: isMobile ? `${bottomPosition}px` : '30px', // Thumb-reach zone for mobile
          right: '20px',
          left: 'auto',
          zIndex: 10 // Lower z-index to be below navigation but above content
        };
      default:
        return { 
          ...baseStyles, 
          bottom: isMobile ? `${bottomPosition}px` : '20px', 
          right: '20px' 
        };
    }
  };

  const containerVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: effectivePosition.includes('bottom') || effectivePosition === 'overlay-bottom-right' ? 20 : effectivePosition === 'overlay-top-left' ? -10 : -20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: effectivePosition.includes('bottom') || effectivePosition === 'overlay-bottom-right' ? 20 : effectivePosition === 'overlay-top-left' ? -10 : -20,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: effectivePosition.includes('right') || effectivePosition === 'overlay-bottom-right' ? 20 : effectivePosition === 'overlay-top-left' ? -10 : -20 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={getPositionStyles()}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5, // Increased gap for better spacing
              maxWidth: '320px', // Slightly wider to accommodate inline layout
              alignItems: 'center', // Center align for mobile
            }}
          >
            {/* Inline Navigation Bar - Breadcrumb with navigation arrows */}
            {(shouldShowBreadcrumbs || shouldShowSuggestions) && currentItem && (
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    padding: '8px 12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: `1px solid ${theme.palette.primary.main}40`,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                    minWidth: '240px',
                    maxWidth: '300px',
                  }}
                >
                  {/* Previous Section Button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.85 }} // Scale down on press for tactile feedback
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Box
                      onClick={() => {
                        if (currentIndex > 0) {
                          const prevItem = modernNavigationItems[currentIndex - 1];
                          handleSuggestionClick(prevItem.id);
                        } else {
                          // If at first section, scroll to top
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      onTouchStart={() => {
                        if (currentIndex > 0) {
                          const prevItem = modernNavigationItems[currentIndex - 1];
                          handleSuggestionHover(prevItem.id);
                        }
                      }}
                      onTouchEnd={() => handleSuggestionHover(null)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: currentIndex > 0 && hoveredSuggestion === modernNavigationItems[currentIndex - 1]?.id
                          ? `${theme.palette.primary.main}30`
                          : 'rgba(255, 255, 255, 0.1)',
                        border: `1px solid ${
                          currentIndex > 0 && hoveredSuggestion === modernNavigationItems[currentIndex - 1]?.id
                            ? theme.palette.primary.main
                            : 'rgba(255, 255, 255, 0.2)'
                        }`,
                        color: hoveredSuggestion === modernNavigationItems[currentIndex - 1]?.id
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        // Subtle glow effect on hover/press
                        boxShadow: currentIndex > 0 && hoveredSuggestion === modernNavigationItems[currentIndex - 1]?.id
                          ? `0 0 12px ${theme.palette.primary.main}60, 0 0 24px ${theme.palette.primary.main}30`
                          : 'none',
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={
                        currentIndex > 0 
                          ? `Navigate to ${modernNavigationItems[currentIndex - 1].label} section` 
                          : 'Scroll to top'
                      }
                    >
                      <ArrowUp size={16} />
                    </Box>
                  </motion.div>

                  {/* Current Section Indicator */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      flex: 1,
                      textAlign: 'center',
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: '0.7rem',
                        opacity: 0.6,
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        fontWeight: 500,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Current
                    </Box>
                    <Box 
                      sx={{ 
                        width: '3px', 
                        height: '3px', 
                        borderRadius: '50%', 
                        backgroundColor: theme.palette.primary.main,
                        opacity: 0.8
                      }} 
                    />
                    <Box 
                      component="span" 
                      sx={{ 
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      {currentItem.label}
                    </Box>
                  </Box>

                  {/* Next Section Button */}
                  <motion.div
                    whileHover={{ scale: !isAtBottom ? 1.1 : 1 }}
                    whileTap={{ scale: !isAtBottom ? 0.85 : 1 }} // Scale down on press for tactile feedback
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Box
                      onClick={() => {
                        if (!isAtBottom && currentIndex < modernNavigationItems.length - 1) {
                          const nextItem = modernNavigationItems[currentIndex + 1];
                          handleSuggestionClick(nextItem.id);
                        }
                      }}
                      onTouchStart={() => {
                        if (!isAtBottom && currentIndex < modernNavigationItems.length - 1) {
                          const nextItem = modernNavigationItems[currentIndex + 1];
                          handleSuggestionHover(nextItem.id);
                        }
                      }}
                      onTouchEnd={() => handleSuggestionHover(null)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: !isAtBottom && currentIndex < modernNavigationItems.length - 1 && hoveredSuggestion === modernNavigationItems[currentIndex + 1]?.id
                          ? `${theme.palette.primary.main}30`
                          : 'rgba(255, 255, 255, 0.1)',
                        border: `1px solid ${
                          !isAtBottom && currentIndex < modernNavigationItems.length - 1 && hoveredSuggestion === modernNavigationItems[currentIndex + 1]?.id
                            ? theme.palette.primary.main
                            : 'rgba(255, 255, 255, 0.2)'
                        }`,
                        color: !isAtBottom && currentIndex < modernNavigationItems.length - 1
                          ? (hoveredSuggestion === modernNavigationItems[currentIndex + 1]?.id
                              ? theme.palette.primary.main
                              : theme.palette.text.secondary)
                          : 'rgba(255, 255, 255, 0.3)',
                        cursor: !isAtBottom && currentIndex < modernNavigationItems.length - 1 ? 'pointer' : 'not-allowed',
                        opacity: !isAtBottom && currentIndex < modernNavigationItems.length - 1 ? 1 : 0.4,
                        transition: 'all 0.2s ease',
                        // Subtle glow effect on hover/press
                        boxShadow: !isAtBottom && currentIndex < modernNavigationItems.length - 1 && hoveredSuggestion === modernNavigationItems[currentIndex + 1]?.id
                          ? `0 0 12px ${theme.palette.primary.main}60, 0 0 24px ${theme.palette.primary.main}30`
                          : 'none',
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={
                        !isAtBottom && currentIndex < modernNavigationItems.length - 1
                          ? `Navigate to ${modernNavigationItems[currentIndex + 1].label} section`
                          : isAtBottom 
                            ? 'At bottom of page' 
                            : 'No next section'
                      }
                      aria-disabled={isAtBottom || currentIndex >= modernNavigationItems.length - 1}
                    >
                      <ArrowDown size={16} />
                    </Box>
                  </motion.div>
                </Box>
              </motion.div>
            )}

            {/* Quick navigation hint */}
            {(shouldShowBreadcrumbs || shouldShowSuggestions) && (
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    fontSize: '0.65rem',
                    opacity: 0.5,
                    textAlign: 'center',
                    color: theme.palette.text.secondary,
                    fontStyle: 'italic',
                    marginTop: 0.5,
                    fontWeight: 400,
                  }}
                >
                  {isMobile ? 'Tap arrows to navigate' : 'Use arrow keys or click to navigate'}
                </Box>
              </motion.div>
            )}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContextualNavigation;