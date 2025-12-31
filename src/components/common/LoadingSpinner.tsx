import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { colorPalette } from '../../styles/theme';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

/**
 * Loading spinner component for lazy-loaded sections
 * Provides visual feedback during component loading
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 40 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          gap: 2,
        }}
        role="status"
        aria-label={message}
      >
        <CircularProgress
          size={size}
          sx={{
            color: colorPalette.accent.electricBlue,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: colorPalette.neutral.lightGray,
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default LoadingSpinner;