import React, { useRef, useEffect } from 'react';
import { Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Person as PersonIcon } from '@mui/icons-material';
import { colorPalette } from '../../styles/theme';
import { measureImageLoadTime, respectsReducedMotion } from '../../utils/performance';

// Import the profile photo using ES module syntax for Vite compatibility
// In test environment, this will be mocked by Jest
import profilePhotoUrl from '../../assets/profile-photo.jpg';

interface ProfileImageProps {
  size?: 'small' | 'medium' | 'large';
  showAnimation?: boolean;
  className?: string;
}

interface ImageSizes {
  mobile: number;
  tablet: number;
  desktop: number;
}

const sizeMap: Record<string, ImageSizes> = {
  small: { mobile: 80, tablet: 100, desktop: 120 },
  medium: { mobile: 120, tablet: 150, desktop: 180 },
  large: { mobile: 180, tablet: 220, desktop: 280 },
};

const StyledAvatar = styled(Avatar)(() => ({
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Emo/scene aesthetic with multiple neon borders
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: '50%',
    background: `conic-gradient(from 0deg, ${colorPalette.accent.electricBlue}, ${colorPalette.accent.hotPink}, ${colorPalette.accent.neonGreen}, ${colorPalette.accent.vibrantPurple}, ${colorPalette.accent.electricBlue})`,
    // Animation will be controlled by the component based on motion preferences
    zIndex: -1,
  },
  
  '&::after': {
    content: '""',
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: '50%',
    background: `linear-gradient(45deg, ${colorPalette.accent.hotPink}80, ${colorPalette.accent.electricBlue}80)`,
    filter: 'blur(2px)',
    zIndex: -1,
  },
  
  // Enhanced glow effects
  boxShadow: `
    0 0 20px ${colorPalette.accent.electricBlue}60,
    0 0 40px ${colorPalette.accent.hotPink}40,
    0 0 60px ${colorPalette.accent.neonGreen}20,
    inset 0 0 20px ${colorPalette.primary.black}30
  `,
  
  // Enhanced hover effects (only if motion is not reduced)
  '&:hover': {
    transform: 'scale(1.08) rotate(2deg)',
    boxShadow: `
      0 0 30px ${colorPalette.accent.electricBlue}80,
      0 0 60px ${colorPalette.accent.hotPink}60,
      0 0 90px ${colorPalette.accent.neonGreen}40,
      inset 0 0 30px ${colorPalette.primary.black}40
    `,
    filter: 'contrast(1.2) saturate(1.3) brightness(1.1)',
  },
  
  // Keyframe animations
  '@keyframes rotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  
  '@keyframes pulse': {
    '0%, 100%': { 
      boxShadow: `
        0 0 20px ${colorPalette.accent.electricBlue}60,
        0 0 40px ${colorPalette.accent.hotPink}40,
        0 0 60px ${colorPalette.accent.neonGreen}20
      ` 
    },
    '50%': { 
      boxShadow: `
        0 0 30px ${colorPalette.accent.electricBlue}80,
        0 0 60px ${colorPalette.accent.hotPink}60,
        0 0 90px ${colorPalette.accent.neonGreen}40
      ` 
    },
  },
  
  // Respect reduced motion preferences
  '@media (prefers-reduced-motion: reduce)': {
    '&::before': {
      animation: 'none !important',
    },
    '&:hover': {
      transform: 'none',
    },
    transition: 'none',
  },
}));

const MotionBox = motion.div;

const ProfileImage: React.FC<ProfileImageProps> = ({ 
  size = 'medium', 
  showAnimation = true,
  className 
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const reducedMotion = respectsReducedMotion();
  
  // Measure image loading performance when photo loads
  useEffect(() => {
    if (imageRef.current) {
      measureImageLoadTime('profile-photo', imageRef.current);
    }
  }, []);

  // Respect user's motion preferences
  const shouldAnimate = showAnimation && !reducedMotion;
  
  const animationProps = shouldAnimate ? {
    initial: { opacity: 0, scale: 0.5, rotate: -180 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    transition: { 
      duration: 0.8, 
      delay: 0.3,
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  } : {
    initial: { opacity: 1, scale: 1, rotate: 0 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    transition: { duration: 0 }
  };

  return (
    <MotionBox
      className={className}
      {...animationProps}
      style={{
        position: 'relative',
        display: 'inline-block',
        // Ensure consistent layout regardless of animation state
        minWidth: sizeMap[size].mobile,
        minHeight: sizeMap[size].mobile,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
          // Add subtle pulsing animation for enhanced visual hierarchy (only if motion is allowed)
          animation: shouldAnimate ? 'pulse 3s ease-in-out infinite' : 'none',
          '@keyframes pulse': {
            '0%, 100%': { 
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.3))'
            },
            '50%': { 
              filter: 'drop-shadow(0 0 20px rgba(255, 20, 147, 0.5))'
            },
          },
        }}
      >
      <StyledAvatar
        ref={imageRef}
        src={profilePhotoUrl}
        alt="Robert Samalonis - Senior Software Engineer"
        sx={{
          // Enhanced emo/scene aesthetic styling
          filter: 'contrast(1.15) saturate(1.3) brightness(1.05)',
          background: `conic-gradient(from 45deg, ${colorPalette.accent.electricBlue}, ${colorPalette.accent.hotPink}, ${colorPalette.accent.neonGreen}, ${colorPalette.accent.vibrantPurple})`,
          padding: '3px',
          border: `2px solid ${colorPalette.primary.black}`,
          
          // Apply size-based dimensions with enhanced scaling
          width: {
            xs: sizeMap[size].mobile,
            sm: sizeMap[size].tablet,
            md: sizeMap[size].desktop,
          },
          height: {
            xs: sizeMap[size].mobile,
            sm: sizeMap[size].tablet,
            md: sizeMap[size].desktop,
          },
          
          // Enhanced visual hierarchy with z-index and positioning
          position: 'relative',
          zIndex: 2,
          
          // Control rotation animation based on motion preferences
          '&::before': {
            animation: shouldAnimate ? 'rotate 4s linear infinite' : 'none',
          },
          
          // Improved fallback styling for missing image
          '& .MuiAvatar-fallback': {
            background: `linear-gradient(135deg, ${colorPalette.accent.electricBlue}20, ${colorPalette.accent.hotPink}20)`,
            color: colorPalette.accent.electricBlue,
          },
          
          // Ensure image loads properly and maintains aspect ratio
          // Scale image by 105% to prevent background peeking through
          '& img': {
            objectFit: 'cover',
            objectPosition: 'center',
            width: '105%',
            height: '105%',
            transform: 'scale(1.05)',
          },
        }}
      >
        {/* Fallback icon - only shown if image fails to load */}
        <PersonIcon 
          sx={{ 
            fontSize: '60%',
            color: colorPalette.accent.electricBlue,
            filter: `drop-shadow(0 0 5px ${colorPalette.accent.electricBlue}80)`,
          }} 
        />
      </StyledAvatar>
      </Box>
    </MotionBox>
  );
};

export default ProfileImage;