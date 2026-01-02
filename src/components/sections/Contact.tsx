import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Link,
  TextField,
  Button,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LinkedIn as LinkedInIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { resumeData } from '../../data/resumeData';
import { ContactForm, ContactMethod } from '../../types';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Contact: React.FC = () => {
  const theme = useTheme();
  
  // Contact form state
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [formErrors, setFormErrors] = useState<Partial<ContactForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Contact methods data
  const contactMethods: ContactMethod[] = [
    {
      type: 'email',
      value: resumeData.personalInfo.email,
      label: 'Email',
      icon: EmailIcon,
    },
    {
      type: 'phone',
      value: resumeData.personalInfo.phone,
      label: 'Phone',
      icon: PhoneIcon,
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

  // Form validation
  const validateForm = (): boolean => {
    const errors: Partial<ContactForm> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (field: keyof ContactForm) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate form submission (in a real app, this would be an API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus({
        open: true,
        message: 'Thank you for your message! I\'ll get back to you soon.',
        severity: 'success',
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setSubmitStatus({
        open: true,
        message: 'Sorry, there was an error sending your message. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSubmitStatus(prev => ({ ...prev, open: false }));
  };

  return (
    <Box
      component="section"
      id="contact"
      aria-labelledby="contact-heading"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ textAlign: 'center', mb: 8 }}
        >
          <Typography
            id="contact-heading"
            variant="h2"
            component="h2"
            sx={{
              mb: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            Get In Touch
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Ready to collaborate? Let's create something amazing together.
          </Typography>
        </MotionBox>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h4"
                component="h3"
                sx={{ 
                  mb: 4, 
                  color: 'text.primary',
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
                id="contact-info-heading"
              >
                Contact Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <MotionCard
                      key={method.type}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02 }}
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.action.hover})`,
                        border: `1px solid ${theme.palette.divider}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          boxShadow: `0 8px 25px ${theme.palette.primary.main}20`,
                        },
                      }}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center', p: { xs: 2, sm: 3 } }}>
                        <IconButton
                          component={Link}
                          href={getContactHref(method)}
                          target={method.type === 'linkedin' ? '_blank' : undefined}
                          rel={method.type === 'linkedin' ? 'noopener noreferrer' : undefined}
                          sx={{
                            mr: { xs: 2, sm: 3 },
                            minWidth: { xs: '48px', sm: '56px' }, // Touch-friendly minimum size
                            minHeight: { xs: '48px', sm: '56px' },
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            '&:hover': {
                              backgroundColor: theme.palette.primary.dark,
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                          aria-label={`Contact via ${method.label}`}
                        >
                          <IconComponent />
                        </IconButton>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            sx={{ 
                              color: 'text.primary', 
                              mb: 0.5,
                              fontSize: { xs: '1.1rem', sm: '1.25rem' }
                            }}
                          >
                            {method.label}
                          </Typography>
                          <Link
                            href={getContactHref(method)}
                            target={method.type === 'linkedin' ? '_blank' : undefined}
                            rel={method.type === 'linkedin' ? 'noopener noreferrer' : undefined}
                            sx={{
                              color: 'text.secondary',
                              textDecoration: 'none',
                              fontSize: { xs: '0.9rem', sm: '1rem' },
                              wordBreak: 'break-word',
                              '&:hover': {
                                color: 'primary.main',
                                textDecoration: 'underline',
                              },
                              transition: 'color 0.3s ease',
                            }}
                          >
                            {method.value}
                          </Link>
                        </Box>
                      </CardContent>
                    </MotionCard>
                  );
                })}
              </Box>
            </MotionBox>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h4"
                component="h3"
                sx={{ 
                  mb: 4, 
                  color: 'text.primary',
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
                id="contact-form-heading"
              >
                Send a Message
              </Typography>
              
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.action.hover})`,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Box component="form" onSubmit={handleSubmit} noValidate role="form" aria-labelledby="contact-form-heading">
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Name"
                          value={formData.name}
                          onChange={handleInputChange('name')}
                          error={!!formErrors.name}
                          helperText={formErrors.name}
                          required
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              minHeight: { xs: '48px', sm: '56px' }, // Touch-friendly minimum size
                              '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange('email')}
                          error={!!formErrors.email}
                          helperText={formErrors.email}
                          required
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              minHeight: { xs: '48px', sm: '56px' }, // Touch-friendly minimum size
                              '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subject"
                          value={formData.subject}
                          onChange={handleInputChange('subject')}
                          error={!!formErrors.subject}
                          helperText={formErrors.subject}
                          required
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              minHeight: { xs: '48px', sm: '56px' }, // Touch-friendly minimum size
                              '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Message"
                          multiline
                          rows={4}
                          value={formData.message}
                          onChange={handleInputChange('message')}
                          error={!!formErrors.message}
                          helperText={formErrors.message}
                          required
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <motion.div
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={isSubmitting}
                            startIcon={<SendIcon />}
                            aria-describedby={Object.keys(formErrors).length > 0 ? "form-errors" : undefined}
                            sx={{
                              py: { xs: 1.25, sm: 1.5 },
                              px: { xs: 3, sm: 4 },
                              minHeight: { xs: '48px', sm: '56px' },
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              fontWeight: 700,
                              fontFamily: '"Orbitron", "Roboto", sans-serif',
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              width: { xs: '100%', sm: 'auto' },
                              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              border: `2px solid ${theme.palette.primary.main}`,
                              borderRadius: 0,
                              color: theme.palette.primary.contrastText,
                              boxShadow: `0 0 20px ${theme.palette.primary.main}60, inset 0 0 20px ${theme.palette.secondary.main}40`,
                              position: 'relative',
                              overflow: 'hidden',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)`,
                                transition: 'left 0.5s',
                              },
                              '&:hover::before': {
                                left: '100%',
                              },
                              '&:hover': {
                                background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                                boxShadow: `0 0 30px ${theme.palette.secondary.main}80, inset 0 0 30px ${theme.palette.primary.main}60`,
                              },
                              '&:disabled': {
                                opacity: 0.6,
                                cursor: 'not-allowed',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                          </Button>
                        </motion.div>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </MotionCard>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={submitStatus.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={submitStatus.severity}
          sx={{ width: '100%' }}
        >
          {submitStatus.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;