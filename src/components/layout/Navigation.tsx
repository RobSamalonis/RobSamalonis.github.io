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
  KeyboardNavigation, 
  ariaLiveRegionManager,
  UserPreferences 
} from '../../utils/accessibility';

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
  
  const isScrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  // Enhanced section navigation with accessibility announcements
  const handleSectionClick = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const item = modernNavigationItems.find(item => item.id === sectionId);
      
      element.scrollIntoView({ 
        behavior: UserPreferences.prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start'
      });
      
      onSectionChange(sectionId);
      
      // Announce navigation change to screen readers
      if (item) {
        ariaLiveRegionManager.announceNavigation(item.label, item.description);
      }
    }
    setMobileMenuOpen(false);
  }, [onSectionChange]);

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

  // Desktop Navigation
  const DesktopNavigation = () => (
    <Box 
      component="nav" 
      ref={navigationRef}
      sx={{ 
        display: { xs: 'none', md: 'flex' }, 
        gap: 2,
        alignItems: 'center',
      }}
      role="menubar"
      aria-label="Main navigation"
      onKeyDown={handleDesktopKeyDown}
    >
      {modernNavigationItems.map((item, index) => {
        const IconComponent = item.icon;
        const isActive = currentSection === item.id;
        
        return (
          <Button
            key={item.id}
            onClick={() => handleSectionClick(item.id)}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            onFocus={() => setFocusedIndex(index)}
            role="menuitem"
            tabIndex={focusedIndex === index || (focusedIndex === -1 && index === 0) ? 0 : -1}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Navigate to ${item.label} section${item.description ? `. ${item.description}` : ''}`}
            aria-describedby={item.description ? `nav-desc-${item.id}` : undefined}
            startIcon={<IconComponent size={18} aria-hidden="true" />}
            sx={{
              color: isActive ? 'primary.main' : 'text.primary',
              fontWeight: isActive ? 600 : 500,
              fontSize: '0.95rem',
              textTransform: 'none',
              borderRadius: '12px',
              padding: '10px 20px',
              minWidth: 'auto',
              transition: 'all 0.2s ease',
              
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 255, 0.08)',
                color: 'primary.main',
                transform: 'translateY(-1px)',
              },
              
              '&:focus-visible': {
                outline: `3px solid ${theme.palette.primary.main}`,
                outlineOffset: '2px',
                backgroundColor: 'rgba(0, 255, 255, 0.08)',
              },
              
              // Active state indicator
              ...(isActive && {
                backgroundColor: 'rgba(0, 255, 255, 0.12)',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '2px',
                  background: theme.palette.primary.main,
                  borderRadius: '1px',
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
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(0, 0, 0, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
        },
      }}
      ModalProps={{
        'aria-labelledby': 'mobile-nav-title',
        'aria-describedby': 'mobile-nav-description',
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box 
          component="h2" 
          id="mobile-nav-title"
          sx={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}
        >
          Navigation
        </Box>
        <IconButton 
          onClick={() => setMobileMenuOpen(false)} 
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
        sx={{ px: 2 }}
        role="menu"
        aria-labelledby="mobile-nav-title"
      >
        {modernNavigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentSection === item.id;
          
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleSectionClick(item.id)}
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
            </ListItem>
          );
        })}
      </List>
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
          <Box
            sx={{
              background: isScrolled 
                ? theme.palette.mode === 'dark'
                  ? 'rgba(0, 0, 0, 0.8)'
                  : 'rgba(255, 255, 255, 0.8)'
                : 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderBottom: isScrolled ? `1px solid ${theme.palette.divider}` : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <Box
              sx={{
                maxWidth: 'lg',
                mx: 'auto',
                px: { xs: 2, sm: 3 },
              }}
            >
              <Toolbar
                sx={{
                  minHeight: { xs: '64px', sm: '70px' },
                  padding: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {/* Desktop Navigation */}
                {!isMobile && <DesktopNavigation />}
                
                {/* Mobile Menu Button */}
                {isMobile && (
                  <Box sx={{ ml: 'auto' }}>
                    <IconButton
                      onClick={() => setMobileMenuOpen(true)}
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
                  </Box>
                )}
              </Toolbar>
            </Box>
          </Box>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Navigation */}
      {isMobile && <MobileNavigation />}
    </>
  );
};

export default Navigation;