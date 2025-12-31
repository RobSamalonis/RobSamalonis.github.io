import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { 
  AnimatedSection, 
  PageTransition, 
  AnimatedInteractive, 
  EntranceAnimation,
  animationConfigs 
} from './index';

/**
 * Example component demonstrating the animation system
 * This shows how to use the various animation components
 */
const AnimationExample: React.FC = () => {
  return (
    <PageTransition>
      <Box sx={{ padding: 4, maxWidth: 800, margin: '0 auto' }}>
        
        {/* Entrance Animation Example */}
        <EntranceAnimation delay={0.2} preset="fadeInUp">
          <Typography variant="h2" component="h1" gutterBottom>
            Animation System Demo
          </Typography>
        </EntranceAnimation>

        {/* Scroll-triggered Animation Example */}
        <AnimatedSection 
          animation={animationConfigs.scrollReveal}
          threshold={0.2}
        >
          <Box sx={{ 
            backgroundColor: 'primary.main', 
            color: 'white', 
            padding: 3, 
            borderRadius: 2,
            marginY: 4 
          }}>
            <Typography variant="h4" gutterBottom>
              Scroll-triggered Content
            </Typography>
            <Typography>
              This content animates when scrolled into view using the AnimatedSection component.
            </Typography>
          </Box>
        </AnimatedSection>

        {/* Interactive Animation Example */}
        <Box sx={{ display: 'flex', gap: 2, marginY: 4 }}>
          <AnimatedInteractive>
            <Button variant="contained" color="primary">
              Hover Me!
            </Button>
          </AnimatedInteractive>
          
          <AnimatedInteractive hoverScale={1.1} tapScale={0.9}>
            <Button variant="outlined" color="secondary">
              Custom Scale
            </Button>
          </AnimatedInteractive>
        </Box>

        {/* Multiple Scroll Sections */}
        {[1, 2, 3].map((num) => (
          <AnimatedSection 
            key={num}
            animation={animationConfigs.scrollReveal}
            threshold={0.3}
          >
            <Box sx={{ 
              backgroundColor: 'background.paper', 
              padding: 2, 
              marginY: 2,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <Typography variant="h6">
                Animated Section {num}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Each section animates independently when scrolled into view.
              </Typography>
            </Box>
          </AnimatedSection>
        ))}

      </Box>
    </PageTransition>
  );
};

export default AnimationExample;