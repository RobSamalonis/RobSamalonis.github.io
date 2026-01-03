import React, { useRef, useEffect } from 'react';
import { Box, Avatar } from '@mui/material';
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
  large: { mobile: 280, tablet: 300, desktop: 320 },
};

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

  return (
  
      <Avatar
        ref={imageRef}
        src={profilePhotoUrl}
        alt="Robert Samalonis - Senior Software Engineer"
        sx={{
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
            animation: shouldAnimate ? 'rotate 60s linear infinite' : 'none',
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
            '0%': { 
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
            '100%': { 
              boxShadow: `
                0 0 20px ${colorPalette.accent.electricBlue}60,
                0 0 40px ${colorPalette.accent.hotPink}40,
                0 0 60px ${colorPalette.accent.neonGreen}20
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
          zIndex: 2,
          
          // Improved fallback styling for missing image
          '& .MuiAvatar-fallback': {
            background: `linear-gradient(135deg, ${colorPalette.accent.electricBlue}20, ${colorPalette.accent.hotPink}20)`,
            color: colorPalette.accent.electricBlue,
          },
          
          // Ensure image loads properly and maintains aspect ratio
          // Scale image by 108% to prevent background peeking through
          '& img': {
            objectFit: 'cover',
            objectPosition: 'center',
            width: '108%',
            height: '108%',
            transform: 'scale(1.08)',
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
      </Avatar>

  );
};

export default ProfileImage;