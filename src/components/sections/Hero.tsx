import React, { useEffect } from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { motion, useMotionValue } from 'framer-motion';
import {
  Download as DownloadIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import EntranceAnimation from '../common/EntranceAnimation';
import ProfileImage from '../common/ProfileImage';
import { colorPalette } from '../../styles/theme';

/**
 * Hero section with retro-futuristic design and advanced UX interactions
 * Features parallax scrolling, mouse tracking, and dynamic animations
 */
const Hero: React.FC = () => {
  // Mouse tracking for interactive effects (not used with shooting stars but kept for other elements)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Reduced motion preference check
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only apply mouse tracking on desktop (md breakpoint and above)
      if (window.innerWidth < 960) {
        mouseX.set(0);
        mouseY.set(0);
        return;
      }
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      mouseX.set(x * 20);
      mouseY.set(y * 20);
    };

    // Reset mouse tracking on mobile
    const handleResize = () => {
      if (window.innerWidth < 960) {
        mouseX.set(0);
        mouseY.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [mouseX, mouseY]);

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
        background: `linear-gradient(135deg, ${colorPalette.primary.black} 0%, #0a0a1a 50%, ${colorPalette.primary.black} 100%)`,
        overflow: 'hidden',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        contain: 'layout style paint',
      }}
    >
      {/* Retro-Futuristic Neon Grid Tunnel Background */}
      
      {/* Deep Space Gradient Base */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at center, #1a0033 0%, #0a0015 40%, ${colorPalette.primary.black} 100%),
            linear-gradient(45deg, #330066 0%, transparent 50%, #660033 100%)
          `,
          opacity: 0.9,
        }}
      />

      {/* Animated Neon Grid Tunnel - Main Layer */}
      <Box
        sx={{
          position: 'absolute',
          left: '-100vw',
          right: '-100vw',
          top: '-50vh',
          bottom: '-50vh',
          width: '300vw',
          height: '200vh',
          marginLeft: '-100vw',
          marginTop: '-50vh',
          backgroundImage: `
            linear-gradient(${colorPalette.accent.hotPink}80 2px, transparent 2px),
            linear-gradient(90deg, ${colorPalette.accent.hotPink}80 2px, transparent 2px),
            linear-gradient(${colorPalette.accent.electricBlue}60 1px, transparent 1px),
            linear-gradient(90deg, ${colorPalette.accent.electricBlue}60 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 50px 50px, 50px 50px',
          transform: 'perspective(800px) rotateX(60deg) translateZ(-400px)',
          transformOrigin: 'center center',
          opacity: 0.8,
          animation: !prefersReducedMotion ? 'tunnelFlow 60s linear infinite' : 'none',
          maskImage: `
            radial-gradient(ellipse 120% 60% at center 80%, 
              rgba(0,0,0,1) 0%, 
              rgba(0,0,0,0.8) 30%, 
              rgba(0,0,0,0.4) 60%, 
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(ellipse 120% 60% at center 80%, 
              rgba(0,0,0,1) 0%, 
              rgba(0,0,0,0.8) 30%, 
              rgba(0,0,0,0.4) 60%, 
              transparent 100%
            )
          `,
          '@keyframes tunnelFlow': {
            '0%': { 
              backgroundPosition: '0 0, 0 0, 0 0, 0 0',
              transform: 'perspective(800px) rotateX(60deg) translateZ(-400px) scale3d(1, 1, 1)',
            },
            '50%': { 
              backgroundPosition: '50px 50px, 50px 50px, 25px 25px, 25px 25px',
              transform: 'perspective(800px) rotateX(60deg) translateZ(-400px) scale3d(1.05, 1.05, 1)',
            },
            '100%': { 
              backgroundPosition: '100px 100px, 100px 100px, 50px 50px, 50px 50px',
              transform: 'perspective(800px) rotateX(60deg) translateZ(-400px) scale3d(1, 1, 1)',
            },
          },
        }}
      />

      {/* Secondary Grid Layer for Depth */}
      {/* <Box
        sx={{
          position: 'absolute',
          left: '-100vw',
          right: '-100vw',
          top: '-50vh',
          bottom: '-50vh',
          width: '300vw',
          height: '200vh',
          marginLeft: '-100vw',
          marginTop: '-50vh',
          backgroundImage: `
            linear-gradient(${colorPalette.accent.neonGreen}40 1px, transparent 1px),
            linear-gradient(90deg, ${colorPalette.accent.neonGreen}40 1px, transparent 1px)
          `,
          backgroundSize: '150px 150px',
          transform: 'perspective(1000px) rotateX(65deg) translateZ(-600px)',
          transformOrigin: 'center center',
          opacity: 0.5,
          animation: !prefersReducedMotion ? 'tunnelFlowSlow 30s linear infinite' : 'none',
          maskImage: `
            radial-gradient(ellipse 100% 50% at center 85%, 
              rgba(0,0,0,0.8) 0%, 
              rgba(0,0,0,0.4) 50%, 
              transparent 80%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(ellipse 100% 50% at center 85%, 
              rgba(0,0,0,0.8) 0%, 
              rgba(0,0,0,0.4) 50%, 
              transparent 80%
            )
          `,
          '@keyframes tunnelFlowSlow': {
            '0%': { 
              backgroundPosition: '0 0',
              transform: 'perspective(1000px) rotateX(65deg) translateZ(-600px) scale(0.9)',
            },
            '100%': { 
              backgroundPosition: '150px 150px',
              transform: 'perspective(1000px) rotateX(65deg) translateZ(-600px) scale(1.2)',
            },
          },
        }}
      /> */}

      {/* Neon Horizon Glow */}
      {/* <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 150% 40% at center 75%, 
              ${colorPalette.accent.hotPink}25 0%, 
              ${colorPalette.accent.electricBlue}15 30%, 
              transparent 60%
            ),
            radial-gradient(ellipse 100% 20% at center 85%, 
              ${colorPalette.accent.vibrantPurple}20 0%, 
              transparent 50%
            )
          `,
          animation: !prefersReducedMotion ? 'horizonPulse 8s ease-in-out infinite' : 'none',
          '@keyframes horizonPulse': {
            '0%, 100%': { 
              opacity: 0.6,
              transform: 'scaleY(1)',
            },
            '50%': { 
              opacity: 0.9,
              transform: 'scaleY(1.1)',
            },
          },
        }}
      /> */}

      {/* Retro Scan Lines */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              ${colorPalette.accent.hotPink}15 2px,
              ${colorPalette.accent.hotPink}15 4px
            )
          `,
          animation: !prefersReducedMotion ? 'scanlineMove 60s linear infinite' : 'none',
          opacity: 0.4,
          '@keyframes scanlineMove': {
            '0%': { transform: 'translate3d(0, 0, 0)' },
            '100%': { transform: 'translate3d(0, 1500px, 0)' },
          },
        }}
      />
      
      {/* Retro Starfield Enhancement */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(2px 2px at 20% 30%, ${colorPalette.neutral.white}80, transparent),
            radial-gradient(1px 1px at 60% 70%, ${colorPalette.accent.electricBlue}60, transparent),
            radial-gradient(1px 1px at 50% 50%, ${colorPalette.neutral.white}70, transparent),
            radial-gradient(2px 2px at 80% 10%, ${colorPalette.accent.hotPink}50, transparent),
            radial-gradient(1px 1px at 90% 60%, ${colorPalette.accent.neonGreen}60, transparent),
            radial-gradient(1px 1px at 33% 80%, ${colorPalette.neutral.white}50, transparent),
            radial-gradient(2px 2px at 15% 90%, ${colorPalette.accent.vibrantPurple}40, transparent),
            radial-gradient(1px 1px at 70% 20%, ${colorPalette.accent.electricBlue}70, transparent)
          `,
          backgroundSize: '300% 300%',
          animation: !prefersReducedMotion ? 'starsRetro 60s linear infinite' : 'none',
          opacity: 0.6,
          '@keyframes starsRetro': {
            '0%': { 
              transform: 'translate3d(0, 0, 0) rotate(0deg) scale3d(1, 1, 1)',
              backgroundPosition: '0% 0%',
            },
            '25%': { 
              transform: 'translate3d(-50px, -30px, 0) rotate(90deg) scale3d(1.05, 1.05, 1)',
              backgroundPosition: '25% 25%',
            },
            '50%': { 
              transform: 'translate3d(-100px, -60px, 0) rotate(180deg) scale3d(0.95, 0.95, 1)',
              backgroundPosition: '50% 50%',
            },
            '75%': { 
              transform: 'translate3d(-150px, -90px, 0) rotate(270deg) scale3d(1.02, 1.02, 1)',
              backgroundPosition: '75% 75%',
            },
            '100%': { 
              transform: 'translate3d(-200px, -120px, 0) rotate(360deg) scale3d(1, 1, 1)',
              backgroundPosition: '100% 100%',
            },
          },
        }}
      />

      {/* Neon Glow Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 30% 40%, ${colorPalette.accent.hotPink}08 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, ${colorPalette.accent.electricBlue}06 0%, transparent 40%),
            radial-gradient(circle at 50% 80%, ${colorPalette.accent.neonGreen}05 0%, transparent 35%)
          `,
          animation: !prefersReducedMotion ? 'neonGlow 60s linear infinite' : 'none',
          '@keyframes neonGlow': {
            '0%': { 
              opacity: 0.5,
              transform: 'scale3d(1, 1, 1)',
            },
            '20%': { 
              opacity: 0.8,
              transform: 'scale3d(1.02, 1.02, 1)',
            },
            '40%': { 
              opacity: 0.3,
              transform: 'scale3d(0.98, 0.98, 1)',
            },
            '60%': { 
              opacity: 0.7,
              transform: 'scale3d(1.01, 1.01, 1)',
            },
            '80%': { 
              opacity: 0.4,
              transform: 'scale3d(0.99, 0.99, 1)',
            },
            '100%': { 
              opacity: 0.5,
              transform: 'scale3d(1, 1, 1)',
            },
          },
        }}
      />

      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 2, md: 4 },
          px: { xs: 2, md: 4 },
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 3, md: 8 },
            position: 'relative',
          }}
        >
            {/* Profile Image with 3D effect */}
            <Box
              sx={{
                position: 'relative',
                perspective: '1000px',
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-start' },
                alignItems: 'center',
                width: { xs: '100%', md: 'auto' },
                '&:hover .profile-container': {
                  transform: 'rotateY(5deg) rotateX(-5deg)',
                },
              }}
            >
                <Box
                  className="profile-container"
                  sx={{
                    position: 'relative',
                    transition: 'transform 0.3s ease',
                    transformStyle: 'preserve-3d',
                    transform: { xs: 'scale(0.85)', sm: 'scale(1)' },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: -20,
                      background: `conic-gradient(from 0deg, ${colorPalette.accent.electricBlue}, ${colorPalette.accent.hotPink}, ${colorPalette.accent.neonGreen}, ${colorPalette.accent.vibrantPurple}, ${colorPalette.accent.electricBlue})`,
                      borderRadius: '50%',
                      animation: 'rotate 60s linear infinite',
                      filter: 'blur(15px)',
                      opacity: 0.6,
                      zIndex: -1,
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: -10,
                      background: 'transparent',
                      border: `2px solid ${colorPalette.accent.electricBlue}`,
                      borderRadius: '50%',
                      animation: 'pulse 60s linear infinite',
                    },
                    '@keyframes rotate': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                    '@keyframes pulse': {
                      '0%': { transform: 'scale3d(1, 1, 1)', opacity: 1 },
                      '50%': { transform: 'scale3d(1.05, 1.05, 1)', opacity: 0.5 },
                      '100%': { transform: 'scale3d(1, 1, 1)', opacity: 1 },
                    },
                  }}
                >
                  <EntranceAnimation preset="scaleIn" delay={0.2}>
                    <ProfileImage size="large" showAnimation={true} />
                  </EntranceAnimation>
                </Box>
              </Box>

            {/* Content */}
            <Box
              sx={{
                flex: 1,
                textAlign: { xs: 'center', md: 'left' },
                maxWidth: '600px',
                px: { xs: 1, sm: 0 },
              }}
            >
              {/* Glitch text effect for name */}
              <Box sx={{ position: 'relative', mb: { xs: 1.5, md: 2 } }}>
                <EntranceAnimation preset="glitchEffect" delay={0.4}>
                  <Typography
                    id="hero-heading"
                    variant="h1"
                    component="h1"
                    sx={{
                      fontSize: { xs: '2rem', sm: '3rem', md: '4.5rem' },
                      fontWeight: 900,
                      fontFamily: '"Orbitron", "Roboto", sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: { xs: '0.02em', md: '0.05em' },
                      background: `linear-gradient(45deg, ${colorPalette.accent.electricBlue}, ${colorPalette.accent.hotPink})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      position: 'relative',
                      textShadow: `0 0 40px ${colorPalette.accent.electricBlue}80`,
                      animation: 'textGlow 60s linear infinite',
                      lineHeight: { xs: 1.1, md: 1.2 },
                      '@keyframes textGlow': {
                        '0%': { filter: 'brightness(1)' },
                        '25%': { filter: 'brightness(1.2)' },
                        '50%': { filter: 'brightness(1.3)' },
                        '75%': { filter: 'brightness(1.1)' },
                        '100%': { filter: 'brightness(1)' },
                      },
                    }}
                  >
                    Robert
                    <br />
                    Samalonis
                  </Typography>
                </EntranceAnimation>
              </Box>

              {/* Retro badge for title */}
              <EntranceAnimation preset="fadeInUp" delay={0.6}>
                <Box
                  sx={{
                    display: 'inline-block',
                    mb: { xs: 2, md: 3 },
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 1.5 },
                    background: `linear-gradient(90deg, ${colorPalette.accent.electricBlue}20, ${colorPalette.accent.hotPink}20)`,
                    border: `2px solid ${colorPalette.accent.electricBlue}`,
                    borderRadius: '0',
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                    position: 'relative',
                    maxWidth: '100%',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(90deg, transparent, ${colorPalette.accent.electricBlue}40, transparent)`,
                      animation: 'shimmer 60s linear infinite',
                    },
                    '@keyframes shimmer': {
                      '0%': { transform: 'translateX(-100%)' },
                      '100%': { transform: 'translateX(100%)' },
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '1rem', md: '1.25rem' },
                      fontWeight: 700,
                      color: colorPalette.accent.electricBlue,
                      textTransform: 'uppercase',
                      letterSpacing: { xs: '0.05em', md: '0.1em' },
                      fontFamily: '"Orbitron", "Roboto", sans-serif',
                      whiteSpace: { xs: 'normal', sm: 'nowrap' },
                    }}
                  >
                    ⚡ Senior Software Engineer ⚡
                  </Typography>
                </Box>
              </EntranceAnimation>

              {/* Description with typewriter effect styling */}
              <EntranceAnimation preset="fadeInUp" delay={0.8}>
                <Typography
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' },
                    color: colorPalette.neutral.lightGray,
                    mb: { xs: 3, md: 4 },
                    lineHeight: 1.7,
                    fontFamily: '"Courier New", monospace',
                    px: { xs: 1, sm: 0 },
                    '&::before': {
                      content: '">"',
                      color: colorPalette.accent.neonGreen,
                      marginRight: 1,
                      fontWeight: 'bold',
                    },
                  }}
                >
                  Crafting exceptional frontend experiences with React, TypeScript, and modern web technologies. Passionate about accessibility, performance, and creating user-centered digital solutions.
                </Typography>
              </EntranceAnimation>

              {/* Retro-styled buttons */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 3 }}
                sx={{
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  px: { xs: 1, sm: 0 },
                }}
              >
             
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<DownloadIcon />}
                    onClick={handleResumeClick}
                    sx={{
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1.25, sm: 1.5 },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      fontWeight: 700,
                      fontFamily: '"Orbitron", "Roboto", sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      width: { xs: '100%', sm: 'auto' },
                      minWidth: { xs: 'auto', sm: '200px' },
                      borderColor: colorPalette.accent.neonGreen,
                      border: `2px solid ${colorPalette.accent.neonGreen}`,
                      borderRadius: 0,
                      clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                      color: colorPalette.accent.neonGreen,
                      boxShadow: `0 0 20px ${colorPalette.accent.neonGreen}40`,
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover::before': {
                        left: '100%',
                      },
                      '&:hover': {
                        borderColor: colorPalette.accent.neonGreen,
                        backgroundColor: `${colorPalette.accent.neonGreen}10`,
                        boxShadow: `0 0 30px ${colorPalette.accent.neonGreen}60`,
                      },
                    }}
                  >
                    View Resume
                  </Button>
                </motion.div>

                   <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<EmailIcon />}
                    onClick={handleContactClick}
                    sx={{
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1.25, sm: 1.5 },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      fontWeight: 700,
                      fontFamily: '"Orbitron", "Roboto", sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      width: { xs: '100%', sm: 'auto' },
                      minWidth: { xs: 'auto', sm: '200px' },
                      background: `linear-gradient(45deg, ${colorPalette.accent.electricBlue}, ${colorPalette.accent.hotPink})`,
                      border: `2px solid ${colorPalette.accent.electricBlue}`,
                      borderRadius: 0,
                      clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                      color: colorPalette.primary.black, // Black text for better contrast on gradient
                      boxShadow: `0 0 20px ${colorPalette.accent.electricBlue}60, inset 0 0 20px ${colorPalette.accent.hotPink}40`,
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover::before': {
                        left: '100%',
                      },
                      '&:hover': {
                        boxShadow: `0 0 30px ${colorPalette.accent.hotPink}80, inset 0 0 30px ${colorPalette.accent.electricBlue}60`,
                      },
                    }}
                  >
                    Get In Touch
                  </Button>
                </motion.div>

              </Stack>
            </Box>
          </Box>
        </Container>
    </Box>
  );
};

export default Hero;
