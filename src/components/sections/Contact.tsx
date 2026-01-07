import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Email as EmailIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import { colorPalette } from '../../styles/theme';
import { resumeData } from '../../data/resumeData';
import { ContactMethod } from '../../types';

const Contact: React.FC = () => {
  // Contact methods data
  const contactMethods: ContactMethod[] = [
    {
      type: 'email',
      value: resumeData.personalInfo.email,
      label: 'Email',
      icon: EmailIcon,
    },
    {
      type: 'linkedin',
      value: resumeData.personalInfo.linkedin,
      label: 'LinkedIn',
      icon: LinkedInIcon,
    },
  ];

  // Generate proper contact links
  const getContactHref = (method: ContactMethod): string => {
    switch (method.type) {
      case 'email':
        return `mailto:${method.value}`;
      case 'phone':
        return `tel:${method.value}`;
      case 'linkedin':
        return `https://${method.value}`;
      default:
        return '#';
    }
  };

  // Get display text for contact methods
  const getDisplayText = (method: ContactMethod): string => {
    switch (method.type) {
      case 'linkedin':
        return 'View Profile';
      default:
        return method.value;
    }
  };

  // Handle contact card click
  const handleContactClick = (method: ContactMethod) => {
    const href = getContactHref(method);
    if (method.type === 'linkedin') {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  };
  const getAccentColor = (type: string): string => {
    switch (type) {
      case 'email':
        return colorPalette.accent.hotPink;
      case 'phone':
        return colorPalette.accent.neonGreen;
      case 'linkedin':
        return colorPalette.accent.electricBlue;
      default:
        return colorPalette.accent.electricBlue;
    }
  };

  return (
    <Box
      component="section"
      id="contact"
      aria-labelledby="contact-heading"
      sx={{
        minHeight: { xs: '100svh', md: '100vh' }, // Full viewport height
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: { xs: 4, md: 8 },
        background: `linear-gradient(180deg, ${colorPalette.primary.black} 0%, ${colorPalette.primary.darkGray} 50%, ${colorPalette.primary.black} 100%)`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 30% 20%, ${colorPalette.accent.electricBlue}10 0%, transparent 50%),
                       radial-gradient(circle at 70% 80%, ${colorPalette.accent.hotPink}10 0%, transparent 50%),
                       radial-gradient(circle at 50% 50%, ${colorPalette.accent.neonGreen}08 0%, transparent 40%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            id="contact-heading"
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 700,
              background: `linear-gradient(45deg, ${colorPalette.accent.electricBlue}, ${colorPalette.accent.hotPink})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              textShadow: `0 0 30px ${colorPalette.accent.electricBlue}50`,
            }}
          >
            Get In Touch
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              color: colorPalette.neutral.lightGray,
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            Ready to collaborate? Let's create something amazing together.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {/* Contact Information */}
          <Grid item xs={12} md={8} lg={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2, sm: 3 },
              }}
            >
              {contactMethods.map((method) => {
                const IconComponent = method.icon;
                const accentColor = getAccentColor(method.type);

                return (
                  <Card
                    key={method.type}
                    onClick={() => handleContactClick(method)}
                    sx={{
                      background: `linear-gradient(135deg, ${colorPalette.primary.darkGray} 0%, ${colorPalette.primary.mediumGray} 100%)`,
                      border: `1px solid ${accentColor}30`,
                      borderRadius: 2,
                      boxShadow: `0 8px 25px ${colorPalette.primary.black}50`,
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: `0 12px 35px ${accentColor}20`,
                        borderColor: `${accentColor}60`,
                      },
                      '&:focus-visible': {
                        outline: `3px solid ${accentColor}`,
                        outlineOffset: '2px',
                        boxShadow: `0 12px 35px ${accentColor}30, 0 0 0 3px ${accentColor}40`,
                        borderColor: `${accentColor}80`,
                      },
                      '&:focus': {
                        outline: `3px solid ${accentColor}`,
                        outlineOffset: '2px',
                        boxShadow: `0 12px 35px ${accentColor}30, 0 0 0 3px ${accentColor}40`,
                        borderColor: `${accentColor}80`,
                      },
                      '&:active': {
                        boxShadow: `0 6px 20px ${accentColor}15`,
                      },
                      transition: 'all 0.3s ease-in-out',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)`,
                      },
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Contact via ${method.label}: ${getDisplayText(method)}. Press Enter or Space to ${method.type === 'linkedin' ? 'open LinkedIn profile in new tab' : method.type === 'email' ? 'open email client' : 'open phone dialer'}.`}
                    aria-describedby={`contact-${method.type}-description`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleContactClick(method);
                      }
                    }}
                  >
                    <CardContent
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: { xs: 3, sm: 4 },
                      }}
                    >
                      {/* Hidden description for screen readers */}
                      <Box
                        id={`contact-${method.type}-description`}
                        sx={{
                          position: 'absolute',
                          left: '-10000px',
                          width: '1px',
                          height: '1px',
                          overflow: 'hidden',
                        }}
                      >
                        {method.type === 'linkedin'
                          ? 'Opens LinkedIn profile in a new tab'
                          : method.type === 'email'
                            ? 'Opens your default email client to send an email'
                            : 'Opens your phone dialer to make a call'}
                      </Box>
                      <Box
                        sx={{
                          mr: { xs: 2, sm: 3 },
                          width: { xs: '56px', sm: '64px' },
                          height: { xs: '56px', sm: '64px' },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
                          color: colorPalette.primary.black,
                          borderRadius: 0,
                          clipPath:
                            'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                          boxShadow: `0 0 20px ${accentColor}40, inset 0 0 20px ${colorPalette.neutral.white}20`,
                          transition: 'all 0.3s ease',
                          flexShrink: 0,
                          '& > svg': {
                            fontSize: { xs: '1.5rem', sm: '1.75rem' },
                          },
                        }}
                      >
                        <IconComponent />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h5"
                          component="h3"
                          sx={{
                            color: colorPalette.neutral.white,
                            fontWeight: 600,
                            mb: 0.5,
                            fontSize: { xs: '1.125rem', sm: '1.5rem' },
                            lineHeight: 1.3,
                          }}
                        >
                          {method.label}
                        </Typography>
                        <Typography
                          sx={{
                            color: accentColor,
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            fontWeight: 500,
                            wordBreak: 'break-word',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {getDisplayText(method)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
