import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Download as DownloadIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import AnimatedSection from '../common/AnimatedSection';
import { colorPalette } from '../../styles/theme';
import { resumeData } from '../../data';
import { Experience, Education, Skill } from '../../types';
import { animationConfigs } from '../../utils/animationPresets';
import { generateResumePDF } from '../../utils/pdfGenerator';

/**
 * Resume section component displaying professional experience, education, and skills
 * Includes PDF download functionality and responsive Material-UI layout
 * Mobile-optimized with collapsible cards for better readability
 */
const Resume: React.FC = () => {
  const { experience, education, skills } = resumeData;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {}
  );

  const handlePDFDownload = async () => {
    try {
      await generateResumePDF();
    } catch (error) {
      console.error('Failed to generate PDF:', error);

      // Fallback: Try to download a static PDF if available
      try {
        const link = document.createElement('a');
        link.href = '/Robert_Samalonis_Resume.pdf';
        link.download = 'Robert_Samalonis_Resume.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackError) {
        console.error('Fallback PDF download failed:', fallbackError);
        alert(
          'Sorry, there was an error generating the PDF. Please try again or contact me directly.'
        );
      }
    }
  };

  const toggleCardExpansion = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getCategoryColor = (category: Skill['category']) => {
    switch (category) {
      case 'frontend':
        return colorPalette.accent.electricBlue; // Blue for frontend technologies
      case 'backend':
        return colorPalette.accent.neonGreen; // Green for backend/infrastructure
      case 'tools':
        return colorPalette.accent.lightOrange; // Light orange for better contrast on tools
      case 'methodologies':
        return colorPalette.accent.hotPink; // Original magenta/hot pink for methodologies
      case 'other':
        return colorPalette.accent.vibrantPurple; // Purple for other skills
      default:
        return colorPalette.neutral.mediumGray;
    }
  };

  const renderExperienceCard = (exp: Experience, index: number) => {
    const isExpanded = expandedCards[exp.id] ?? false;

    return (
      <motion.div
        key={exp.id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
      >
        <Card
          onClick={isMobile ? () => toggleCardExpansion(exp.id) : undefined}
          role={isMobile ? 'button' : undefined}
          tabIndex={isMobile ? 0 : undefined}
          aria-expanded={isMobile ? isExpanded : undefined}
          aria-label={
            isMobile
              ? `${isExpanded ? 'Collapse' : 'Expand'} details for ${exp.position} at ${exp.company}`
              : undefined
          }
          onKeyDown={
            isMobile
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCardExpansion(exp.id);
                  }
                }
              : undefined
          }
          sx={{
            mb: 3,
            mx: isMobile ? 2 : 0, // Add horizontal margin on mobile
            background: `linear-gradient(135deg, ${colorPalette.primary.darkGray} 0%, ${colorPalette.primary.mediumGray} 100%)`,
            border: `1px solid ${colorPalette.accent.electricBlue}30`,
            borderRadius: 2,
            boxShadow: `0 8px 25px ${colorPalette.primary.black}50`,
            cursor: isMobile ? 'pointer' : 'default',
            '&:hover': {
              boxShadow: `0 12px 35px ${colorPalette.accent.electricBlue}20`,
              transform: 'translateY(-4px)',
            },
            '&:focus-visible': isMobile
              ? {
                  outline: `3px solid ${colorPalette.accent.electricBlue}`,
                  outlineOffset: '2px',
                }
              : {},
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <CardContent
            sx={{
              p: isMobile ? '24px' : 3,
              '&:last-child': {
                pb: isMobile ? '24px' : 3,
              },
            }}
          >
            {/* Header Section - Always Visible */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                mb: isMobile ? 1.5 : 2,
              }}
            >
              <WorkIcon
                sx={{
                  color: colorPalette.accent.electricBlue,
                  mr: 2,
                  mt: 0.5,
                  fontSize: isMobile ? '1.5rem' : '1.75rem',
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    color: colorPalette.neutral.white,
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: isMobile ? '1.125rem' : '1.5rem',
                    lineHeight: 1.3,
                  }}
                >
                  {exp.position}
                </Typography>
                <Typography
                  variant="h6"
                  component="h4"
                  sx={{
                    color: colorPalette.accent.electricBlue,
                    fontWeight: 500,
                    fontSize: isMobile ? '0.9375rem' : '1.25rem',
                    mb: isMobile ? 1 : 0,
                    lineHeight: 1.3,
                  }}
                >
                  {exp.company}
                </Typography>
                {isMobile && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: colorPalette.neutral.lightGray,
                      fontWeight: 400,
                      fontSize: '0.8125rem',
                      mt: 0.5,
                    }}
                  >
                    {exp.startDate} - {exp.endDate}
                  </Typography>
                )}
              </Box>

              {!isMobile && (
                <Box
                  sx={{
                    ml: 3,
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    backgroundColor: `${colorPalette.accent.electricBlue}15`,
                    border: `1px solid ${colorPalette.accent.electricBlue}40`,
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: colorPalette.accent.electricBlue,
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      letterSpacing: '0.02em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {exp.startDate} - {exp.endDate}
                  </Typography>
                </Box>
              )}

              {isMobile && (
                <IconButton
                  aria-label={
                    isExpanded ? 'Collapse details' : 'Expand details'
                  }
                  aria-expanded={isExpanded}
                  sx={{
                    color: colorPalette.accent.electricBlue,
                    padding: '8px',
                    minWidth: '44px',
                    minHeight: '44px',
                    ml: 1,
                    flexShrink: 0,
                    borderRadius: 0,
                    clipPath:
                      'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                    pointerEvents: 'none', // Prevent the icon from intercepting clicks
                    '&:hover': {
                      backgroundColor: `${colorPalette.accent.electricBlue}20`,
                    },
                  }}
                >
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              )}
            </Box>

            {/* Collapsible Content - Mobile Only */}
            {isMobile ? (
              <Collapse in={isExpanded} timeout={300}>
                <Box sx={{ mt: 2 }}>
                  <List sx={{ mb: 2, p: 0 }}>
                    {exp.responsibilities.map((responsibility, idx) => (
                      <ListItem
                        key={idx}
                        sx={{
                          py: 0.75,
                          px: 0,
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            color: colorPalette.accent.electricBlue,
                            mr: 1.5,
                            mt: 0.5,
                            fontSize: '0.5rem',
                            flexShrink: 0,
                          }}
                        >
                          ●
                        </Box>
                        <ListItemText
                          primary={responsibility}
                          sx={{
                            m: 0,
                            '& .MuiListItemText-primary': {
                              color: colorPalette.neutral.lightGray,
                              fontSize: '0.875rem',
                              lineHeight: 1.6,
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {exp.technologies.map((tech) => (
                      <Chip
                        key={tech}
                        label={tech}
                        size="small"
                        sx={{
                          backgroundColor: `${colorPalette.neutral.white}20`,
                          color: colorPalette.neutral.white,
                          border: `1px solid ${colorPalette.neutral.white}50`,
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          height: '24px',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Collapse>
            ) : (
              // Desktop - Always Expanded
              <>
                <List sx={{ mb: 2 }}>
                  {exp.responsibilities.map((responsibility, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                      <ListItemText
                        primary={responsibility}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: colorPalette.neutral.lightGray,
                            fontSize: '0.95rem',
                            lineHeight: 1.5,
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {exp.technologies.map((tech) => (
                    <Chip
                      key={tech}
                      label={tech}
                      size="small"
                      sx={{
                        backgroundColor: `${colorPalette.neutral.white}20`,
                        color: colorPalette.neutral.white,
                        border: `1px solid ${colorPalette.neutral.white}50`,
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderEducationCard = (edu: Education, index: number) => {
    return (
      <motion.div
        key={edu.id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
      >
        <Card
          sx={{
            mb: 3,
            mx: isMobile ? 2 : 0, // Add horizontal margin on mobile
            background: `linear-gradient(135deg, ${colorPalette.primary.darkGray} 0%, ${colorPalette.primary.mediumGray} 100%)`,
            border: `1px solid ${colorPalette.accent.hotPink}30`,
            borderRadius: 2,
            boxShadow: `0 8px 25px ${colorPalette.primary.black}50`,
            '&:hover': {
              boxShadow: `0 12px 35px ${colorPalette.accent.hotPink}20`,
              transform: 'translateY(-4px)',
            },
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <CardContent
            sx={{
              p: isMobile ? '24px' : 3,
              '&:last-child': {
                pb: isMobile ? '24px' : 3,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                mb: isMobile ? 0 : 2,
              }}
            >
              <SchoolIcon
                sx={{
                  color: colorPalette.accent.hotPink,
                  mr: 2,
                  mt: 0.5,
                  fontSize: isMobile ? '1.5rem' : '1.75rem',
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    color: colorPalette.neutral.white,
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: isMobile ? '1.125rem' : '1.5rem',
                    lineHeight: 1.3,
                  }}
                >
                  {edu.degree} in {edu.field}
                </Typography>
                <Typography
                  variant="h6"
                  component="h4"
                  sx={{
                    color: colorPalette.accent.hotPink,
                    fontWeight: 500,
                    fontSize: isMobile ? '0.9375rem' : '1.25rem',
                    mb: isMobile ? 1 : 0,
                    lineHeight: 1.3,
                  }}
                >
                  {edu.institution}
                </Typography>
                {isMobile && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: colorPalette.neutral.lightGray,
                      fontWeight: 400,
                      fontSize: '0.8125rem',
                      mt: 0.5,
                    }}
                  >
                    {edu.graduationDate}
                  </Typography>
                )}
              </Box>

              {!isMobile && (
                <Box
                  sx={{
                    ml: 3,
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    backgroundColor: `${colorPalette.accent.hotPink}15`,
                    border: `1px solid ${colorPalette.accent.hotPink}40`,
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: colorPalette.accent.hotPink,
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      letterSpacing: '0.02em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {edu.graduationDate}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <Box
      component="section"
      id="resume"
      aria-labelledby="resume-heading"
      sx={{
        py: 8,
        background: `linear-gradient(180deg, ${colorPalette.primary.black} 0%, ${colorPalette.primary.darkGray} 50%, ${colorPalette.primary.black} 100%)`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 70% 30%, ${colorPalette.accent.electricBlue}10 0%, transparent 50%),
                       radial-gradient(circle at 30% 70%, ${colorPalette.accent.hotPink}10 0%, transparent 50%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          px: { xs: 0, sm: 2, md: 3 }, // Remove horizontal padding on mobile
        }}
      >
        {/* Header with Download Button */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
            mb: 4,
            px: { xs: 2, sm: 0 },
            gap: { xs: 3, sm: 2 },
          }}
        >
          <Typography
            variant="h2"
            component="h2"
            id="resume-heading"
            sx={{
              color: colorPalette.neutral.white,
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontFamily: '"Orbitron", "Roboto", sans-serif',
              textAlign: { xs: 'center', sm: 'left' },
              background: `linear-gradient(45deg, ${colorPalette.accent.electricBlue}, ${colorPalette.accent.neonGreen})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: `0 0 30px ${colorPalette.accent.electricBlue}60`,
            }}
          >
            Resume
          </Typography>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<DownloadIcon />}
              onClick={handlePDFDownload}
              aria-label="Download PDF version of resume"
              sx={{
                px: { xs: 3, sm: 4 },
                py: { xs: 1.25, sm: 1.5 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                fontWeight: 700,
                fontFamily: '"Orbitron", "Roboto", sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                minHeight: { xs: '48px', sm: '56px' },
                background: `linear-gradient(45deg, ${colorPalette.accent.neonGreen}, ${colorPalette.accent.electricBlue})`,
                border: `2px solid ${colorPalette.accent.neonGreen}`,
                borderRadius: 0,
                clipPath:
                  'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                color: colorPalette.primary.black,
                boxShadow: `0 0 20px ${colorPalette.accent.neonGreen}60, inset 0 0 20px ${colorPalette.accent.electricBlue}40`,
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
                  background: `linear-gradient(45deg, ${colorPalette.accent.electricBlue}, ${colorPalette.accent.neonGreen})`,
                  boxShadow: `0 0 30px ${colorPalette.accent.electricBlue}80, inset 0 0 30px ${colorPalette.accent.neonGreen}60`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              Download PDF
            </Button>
          </motion.div>
        </Box>

        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* Experience Section */}
          <Grid item xs={12} lg={8}>
            <AnimatedSection animation={animationConfigs.scrollReveal}>
              <Typography
                variant="h4"
                component="h3"
                sx={{
                  color: colorPalette.neutral.white,
                  fontWeight: 600,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  px: { xs: 2, sm: 0 },
                }}
                id="experience-heading"
              >
                Professional Experience
              </Typography>
              {experience.map((exp, index) => renderExperienceCard(exp, index))}
            </AnimatedSection>

            <AnimatedSection animation={animationConfigs.scrollReveal}>
              <Typography
                variant="h4"
                component="h3"
                sx={{
                  color: colorPalette.neutral.white,
                  fontWeight: 600,
                  mb: 3,
                  mt: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  px: { xs: 2, sm: 0 },
                }}
                id="education-heading"
              >
                Education
              </Typography>
              {education.map((edu, index) => renderEducationCard(edu, index))}
            </AnimatedSection>
          </Grid>

          {/* Skills Section */}
          <Grid item xs={12} lg={4}>
            <AnimatedSection animation={animationConfigs.scrollReveal}>
              <Typography
                variant="h4"
                component="h3"
                sx={{
                  color: colorPalette.neutral.white,
                  fontWeight: 600,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  px: { xs: 2, sm: 0 },
                }}
                id="skills-heading"
              >
                Technical Skills
              </Typography>

              {Object.entries(skillsByCategory).map(
                ([category, categorySkills]) => {
                  const categoryColor = getCategoryColor(
                    category as Skill['category']
                  );
                  return (
                    <Card
                      key={category}
                      sx={{
                        mb: 3,
                        mx: isMobile ? 2 : 0, // Add horizontal margin on mobile
                        background: `linear-gradient(135deg, ${colorPalette.primary.darkGray} 0%, ${colorPalette.primary.mediumGray} 100%)`,
                        border: `1px solid ${categoryColor}30`,
                        borderRadius: 2,
                        boxShadow: `0 8px 25px ${colorPalette.primary.black}50`,
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          component="h4"
                          sx={{
                            color: categoryColor,
                            fontWeight: 600,
                            mb: 2,
                            textTransform: 'capitalize',
                          }}
                        >
                          {category}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {categorySkills.map((skill) => (
                            <Chip
                              key={skill.id}
                              label={skill.name}
                              size="small"
                              sx={{
                                backgroundColor: `${categoryColor}20`,
                                color: categoryColor,
                                border: `1px solid ${categoryColor}50`,
                                fontWeight: 500,
                                mb: 0.5,
                              }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </AnimatedSection>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Resume;
