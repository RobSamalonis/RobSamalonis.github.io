import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  useScrollTrigger,
  Slide,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useState, useEffect, useRef, useCallback } from 'react';
import { modernNavigationItems } from '../../config/navigation';
import { 
  FocusManager, 
  KeyboardNavigation
} from '../../utils/accessibility';
import { useSmartScrolling } from '../../utils/smartScrolling';
import GlassmorphismBar from './GlassmorphismBar';
import AnimatedSidebar from './AnimatedSidebar';
import { OptimizedHoverInteraction, OptimizedClickAnimation } from '../common/OptimizedMicroInteractions';

interface NavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

interface HideOnScrollProps {
  children: React.ReactElement;
}

function HideOnScroll({ children }: HideOnScrollProps) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navigation: React.FC<NavigationProps> = ({ currentSection, onSectionChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const navigationRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const focusTrapCleanup = useRef<(() => void) | null>(null);
  const { scrollToSection } = useSmartScrolling();
  
  const isScrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  // Enhanced section navigation with smart scrolling
  const handleSectionClick = useCallback(async (sectionId: string) => {
    const item = modernNavigationItems.find(item => item.id === sectionId);
    
    // Use smart scrolling for enhanced navigation
    await scrollToSection(sectionId, {
      offset: 80,
      duration: 800,
      easing: 'easeInOut',
      onComplete: () => {
        // Announce navigation change to screen readers
        if (item) {
          const announcement = `Navigated to ${item.label} section. ${item.description || ''}`;
          // Create announcement element
          const announcer = document.createElement('div');
          announcer.setAttribute('aria-live', 'polite');
          announcer.style.position = 'absolute';
          announcer.style.left = '-10000px';
          document.body.appendChild(announcer);
          announcer.textContent = announcement;
          setTimeout(() => document.body.removeChild(announcer), 1000);
        }
      }
    });
    
    onSectionChange(sectionId);
    setMobileMenuOpen(false);
  }, [onSectionChange, scrollToSection]);

  // Enhanced keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent, sectionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSectionClick(sectionId);
    }
  }, [handleSectionClick]);

  // Desktop navigation keyboard handling
  const handleDesktopKeyDown = useCallback((event: React.KeyboardEvent) => {
    const navigationItems = navigationRef.current?.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
    if (!navigationItems) return;

    const items = Array.from(navigationItems);
    const currentIndex = focusedIndex >= 0 ? focusedIndex : 
      items.findIndex(item => item === document.activeElement);

    // Handle arrow key navigation
    KeyboardNavigation.handleArrowNavigation(
      event.nativeEvent,
      items,
      currentIndex,
      setFocusedIndex,
      'horizontal'
    );

    // Handle Home/End navigation
    KeyboardNavigation.handleHomeEndNavigation(
      event.nativeEvent,
      items,
      setFocusedIndex
    );
  }, [focusedIndex]);

  // Mobile menu focus management
  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      // Save current focus and trap focus in mobile menu
      FocusManager.saveFocus();
      focusTrapCleanup.current = FocusManager.trapFocus(mobileMenuRef.current);
      
      // Focus first item in mobile menu
      setTimeout(() => {
        if (mobileMenuRef.current) {
          FocusManager.focusFirst(mobileMenuRef.current);
        }
      }, 100);
    } else if (!mobileMenuOpen) {
      // Restore focus when mobile menu closes
      if (focusTrapCleanup.current) {
        focusTrapCleanup.current();
        focusTrapCleanup.current = null;
      }
      FocusManager.restoreFocus();
    }

    return () => {
      if (focusTrapCleanup.current) {
        focusTrapCleanup.current();
      }
    };
  }, [mobileMenuOpen]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Desktop Navigation - Top Header Style
  const DesktopNavigation = () => (
    <Box 
      component="nav" 
      ref={navigationRef}
      sx={{ 
        display: { xs: 'none', md: 'flex' }, 
        gap: 3,
        alignItems: 'center',
        position: 'relative',
      }}
      role="menubar"
      aria-label="Main navigation"
      onKeyDown={handleDesktopKeyDown}
    >
      {modernNavigationItems.map((item, index) => {
        const IconComponent = item.icon;
        const isActive = currentSection === item.id;
        
        return (
          <Box
            key={item.id}
            component="div"
            sx={{ position: 'relative' }}
          >
            <OptimizedHoverInteraction
              hoverScale={1.02}
              hoverRotation={1}
              glowColor={theme.palette.primary.main}
              enableParticles={false}
            >
              <OptimizedClickAnimation
                onClick={() => handleSectionClick(item.id)}
                rippleColor={theme.palette.primary.main}
                springIntensity="moderate"
              >
                <Button
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  onFocus={() => setFocusedIndex(index)}
                  role="menuitem"
                  tabIndex={focusedIndex === index || (focusedIndex === -1 && index === 0) ? 0 : -1}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Navigate to ${item.label} section${item.description ? `. ${item.description}` : ''}`}
                  aria-describedby={item.description ? `nav-desc-${item.id}` : undefined}
                  startIcon={<IconComponent size={20} aria-hidden="true" />}
                  sx={{
                    color: isActive ? 'primary.main' : 'text.primary',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: '12px',
                    padding: '10px 20px',
                    minWidth: '120px',
                    height: '44px',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    
                    // Glassmorphism background
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(0, 255, 255, 0.15) 0%, rgba(0, 255, 255, 0.08) 100%)'
                      : 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                    
                    '&:hover': {
                      backgroundColor: 'rgba(0, 255, 255, 0.12)',
                      color: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${theme.palette.primary.main}20`,
                    },
                    
                    '&:focus-visible': {
                      outline: `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: '2px',
                      backgroundColor: 'rgba(0, 255, 255, 0.12)',
                    },
                    
                    // Active state indicator - bottom border
                    ...(isActive && {
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '70%',
                        height: '2px',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        borderRadius: '2px 2px 0 0',
                      },
                    }),
                  }}
                >
                  {item.label}
                  {/* Hidden description for screen readers */}
                  {item.description && (
                    <Box
                      id={`nav-desc-${item.id}`}
                      sx={{
                        position: 'absolute',
                        left: '-10000px',
                        width: '1px',
                        height: '1px',
                        overflow: 'hidden',
                      }}
                      aria-hidden="true"
                    >
                      {item.description}
                    </Box>
                  )}
                </Button>
              </OptimizedClickAnimation>
            </OptimizedHoverInteraction>
          </Box>
        );
      })}
    </Box>
  );

  // Mobile Navigation
  const MobileNavigation = () => (
    <AnimatedSidebar
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      currentSection={currentSection}
      onSectionChange={handleSectionClick}
      mobileMenuRef={mobileMenuRef}
    />
  );

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{
            backgroundColor: 'transparent',
            backdropFilter: 'none',
            boxShadow: 'none',
          }}
        >
          <Box
            sx={{
              maxWidth: 'lg',
              mx: 'auto',
              px: { xs: 2, sm: 3 },
              py: 2,
            }}
          >
            {/* Use GlassmorphismBar for the main navigation */}
            <GlassmorphismBar isScrolled={isScrolled}>
              <Toolbar
                sx={{
                  minHeight: { xs: '64px', sm: '80px' },
                  padding: { xs: 2, sm: 3 },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                {/* Desktop Navigation - Centered */}
                {!isMobile && <DesktopNavigation />}
                
                {/* Mobile Menu Button */}
                {isMobile && (
                  <Box sx={{ ml: 'auto' }}>
                    <OptimizedHoverInteraction
                      hoverScale={1.1}
                      glowColor={theme.palette.primary.main}
                      enableParticles={false}
                    >
                      <OptimizedClickAnimation
                        onClick={() => setMobileMenuOpen(true)}
                        rippleColor={theme.palette.primary.main}
                        springIntensity="enhanced"
                      >
                        <IconButton
                          aria-label="Open navigation menu"
                          aria-expanded={mobileMenuOpen}
                          aria-haspopup="true"
                          aria-controls={mobileMenuOpen ? 'mobile-navigation' : undefined}
                          sx={{
                            minWidth: '44px',
                            minHeight: '44px',
                            borderRadius: '12px',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 255, 255, 0.08)',
                            },
                            '&:focus-visible': {
                              outline: `3px solid ${theme.palette.primary.main}`,
                              outlineOffset: '2px',
                            },
                          }}
                        >
                          <MenuIcon aria-hidden="true" />
                        </IconButton>
                      </OptimizedClickAnimation>
                    </OptimizedHoverInteraction>
                  </Box>
                )}
              </Toolbar>
            </GlassmorphismBar>
          </Box>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Navigation */}
      {isMobile && <MobileNavigation />}
    </>
  );
};

export default Navigation;