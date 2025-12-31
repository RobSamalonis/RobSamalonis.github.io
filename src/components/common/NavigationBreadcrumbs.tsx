import React from 'react';
import { Box, Breadcrumbs, Link, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
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
  onSectionChange,
  additionalItems = [],
  showHomeIcon = true,
  sx = {}
}) => {
  const theme = useTheme();

  // Build breadcrumb trail
  const buildBreadcrumbTrail = (): BreadcrumbItem[] => {
    const trail: BreadcrumbItem[] = [];

    // Add home if requested
    if (showHomeIcon) {
      trail.push({
        id: 'hero',
        label: 'Home',
        href: '#hero',
        isActive: currentSection === 'hero'
      });
    }

    // Add current section if not home
    if (currentSection !== 'hero') {
      const currentItem = modernNavigationItems.find(item => item.id === currentSection);
      if (currentItem) {
        trail.push({
          id: currentItem.id,
          label: currentItem.label,
          href: `#${currentItem.id}`,
          isActive: true
        });
      }
    }

    // Add additional items (for subsections)
    trail.push(...additionalItems);

    return trail;
  };

  const breadcrumbTrail = buildBreadcrumbTrail();

  const handleBreadcrumbClick = (event: React.MouseEvent, sectionId: string) => {
    event.preventDefault();
    onSectionChange(sectionId);
  };

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

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 }
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
          padding: '12px 0',
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(10px)',
          ...sx
        }}
      >
        <Breadcrumbs
          separator={<ChevronRight size={14} color={theme.palette.text.secondary} />}
          aria-label="Navigation breadcrumbs"
          sx={{
            '& .MuiBreadcrumbs-ol': {
              alignItems: 'center',
            }
          }}
        >
          {breadcrumbTrail.map((item, index) => {
            const isLast = index === breadcrumbTrail.length - 1;
            const isHome = item.id === 'hero' && showHomeIcon;

            return (
              <motion.div key={item.id} variants={itemVariants}>
                {isLast ? (
                  // Active/current item (not clickable)
                  <Typography
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    }}
                  >
                    {isHome && <Home size={16} />}
                    {item.label}
                  </Typography>
                ) : (
                  // Clickable breadcrumb item
                  <Link
                    component="button"
                    onClick={(e) => handleBreadcrumbClick(e, item.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: theme.palette.text.secondary,
                      textDecoration: 'none',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease',
                      
                      '&:hover': {
                        color: theme.palette.primary.main,
                        backgroundColor: 'rgba(0, 255, 255, 0.08)',
                        textDecoration: 'none',
                      },
                      
                      '&:focus-visible': {
                        outline: `2px solid ${theme.palette.primary.main}`,
                        outlineOffset: '2px',
                      }
                    }}
                    aria-label={`Navigate to ${item.label}`}
                  >
                    {isHome && <Home size={16} />}
                    {item.label}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </Breadcrumbs>
      </Box>
    </motion.div>
  );
};

export default NavigationBreadcrumbs;