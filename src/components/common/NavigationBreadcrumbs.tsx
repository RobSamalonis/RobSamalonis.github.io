import React from 'react';
import { Box, Typography, useTheme, useMediaQuery, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { modernNavigationItems } from '../../config/navigation';

interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  isActive?: boolean;
}

interface NavigationBreadcrumbsProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  /** Additional breadcrumb items for subsections */
  additionalItems?: BreadcrumbItem[];
  /** Show home icon */
  showHomeIcon?: boolean;
  /** Custom styling */
  sx?: object;
}

const NavigationBreadcrumbs: React.FC<NavigationBreadcrumbsProps> = ({
  currentSection,
  additionalItems = [],
  showHomeIcon = true,
  sx = {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // For desktop, show a subtle section indicator instead of breadcrumbs
  // For mobile, show simplified breadcrumbs only when needed
  
  const currentItem = modernNavigationItems.find(item => item.id === currentSection);
  
  // Don't show anything on desktop - the main navigation is sufficient
  if (!isMobile) {
    return null;
  }

  // For mobile, only show if we have additional items (subsections)
  // or if explicitly requested for complex mobile navigation
  if (additionalItems.length === 0 && !showHomeIcon) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box
        sx={{
          padding: '8px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          ...sx
        }}
      >
        {/* Simple mobile section indicator */}
        {currentItem && (
          <Chip
            label={currentItem.label}
            size="small"
            sx={{
              backgroundColor: 'rgba(0, 255, 255, 0.15)',
              color: theme.palette.primary.main,
              fontWeight: 600,
              fontSize: '0.75rem',
              height: '24px',
              '& .MuiChip-label': {
                px: 1.5
              }
            }}
          />
        )}
        
        {/* Show additional items if any */}
        {additionalItems.map((item) => (
          <React.Fragment key={item.id}>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: theme.palette.text.secondary,
                mx: 0.5
              }}
            >
              /
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: item.isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                fontWeight: item.isActive ? 600 : 400
              }}
            >
              {item.label}
            </Typography>
          </React.Fragment>
        ))}
      </Box>
    </motion.div>
  );
};

export default NavigationBreadcrumbs;