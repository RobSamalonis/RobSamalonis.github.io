import React, { useState, useCallback } from 'react';
import { Box, Tooltip, useTheme, useMediaQuery, useScrollTrigger, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { modernNavigationItems } from '../../config/navigation';
import { colorPalette } from '../../styles/theme';

interface SideDockNavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const SideDockNavigation: React.FC<SideDockNavigationProps> = ({
  currentSection,
  onSectionChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Auto-hide on mobile when scrolling down
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = useCallback(
    (sectionId: string) => {
      onSectionChange(sectionId);
    },
    [onSectionChange]
  );

  return (
    <AnimatePresence>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar,
          pointerEvents: 'none',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: isMobile && trigger ? 0 : 1,
              y: isMobile && trigger ? -20 : 0,
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              paddingTop: isMobile ? '12px' : '32px',
              paddingLeft: isMobile ? '12px' : '48px',
              pointerEvents: isMobile && trigger ? 'none' : 'auto',
            }}
          >
            <Box
              component="nav"
              role="navigation"
              aria-label="Side dock navigation"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                padding: 1.25,
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4)`,
                width: 'fit-content',
              }}
            >
              {modernNavigationItems.map((item, index) => {
                const isActive = currentSection === item.id;
                const isHovered = hoveredIndex === index;
                const IconComponent = item.icon;

                return (
                  <Tooltip
                    key={item.id}
                    title={item.label}
                    placement="right"
                    arrow
                    slotProps={{
                      tooltip: {
                        sx: {
                          bgcolor: 'rgba(0, 0, 0, 0.9)',
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${colorPalette.accent.electricBlue}40`,
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          boxShadow: `0 4px 20px ${colorPalette.accent.electricBlue}30`,
                        },
                      },
                      arrow: {
                        sx: {
                          color: 'rgba(0, 0, 0, 0.9)',
                          '&::before': {
                            border: `1px solid ${colorPalette.accent.electricBlue}40`,
                          },
                        },
                      },
                    }}
                  >
                    <motion.button
                      onClick={() => handleClick(item.id)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Navigate to ${item.label} section`}
                      aria-current={isActive ? 'page' : undefined}
                      style={{
                        position: 'relative',
                        width: '44px',
                        height: '44px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Glow effect background */}
                      <motion.div
                        animate={{
                          opacity: isActive || isHovered ? 1 : 0,
                          scale: isActive || isHovered ? 1 : 0.8,
                        }}
                        transition={{ duration: 0.3 }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '50%',
                          background: isActive
                            ? `linear-gradient(135deg, ${colorPalette.accent.electricBlue}, ${colorPalette.accent.hotPink})`
                            : `linear-gradient(135deg, ${colorPalette.accent.electricBlue}60, ${colorPalette.accent.hotPink}60)`,
                          filter: 'blur(8px)',
                          zIndex: 0,
                        }}
                      />

                      {/* Main circle */}
                      <motion.div
                        animate={{
                          scale: isActive ? 1 : 0.7,
                        }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{
                          position: 'relative',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: isActive
                            ? `linear-gradient(135deg, ${colorPalette.accent.electricBlue}40, ${colorPalette.accent.hotPink}40)`
                            : 'rgba(255, 255, 255, 0.05)',
                          border: isActive
                            ? `2px solid ${colorPalette.accent.electricBlue}`
                            : '2px solid rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1,
                          boxShadow: isActive
                            ? `0 0 20px ${colorPalette.accent.electricBlue}60`
                            : 'none',
                        }}
                      >
                        <IconComponent
                          size={18}
                          style={{
                            color: isActive
                              ? colorPalette.accent.electricBlue
                              : colorPalette.neutral.lightGray,
                            transition: 'color 0.3s ease',
                          }}
                        />
                      </motion.div>
                    </motion.button>
                  </Tooltip>
                );
              })}
            </Box>
          </motion.div>
        </Container>
      </Box>
    </AnimatePresence>
  );
};

export default SideDockNavigation;
