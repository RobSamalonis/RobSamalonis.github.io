import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { modernNavigationItems } from '../../config/navigation';

interface DesktopSectionIndicatorProps {
  currentSection: string;
  /** Show section description */
  showDescription?: boolean;
  /** Position on screen */
  position?: 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  /** Custom styling */
  sx?: object;
}

const DesktopSectionIndicator: React.FC<DesktopSectionIndicatorProps> = ({
  currentSection,
  showDescription = true,
  position = 'bottom-right',
  sx = {}
}) => {
  const theme = useTheme();
  const currentItem = modernNavigationItems.find(item => item.id === currentSection);

  if (!currentItem) return null;

  const getPositionStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      zIndex: 1000,
      pointerEvents: 'none' as const,
    };

    switch (position) {
      case 'top-right':
        return {
          ...baseStyles,
          top: '100px',
          right: '24px',
        };
      case 'bottom-left':
        return {
          ...baseStyles,
          bottom: '24px',
          left: '24px',
        };
      case 'bottom-right':
        return {
          ...baseStyles,
          bottom: '24px',
          right: '24px',
        };
      case 'center':
        return {
          ...baseStyles,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
      default:
        return baseStyles;
    }
  };

  const IconComponent = currentItem.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }}
        style={getPositionStyles()}
      >
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: position.includes('right') ? 'flex-end' : 'flex-start',
            gap: 1,
            padding: '16px 20px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: `1px solid ${theme.palette.primary.main}40`,
            boxShadow: `0 8px 32px ${theme.palette.primary.main}20`,
            maxWidth: '280px',
            ...sx
          }}
        >
          {/* Section indicator with icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: `${theme.palette.primary.main}20`,
                border: `1px solid ${theme.palette.primary.main}40`,
              }}
            >
              <IconComponent 
                size={18} 
                color={theme.palette.primary.main}
                aria-hidden="true"
              />
            </Box>
            
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: theme.palette.primary.main,
                letterSpacing: '0.02em',
              }}
            >
              {currentItem.label}
            </Typography>
          </Box>

          {/* Section description */}
          {showDescription && currentItem.description && (
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.875rem',
                color: theme.palette.text.secondary,
                opacity: 0.8,
                lineHeight: 1.4,
                textAlign: position.includes('right') ? 'right' : 'left',
              }}
            >
              {currentItem.description}
            </Typography>
          )}

          {/* Progress indicator */}
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
            {modernNavigationItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  width: '24px',
                  height: '3px',
                  borderRadius: '2px',
                  backgroundColor: item.id === currentSection 
                    ? theme.palette.primary.main
                    : 'rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default DesktopSectionIndicator;