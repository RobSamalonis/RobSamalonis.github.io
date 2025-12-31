import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
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
import { useState } from 'react';

// Legacy interfaces for backward compatibility
interface LegacyNavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

interface LegacyNavigationItem {
  id: string;
  label: string;
  href: string;
}

// Legacy navigation items for backward compatibility
const legacyNavigationItems: LegacyNavigationItem[] = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'resume', label: 'Resume', href: '#resume' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

// Hide on scroll component for better UX
interface HideOnScrollProps {
  children: React.ReactElement;
}

function HideOnScroll({ children }: HideOnScrollProps) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navigation: React.FC<LegacyNavigationProps> = ({ currentSection, onSectionChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      onSectionChange(sectionId);
    }
    setMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, sectionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSectionClick(sectionId);
    }
  };

  // Desktop Navigation
  const DesktopNavigation = () => (
    <Box 
      component="nav" 
      sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}
      role="navigation"
      aria-label="Main navigation"
    >
      {legacyNavigationItems.map((item) => (
        <Button
          key={item.id}
          onClick={() => handleSectionClick(item.id)}
          onKeyDown={(e) => handleKeyDown(e, item.id)}
          aria-current={currentSection === item.id ? 'page' : undefined}
          aria-label={`Navigate to ${item.label} section`}
          sx={{
            color: currentSection === item.id ? 'primary.main' : 'text.primary',
            fontWeight: currentSection === item.id ? 600 : 400,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: currentSection === item.id ? '100%' : '0%',
              height: '2px',
              backgroundColor: 'primary.main',
              transition: 'width 0.3s ease-in-out',
            },
            '&:hover::after': {
              width: '100%',
            },
            '&:focus': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: '2px',
            },
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );

  // Mobile Navigation Drawer
  const MobileNavigation = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-title"
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 300 }, // Full width on very small screens
          maxWidth: '300px',
          backgroundColor: 'background.paper',
          borderLeft: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography 
          id="mobile-menu-title"
          variant="h6" 
          color="text.primary"
          component="h2"
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          Navigation Menu
        </Typography>
        <IconButton 
          onClick={() => setMobileMenuOpen(false)} 
          color="inherit"
          aria-label="Close navigation menu"
          sx={{
            minWidth: { xs: '44px', sm: '48px' }, // Touch-friendly minimum size
            minHeight: { xs: '44px', sm: '48px' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box component="nav" role="navigation" aria-label="Mobile navigation">
        <List sx={{ px: { xs: 1, sm: 2 } }}>
          {legacyNavigationItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleSectionClick(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                selected={currentSection === item.id}
                aria-current={currentSection === item.id ? 'page' : undefined}
                aria-label={`Navigate to ${item.label} section`}
                sx={{
                  minHeight: { xs: '48px', sm: '56px' }, // Touch-friendly minimum size
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(0, 255, 255, 0.1)',
                    borderRight: `3px solid ${theme.palette.primary.main}`,
                  },
                  '&:focus': {
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: '-2px',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemText 
                  primary={item.label}
                  sx={{
                    color: currentSection === item.id ? 'primary.main' : 'text.primary',
                    '& .MuiListItemText-primary': {
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: currentSection === item.id ? 600 : 400,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          elevation={0}
          component="header"
          role="banner"
        >
          <Toolbar>
            <Typography
              variant="h6"
              component="h1"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Robert Samalonis
            </Typography>

            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-menu"
                edge="end"
                onClick={handleMobileMenuToggle}
                sx={{
                  '&:focus': {
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: '2px',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <DesktopNavigation />
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {isMobile && <MobileNavigation />}
    </>
  );
};

export default Navigation;