import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { colorPalette } from '../../styles/theme';
import { useMobileSpacing } from '../../hooks/useMobileSpacing';

/**
 * Footer component that sits at the very bottom of the page
 * Includes copyright information and technology credits
 */
const Footer: React.FC = () => {
  const { safeBottomPadding } = useMobileSpacing();

  return (
    <Box
      component="footer"
      role="contentinfo"
      sx={{
        background: `linear-gradient(180deg, ${colorPalette.primary.darkGray} 0%, ${colorPalette.primary.black} 100%)`,
        borderTop: `1px solid ${colorPalette.neutral.mediumGray}20`,
        py: { xs: 3, sm: 4 },
        pb: safeBottomPadding,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% 0%, ${colorPalette.accent.electricBlue}05 0%, transparent 50%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: colorPalette.neutral.lightGray,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              order: { xs: 2, sm: 1 },
            }}
          >
            Thanks for visiting! Looking forward to connecting with you.
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: colorPalette.neutral.mediumGray,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              order: { xs: 1, sm: 2 },
            }}
          >
            Built with React, TypeScript, Material-UI, and Kiro.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
