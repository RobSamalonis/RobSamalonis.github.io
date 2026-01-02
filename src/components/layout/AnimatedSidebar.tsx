import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  Portal,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { modernNavigationItems } from '../../config/navigation';
import { OptimizedClickAnimation } from '../common/OptimizedMicroInteractions';

interface AnimatedSidebarProps {
  open: boolean;
  onClose: () => void;
  currentSection: string;
  onSectionChange: (section: string) => void;
  mobileMenuRef: React.RefObject<HTMLDivElement>;
}

const AnimatedSidebar: React.FC<AnimatedSidebarProps> = ({
  open,
  onClose,
  currentSection,
  onSectionChange,
  mobileMenuRef,
}) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle opening and closing animation states
  useEffect(() => {
    if (open) {
      // Opening sequence
      setShouldRender(true);
      setIsVisible(true);
      // Small delay to ensure the element is rendered before animating
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else if (isVisible) {
      // Closing sequence - only if currently visible
      setIsAnimating(false);
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => {
        setIsVisible(false);
        setShouldRender(false);
      }, 450); // Match the CSS transition duration + buffer
      return () => clearTimeout(timer);
    }
  }, [open, isVisible]);

  // Don't render anything if not needed
  if (!shouldRender) return null;

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent, sectionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSectionClick(sectionId);
    }
  };

  return (
    <Portal>
      {/* Backdrop */}
      <Box
        onClick={onClose}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: theme.zIndex.drawer,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          opacity: isAnimating ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: isAnimating ? 'auto' : 'none',
        }}
      />
      
      {/* Sidebar */}
      <Box
        ref={mobileMenuRef}
        role="dialog"
        aria-labelledby="mobile-nav-title"
        aria-describedby="mobile-nav-description"
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: { xs: '100%', sm: 320 },
          maxWidth: '320px',
          zIndex: theme.zIndex.drawer + 1,
          transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
          display: 'flex',
          flexDirection: 'column',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.98) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderLeft: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          overflow: 'hidden',
          
          // Add subtle inner glow
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '1px',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.2), transparent)'
              : 'linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.1), transparent)',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          px: 3, 
          py: 3,
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
          background: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.02)' 
            : 'rgba(0, 0, 0, 0.02)',
        }}>
          <Box 
            component="h2" 
            id="mobile-nav-title"
            sx={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}
          >
            Navigation
          </Box>
          <OptimizedClickAnimation
            onClick={onClose}
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
        
        {/* Navigation List */}
        <List 
          sx={{ 
            px: 0,
            py: 1,
            flex: 1,
            width: '100%',
            '& .MuiListItem-root': {
              width: '100%',
              px: 0,
            }
          }}
          role="menu"
          aria-labelledby="mobile-nav-title"
        >
          {modernNavigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0, width: '100%', px: 0 }}>
                <ListItemButton
                  onClick={() => handleSectionClick(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  selected={isActive}
                  role="menuitem"
                  tabIndex={0}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Navigate to ${item.label} section${item.description ? `. ${item.description}` : ''}`}
                  sx={{
                    minHeight: '72px',
                    borderRadius: 0,
                    gap: 2,
                    width: '100%',
                    px: 3,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    margin: 0,
                    position: 'relative',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    
                    // Clean background styling
                    backgroundColor: isActive 
                      ? 'rgba(0, 255, 255, 0.12)' 
                      : 'transparent',
                    
                    // Subtle separator between items
                    '&:not(:last-child)::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '24px',
                      right: '24px',
                      height: '1px',
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.06)' 
                        : 'rgba(0, 0, 0, 0.06)',
                    },
                    
                    // Active state indicator
                    ...(isActive && {
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '4px',
                        height: '32px',
                        background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        borderRadius: '0 2px 2px 0',
                      },
                    }),
                    
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(0, 255, 255, 0.12)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 255, 0.16)',
                      },
                    },
                    
                    '&:hover': {
                      backgroundColor: isActive 
                        ? 'rgba(0, 255, 255, 0.16)' 
                        : 'rgba(0, 255, 255, 0.08)',
                      transform: 'translateX(4px)',
                    },
                    
                    '&:focus-visible': {
                      outline: `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: '-2px',
                      zIndex: 1,
                      backgroundColor: 'rgba(0, 255, 255, 0.08)',
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
      </Box>
    </Portal>
  );
};

export default AnimatedSidebar;