import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  useScrollTrigger,
  Slide,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { useState, useEffect, useRef, useCallback } from 'react';
import { modernNavigationItems } from '../../config/navigation';
import { 
  FocusManager, 
  KeyboardNavigation
} from '../../utils/accessibility';
import { useSmartScrolling } from '../../utils/smartScrolling';
import GlassmorphismBar from './GlassmorphismBar';
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

    document.addEventListener('keydown', handleEscape);
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
                    borderRadius: '16px',
                    padding: '12px 24px',
                    minWidth: '120px',
                    height: '48px',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    
                    // Glassmorphism background
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(0, 255, 255, 0.15) 0%, rgba(0, 255, 255, 0.08) 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isActive ? theme.palette.primary.main + '40' : 'rgba(255, 255, 255, 0.1)'}`,
                    
                    '&:hover': {
                      backgroundColor: 'rgba(0, 255, 255, 0.12)',
                      borderColor: theme.palette.primary.main + '60',
                      color: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${theme.palette.primary.main}20`,
                    },
                    
                    '&:focus-visible': {
                      outline: `3px solid ${theme.palette.primary.main}`,
                      outlineOffset: '2px',
                      backgroundColor: 'rgba(0, 255, 255, 0.12)',
                    },
                    
                    // Active state indicator - top border
                    ...(isActive && {
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80%',
                        height: '3px',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        borderRadius: '0 0 2px 2px',
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
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      PaperProps={{
        ref: mobileMenuRef,
        sx: {
          width: { xs: '100%', sm: 320 },
          maxWidth: '320px',
        },
      }}
      ModalProps={{
        'aria-labelledby': 'mobile-nav-title',
        'aria-describedby': 'mobile-nav-description',
      }}
    >
      {/* Use GlassmorphismBar for mobile menu background */}
      <GlassmorphismBar isScrolled={true}>
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box 
              component="h2" 
              id="mobile-nav-title"
              sx={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}
            >
              Navigation
            </Box>
            <OptimizedClickAnimation
              onClick={() => setMobileMenuOpen(false)}
              rippleColor={theme.palette.primary.main}
            >
              <IconButton 
                aria-label="Close navigation menu"
                sx={{
                  minWidth: '44px',
                  minHeight: '44px',
                  borderRadius: '12px',
                  '&:focus-visible': {
                    outline: `3px solid ${theme.palette.primary.main}`,
                    outlineOffset: '2px',
                  },
                }}
              >
                <CloseIcon aria-hidden="true" />
              </IconButton>
            </OptimizedClickAnimation>
          </Box>
          
          {/* Hidden description for screen readers */}
          <Box
            id="mobile-nav-description"
            sx={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
            aria-hidden="true"
          >
            Use arrow keys to navigate between menu items, Enter or Space to select, Escape to close
          </Box>
          
          <List 
            sx={{ px: 2, flex: 1 }}
            role="menu"
            aria-labelledby="mobile-nav-title"
          >
            {modernNavigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentSection === item.id;
              
              return (
                <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                  <OptimizedHoverInteraction
                    hoverScale={1.02}
                    glowColor={theme.palette.primary.main}
                    enableParticles={false}
                  >
                    <OptimizedClickAnimation
                      onClick={() => handleSectionClick(item.id)}
                      rippleColor={theme.palette.primary.main}
                      springIntensity="enhanced"
                    >
                      <ListItemButton
                        onKeyDown={(e) => handleKeyDown(e, item.id)}
                        selected={isActive}
                        role="menuitem"
                        tabIndex={0}
                        aria-current={isActive ? 'page' : undefined}
                        aria-label={`Navigate to ${item.label} section${item.description ? `. ${item.description}` : ''}`}
                        sx={{
                          minHeight: '56px',
                          borderRadius: '12px',
                          gap: 2,
                          width: '100%',
                          
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(0, 255, 255, 0.12)',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 255, 255, 0.16)',
                            },
                          },
                          
                          '&:hover': {
                            backgroundColor: 'rgba(0, 255, 255, 0.08)',
                          },
                          
                          '&:focus-visible': {
                            outline: `3px solid ${theme.palette.primary.main}`,
                            outlineOffset: '-2px',
                          },
                        }}
                      >
                        <IconComponent 
                          size={20} 
                          color={isActive ? theme.palette.primary.main : theme.palette.text.primary}
                          aria-hidden="true"
                        />
                        <ListItemText 
                          primary={item.label}
                          secondary={item.description}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontSize: '1.1rem',
                              fontWeight: isActive ? 600 : 500,
                              color: isActive ? 'primary.main' : 'text.primary',
                            },
                            '& .MuiListItemText-secondary': {
                              fontSize: '0.85rem',
                              opacity: 0.7,
                            },
                          }}
                        />
                      </ListItemButton>
                    </OptimizedClickAnimation>
                  </OptimizedHoverInteraction>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </GlassmorphismBar>
    </Drawer>
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
          {/* Use GlassmorphismBar for the main navigation */}
          <GlassmorphismBar isScrolled={isScrolled}>
            <Box
              sx={{
                maxWidth: 'lg',
                mx: 'auto',
                px: { xs: 2, sm: 3 },
              }}
            >
              <Toolbar
                sx={{
                  minHeight: { xs: '64px', sm: '80px' }, // Increased height for desktop
                  padding: 0,
                  display: 'flex',
                  justifyContent: 'space-between', // Back to space-between for left alignment
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
            </Box>
          </GlassmorphismBar>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Navigation */}
      {isMobile && <MobileNavigation />}
    </>
  );
};

export default Navigation;