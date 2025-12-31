import React from 'react';
import { Box, Typography, Button, Container, Stack, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Download as DownloadIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import EntranceAnimation from '../common/EntranceAnimation';
import ProfileImage from '../common/ProfileImage';
import { colorPalette } from '../../styles/theme';

/**
 * Hero section component with engaging entrance animations and call-to-action buttons
 * Implements emo/scene aesthetic with vibrant colors and striking visual design
 */
const Hero: React.FC = () => {
  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleResumeClick = () => {
    const resumeSection = document.getElementById('resume');
    if (resumeSection) {
      resumeSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <Box
      component="section"
      id="hero"
      aria-labelledby="hero-heading"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: `linear-gradient(135deg, ${colorPalette.primary.black} 0%, ${colorPalette.primary.darkGray} 50%, ${colorPalette.primary.black} 100%)`,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${colorPalette.accent.electricBlue}15 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, ${colorPalette.accent.hotPink}15 0%, transparent 50%),
                       radial-gradient(circle at 40% 40%, ${colorPalette.accent.neonGreen}10 0%, transparent 50%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {/* Profile Photo Column - Enhanced positioning for visual hierarchy */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              textAlign: 'center',
              order: { xs: 1, md: 1 },
              position: 'relative',
              // Add enhanced visual hierarchy with subtle background effects
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%',
                height: '120%',
                background: `radial-gradient(circle, ${colorPalette.accent.electricBlue}10 0%, transparent 70%)`,
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none',
              },
            }}
          >
            <EntranceAnimation preset="scaleIn" delay={0.4}>
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  // Enhanced visual hierarchy with floating effect
                  '&:hover': {
                    '& .hero-profile-image': {
                      transform: 'translateY(-8px)',
                    },
                  },
                }}
              >
                <ProfileImage
                  size="large"
                  showAnimation={true}
                  className="hero-profile-image"
                />

                {/* Decorative elements for emo/scene aesthetic */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 40,
                    height: 40,
                    background: `linear-gradient(45deg, ${colorPalette.accent.hotPink}, ${colorPalette.accent.neonGreen})`,
                    borderRadius: '50%',
                    opacity: 0.7,
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-10px)' },
                    },
                  }}
                />

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -15,
                    left: -15,
                    width: 30,
                    height: 30,
                    background: `linear-gradient(45deg, ${colorPalette.accent.electricBlue}, ${colorPalette.accent.vibrantPurple})`,
                    borderRadius: '50%',
                    opacity: 0.6,
                    animation: 'float 3s ease-in-out infinite 1.5s',
                  }}
                />
              </Box>
            </EntranceAnimation>
          </Grid>

          {/* Content Column - Enhanced layout for better visual hierarchy */}
          <Grid item xs={12} md={8} sx={{ order: { xs: 2, md: 2 } }}>
            <Box
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                position: 'relative',
                zIndex: 1,
                // Enhanced spacing and positioning to complement the profile photo
                pl: { md: 3 },
                // Add subtle connecting visual element between photo and content
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '20%',
                  left: { xs: '50%', md: 0 },
                  transform: { xs: 'translateX(-50%)', md: 'none' },
                  width: { xs: '60px', md: '3px' },
                  height: { xs: '3px', md: '60px' },
                  background: `linear-gradient(${{
                    xs: '90deg',
                    md: '180deg',
                  }}, ${colorPalette.accent.electricBlue}, ${colorPalette.accent.hotPink})`,
                  borderRadius: '2px',
                  opacity: 0.6,
                  display: { xs: 'none', md: 'block' },
                },
              }}
            >
              {/* Main heading with enhanced entrance animation and visual hierarchy */}
              <EntranceAnimation preset="glitchEffect" delay={0.2}>
                <Typography
                  id="hero-heading"
                  variant="h1"
                  component="h1"
                  sx={{
                    fontSize: {
                      xs: '2.5rem',
                      sm: '3.5rem',
                      md: '4rem',
                      lg: '4.5rem',
                    },
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${colorPalette.accent.electricBlue}, ${colorPalette.accent.hotPink}, ${colorPalette.accent.neonGreen})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 3s ease-in-out infinite',
                    mb: 2,
                    textShadow: `0 0 30px ${colorPalette.accent.electricBlue}50`,
                    // Enhanced visual hierarchy positioning
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: { xs: '50%', md: 0 },
                      transform: { xs: 'translateX(-50%)', md: 'none' },
                      width: '100%',
                      height: '4px',
                      background: `linear-gradient(90deg, ${colorPalette.accent.hotPink}, ${colorPalette.accent.neonGreen})`,
                      borderRadius: '2px',
                      opacity: 0.8,
                    },
                    '@keyframes gradientShift': {
                      '0%': { backgroundPosition: '0% 50%' },
                      '50%': { backgroundPosition: '100% 50%' },
                      '100%': { backgroundPosition: '0% 50%' },
                    },
                  }}
                >
                  Robert Samalonis
                </Typography>
              </EntranceAnimation>

              {/* Subtitle with entrance animation */}
              <EntranceAnimation preset="fadeInUp" delay={0.6}>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },
                    fontWeight: 600,
                    color: colorPalette.neutral.white,
                    mb: 3,
                    textShadow: `0 0 20px ${colorPalette.accent.electricBlue}30`,
                  }}
                >
                  Senior Software Engineer
                </Typography>
              </EntranceAnimation>

              {/* Description with entrance animation */}
              <EntranceAnimation preset="fadeInUp" delay={1.0}>
                <Typography
                  variant="h5"
                  component="p"
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.25rem' },
                    fontWeight: 400,
                    color: colorPalette.neutral.lightGray,
                    mb: 5,
                    maxWidth: '600px',
                    mx: { xs: 'auto', md: 0 },
                    lineHeight: 1.6,
                  }}
                >
                  Crafting exceptional frontend experiences with React,
                  TypeScript, and modern web technologies. Passionate about
                  accessibility, performance, and creating user-centered digital
                  solutions.
                </Typography>
              </EntranceAnimation>

              {/* Call-to-action buttons with entrance animation */}

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 3 }}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                alignItems="center"
                sx={{
                  px: { xs: 2, sm: 0 },
                  outline: 'none !important',
                  '&:focus': {
                    outline: 'none !important',
                  },
                  '&:focus-visible': {
                    outline: 'none !important',
                  },
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ outline: 'none' }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<EmailIcon />}
                    onClick={handleContactClick}
                    aria-label="Navigate to contact section to get in touch"
                    sx={{
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: 600,
                      minHeight: { xs: '48px', sm: '56px' }, // Touch-friendly minimum size
                      minWidth: { xs: '200px', sm: '220px' },
                      background: `linear-gradient(45deg, ${colorPalette.accent.electricBlue}, ${colorPalette.accent.hotPink})`,
                      border: 'none',
                      borderRadius: 2,
                      color: colorPalette.primary.black,
                      textTransform: 'none',
                      boxShadow: `0 8px 25px ${colorPalette.accent.electricBlue}40`,
                      outline: 'none',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${colorPalette.accent.hotPink}, ${colorPalette.accent.electricBlue})`,
                        boxShadow: `0 12px 35px ${colorPalette.accent.hotPink}50`,
                        transform: 'translateY(-2px)',
                      },
                      '&:focus': {
                        outline: 'none !important',
                        boxShadow: `0 12px 35px ${colorPalette.accent.hotPink}50`,
                      },
                      '&:focus-visible': {
                        outline: 'none !important',
                        boxShadow: `0 12px 35px ${colorPalette.accent.hotPink}50`,
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    Get In Touch
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ outline: 'none' }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<DownloadIcon />}
                    onClick={handleResumeClick}
                    aria-label="Navigate to resume section to view resume"
                    sx={{
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: 600,
                      minHeight: { xs: '48px', sm: '56px' }, // Touch-friendly minimum size
                      minWidth: { xs: '200px', sm: '220px' },
                      borderColor: colorPalette.accent.neonGreen,
                      color: colorPalette.accent.neonGreen,
                      borderWidth: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: `0 0 20px ${colorPalette.accent.neonGreen}30`,
                      outline: 'none',
                      '&:hover': {
                        borderColor: colorPalette.accent.neonGreen,
                        backgroundColor: `${colorPalette.accent.neonGreen}15`,
                        boxShadow: `0 0 30px ${colorPalette.accent.neonGreen}50`,
                        transform: 'translateY(-2px)',
                      },
                      '&:focus': {
                        outline: 'none !important',
                        boxShadow: `0 0 30px ${colorPalette.accent.neonGreen}50`,
                      },
                      '&:focus-visible': {
                        outline: 'none !important',
                        boxShadow: `0 0 30px ${colorPalette.accent.neonGreen}50`,
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    View Resume
                  </Button>
                </motion.div>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
