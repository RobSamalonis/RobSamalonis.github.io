import React, { useState, useEffect, useCallback } from 'react';
import { Box, Chip, Tooltip, useTheme, Fade, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
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
  
  // Detect if we're on desktop (md and up) for responsive breadcrumb positioning
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  // Determine effective position based on responsive setting
  const effectivePosition = position === 'responsive-breadcrumbs' 
    ? (isDesktop ? 'overlay-top-left' : 'overlay-bottom-right')
    : position;

  // Show contextual navigation after user starts scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset > (effectivePosition === 'overlay-top-left' || effectivePosition === 'overlay-bottom-right' ? 50 : 200);
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [effectivePosition]);

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

  // Handle suggestion click with state persistence
  const handleSuggestionClick = useCallback(async (suggestionId: string) => {
    await scrollToSection(suggestionId, {
      offset: 80,
      duration: 600,
      easing: 'easeInOut',
      onComplete: () => {
        // Navigation completed
      }
    });
    
    // Update navigation state for persistence
    navigationState.updateCurrentSection(suggestionId);
    onSectionChange(suggestionId);
  }, [scrollToSection, onSectionChange, navigationState]);

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

    switch (effectivePosition) {
      case 'bottom-right':
        return { ...baseStyles, bottom: '20px', right: '20px' };
      case 'bottom-left':
        return { ...baseStyles, bottom: '20px', left: '20px' };
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
          bottom: '40px', // Above the bottom of viewport
          right: '40px',
          zIndex: 10 // Lower z-index to be below navigation but above content
        };
      default:
        return { ...baseStyles, bottom: '20px', right: '20px' };
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
              gap: 1,
              maxWidth: '280px',
            }}
          >
            {/* Breadcrumb-style current section indicator */}
            {showBreadcrumbs && currentItem && (
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    padding: isDesktop && effectivePosition === 'overlay-top-left' ? '8px 20px' : '6px 16px',
                    backgroundColor: effectivePosition === 'overlay-top-left' || effectivePosition === 'overlay-bottom-right'
                      ? 'rgba(0, 0, 0, 0.7)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(15px)',
                    borderRadius: isDesktop && effectivePosition === 'overlay-top-left' ? '12px' : '20px',
                    border: `1px solid ${theme.palette.primary.main}30`,
                    fontSize: isDesktop && effectivePosition === 'overlay-top-left' ? '0.9rem' : '0.8rem',
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    boxShadow: effectivePosition === 'overlay-top-left' || effectivePosition === 'overlay-bottom-right'
                      ? `0 4px 20px rgba(0, 0, 0, 0.3)` 
                      : 'none',
                    minWidth: isDesktop && effectivePosition === 'overlay-top-left' ? '200px' : 'auto',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontSize: isDesktop && effectivePosition === 'overlay-top-left' ? '0.75rem' : '0.7rem',
                      opacity: 0.7,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {isDesktop && effectivePosition === 'overlay-top-left' ? 'Section' : 'Current'}
                  </Box>
                  <ChevronRight size={isDesktop && effectivePosition === 'overlay-top-left' ? 12 : 10} />
                  <Box component="span" sx={{ color: theme.palette.primary.main }}>
                    {currentItem.label}
                  </Box>
                </Box>
              </motion.div>
            )}

            {/* Navigation suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {suggestions.map((suggestion) => (
                    <Tooltip
                      key={suggestion.id}
                      title={suggestion.description || `Navigate to ${suggestion.label}`}
                      placement={effectivePosition.includes('right') ? 'left' : 'right'}
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 200 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, x: effectivePosition.includes('right') ? -2 : 2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      >
                        <Chip
                          icon={suggestion.icon as React.ReactElement}
                          label={suggestion.label}
                          onClick={() => handleSuggestionClick(suggestion.id)}
                          onMouseEnter={() => handleSuggestionHover(suggestion.id)}
                          onMouseLeave={() => handleSuggestionHover(null)}
                          sx={{
                            backgroundColor: hoveredSuggestion === suggestion.id
                              ? `${theme.palette.primary.main}20`
                              : 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${
                              hoveredSuggestion === suggestion.id
                                ? theme.palette.primary.main
                                : 'rgba(255, 255, 255, 0.2)'
                            }`,
                            color: hoveredSuggestion === suggestion.id
                              ? theme.palette.primary.main
                              : theme.palette.text.primary,
                            fontSize: '0.8rem',
                            height: '32px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            
                            '&:hover': {
                              backgroundColor: `${theme.palette.primary.main}20`,
                              borderColor: theme.palette.primary.main,
                              color: theme.palette.primary.main,
                              boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                            },

                            '& .MuiChip-icon': {
                              color: 'inherit',
                              fontSize: '16px',
                            },

                            '& .MuiChip-label': {
                              fontWeight: 500,
                              paddingLeft: '4px',
                            }
                          }}
                        />
                      </motion.div>
                    </Tooltip>
                  ))}
                </Box>
              </motion.div>
            )}

            {/* Quick navigation hint */}
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  fontSize: '0.7rem',
                  opacity: 0.6,
                  textAlign: 'center',
                  color: theme.palette.text.secondary,
                  fontStyle: 'italic',
                  marginTop: 0.5,
                }}
              >
                Hover to preview • Click to navigate
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContextualNavigation;