import React, { useEffect } from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
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
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  
  // Smooth mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      mouseX.set(x * 20);
      mouseY.set(y * 20);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
        mx: -4,
        px: 4,
      }}
    >
      {/* Animated starfield */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(2px 2px at 20% 30%, ${colorPalette.neutral.white}, transparent),
            radial-gradient(2px 2px at 60% 70%, ${colorPalette.accent.electricBlue}, transparent),
            radial-gradient(1px 1px at 50% 50%, ${colorPalette.neutral.white}, transparent),
            radial-gradient(1px 1px at 80% 10%, ${colorPalette.accent.hotPink}, transparent),
            radial-gradient(2px 2px at 90% 60%, ${colorPalette.accent.neonGreen}, transparent),
            radial-gradient(1px 1px at 33% 80%, ${colorPalette.neutral.white}, transparent),
            radial-gradient(1px 1px at 15% 90%, ${colorPalette.accent.vibrantPurple}, transparent)
          `,
          backgroundSize: '200% 200%',
          animation: 'stars 60s linear infinite',
          opacity: 0.6,
          '@keyframes stars': {
            '0%': { transform: 'translate(0, 0)' },
            '100%': { transform: 'translate(-50%, -50%)' },
          },
        }}
      />

      {/* Moving color waves */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 0% 0%, ${colorPalette.accent.electricBlue}15 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, ${colorPalette.accent.hotPink}15 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, ${colorPalette.accent.neonGreen}10 0%, transparent 50%)
          `,
          backgroundSize: '200% 200%',
          animation: 'waves 15s ease-in-out infinite',
          '@keyframes waves': {
            '0%, 100%': { backgroundPosition: '0% 0%, 100% 100%, 50% 50%' },
            '50%': { backgroundPosition: '100% 100%, 0% 0%, 25% 75%' },
          },
        }}
      />

      {/* Animated grid background - perspective effect */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${colorPalette.accent.electricBlue}30 1.5px, transparent 1.5px),
            linear-gradient(90deg, ${colorPalette.accent.electricBlue}30 1.5px, transparent 1.5px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(600px) rotateX(60deg) translateZ(-100px)',
          transformOrigin: 'center bottom',
          opacity: 0.4,
          animation: 'gridScroll 20s linear infinite',
          '@keyframes gridScroll': {
            '0%': { backgroundPosition: '0 0' },
            '100%': { backgroundPosition: '0 60px' },
          },
        }}
      />

      {/* Horizontal scan lines */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${colorPalette.accent.hotPink}15 1px, transparent 1px)`,
          backgroundSize: '100% 40px',
          animation: 'scanMove 10s linear infinite',
          opacity: 0.3,
          '@keyframes scanMove': {
            '0%': { transform: 'translateY(0)' },
            '100%': { transform: 'translateY(40px)' },
          },
        }}
      />

      {/* Diagonal grid overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(45deg, ${colorPalette.accent.neonGreen}10 1px, transparent 1px),
            linear-gradient(-45deg, ${colorPalette.accent.vibrantPurple}10 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          animation: 'diagonalMove 25s linear infinite',
          opacity: 0.2,
          '@keyframes diagonalMove': {
            '0%': { backgroundPosition: '0 0, 0 0' },
            '100%': { backgroundPosition: '80px 80px, -80px 80px' },
          },
        }}
      />

      {/* Floating geometric shapes with parallax */}
      <motion.div
        style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          width: '120px',
          height: '120px',
          y: y1,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(45deg, ${colorPalette.accent.hotPink}30, ${colorPalette.accent.vibrantPurple}30)`,
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            animation: 'float 8s ease-in-out infinite, rotate 20s linear infinite',
            border: `2px solid ${colorPalette.accent.hotPink}60`,
            boxShadow: `0 0 30px ${colorPalette.accent.hotPink}40`,
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-30px)' },
            },
            '@keyframes rotate': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          top: '65%',
          right: '10%',
          width: '100px',
          height: '100px',
          y: y2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, ${colorPalette.accent.neonGreen}30, ${colorPalette.accent.electricBlue}30)`,
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
            animation: 'float 10s ease-in-out infinite 2s, rotateReverse 15s linear infinite',
            border: `2px solid ${colorPalette.accent.neonGreen}60`,
            boxShadow: `0 0 30px ${colorPalette.accent.neonGreen}40`,
            '@keyframes rotateReverse': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(-360deg)' },
            },
          }}
        />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          top: '40%',
          right: '5%',
          width: '60px',
          height: '60px',
          y: y1,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(90deg, ${colorPalette.accent.electricBlue}40, ${colorPalette.accent.vibrantPurple}40)`,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            animation: 'float 7s ease-in-out infinite 1s, pulse 3s ease-in-out infinite',
            border: `2px solid ${colorPalette.accent.electricBlue}60`,
            boxShadow: `0 0 20px ${colorPalette.accent.electricBlue}40`,
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
              '50%': { opacity: 1, transform: 'scale(1.1)' },
            },
          }}
        />
      </motion.div>

      {/* Scanline effect */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)',
          pointerEvents: 'none',
          animation: 'scanline 8s linear infinite',
          '@keyframes scanline': {
            '0%': { transform: 'translateY(0)' },
            '100%': { transform: 'translateY(100%)' },
          },
        }}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
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
            <motion.div
              style={{
                x: smoothMouseX,
                y: smoothMouseY,
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  perspective: '1000px',
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
                      animation: 'rotate 4s linear infinite',
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
                      animation: 'pulse 2s ease-in-out infinite',
                    },
                    '@keyframes rotate': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                      '50%': { transform: 'scale(1.05)', opacity: 0.5 },
                    },
                  }}
                >
                  <EntranceAnimation preset="scaleIn" delay={0.2}>
                    <ProfileImage size="large" showAnimation={true} />
                  </EntranceAnimation>
                </Box>
              </Box>
            </motion.div>

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
                      animation: 'textGlow 2s ease-in-out infinite',
                      lineHeight: { xs: 1.1, md: 1.2 },
                      '@keyframes textGlow': {
                        '0%, 100%': { filter: 'brightness(1)' },
                        '50%': { filter: 'brightness(1.3)' },
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
                      animation: 'shimmer 3s infinite',
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
                      color: colorPalette.primary.black,
                      boxShadow: `0 0 20px ${colorPalette.accent.electricBlue}60, inset 0 0 20px ${colorPalette.accent.hotPink}40`,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(90deg, transparent, ${colorPalette.neutral.white}40, transparent)`,
                        transition: 'left 0.5s',
                      },
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
                      color: colorPalette.accent.neonGreen,
                      boxShadow: `0 0 20px ${colorPalette.accent.neonGreen}40`,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: `${colorPalette.accent.neonGreen}20`,
                        transition: 'left 0.5s',
                      },
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
              </Stack>
            </Box>
          </Box>
        </Container>
    </Box>
  );
};

export default Hero;
