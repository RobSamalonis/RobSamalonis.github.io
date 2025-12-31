import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Download as DownloadIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import AnimatedSection from '../common/AnimatedSection';
import { colorPalette } from '../../styles/theme';
import { resumeData } from '../../data';
import { Experience, Education, Skill } from '../../types';
import { animationConfigs } from '../../utils/animationPresets';

/**
 * Resume section component displaying professional experience, education, and skills
 * Includes PDF download functionality and responsive Material-UI layout
 */
const Resume: React.FC = () => {
  const { personalInfo, experience, education, skills } = resumeData;

  const handlePDFDownload = () => {
    // TODO: Implement PDF generation/download functionality
    console.log('PDF download functionality to be implemented');
  };

  const getSkillColor = (proficiency: Skill['proficiency']) => {
    switch (proficiency) {
      case 'expert':
        return colorPalette.accent.neonGreen;
      case 'advanced':
        return colorPalette.accent.electricBlue;
      case 'intermediate':
        return colorPalette.accent.hotPink;
      case 'beginner':
        return colorPalette.accent.brightOrange;
      default:
        return colorPalette.neutral.mediumGray;
    }
  };

  const renderExperienceCard = (exp: Experience, index: number) => (
    <motion.div
      key={exp.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      <Card
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${colorPalette.primary.darkGray} 0%, ${colorPalette.primary.mediumGray} 100%)`,
          border: `1px solid ${colorPalette.accent.electricBlue}30`,
          borderRadius: 2,
          boxShadow: `0 8px 25px ${colorPalette.primary.black}50`,
          '&:hover': {
            boxShadow: `0 12px 35px ${colorPalette.accent.electricBlue}20`,
            transform: 'translateY(-4px)',
          },
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WorkIcon sx={{ color: colorPalette.accent.electricBlue, mr: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  color: colorPalette.neutral.white,
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                {exp.position}
              </Typography>
              <Typography
                variant="h6"
                component="h4"
                sx={{
                  color: colorPalette.accent.hotPink,
                  fontWeight: 500,
                }}
              >
                {exp.company}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: colorPalette.neutral.lightGray,
                fontWeight: 500,
                textAlign: 'right',
              }}
            >
              {exp.startDate} - {exp.endDate}
            </Typography>
          </Box>

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
                  backgroundColor: `${colorPalette.accent.neonGreen}20`,
                  color: colorPalette.accent.neonGreen,
                  border: `1px solid ${colorPalette.accent.neonGreen}50`,
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderEducationCard = (edu: Education, index: number) => (
    <motion.div
      key={edu.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      <Card
        sx={{
          mb: 3,
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
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SchoolIcon sx={{ color: colorPalette.accent.hotPink, mr: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  color: colorPalette.neutral.white,
                  fontWeight: 600,
                  mb: 0.5,
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
                }}
              >
                {edu.institution}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: colorPalette.neutral.lightGray,
                fontWeight: 500,
                textAlign: 'right',
              }}
            >
              {edu.graduationDate}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <AnimatedSection animation={animationConfigs.scrollReveal}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              id="resume-heading"
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
              Resume
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                color: colorPalette.neutral.lightGray,
                maxWidth: '600px',
                mx: 'auto',
                mb: 4,
              }}
            >
              {personalInfo.summary}
            </Typography>

            {/* Contact Info and PDF Download */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2, sm: 2 }}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 4, flexWrap: 'wrap' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: { xs: 'auto', sm: '200px' } }}>
                <EmailIcon sx={{ color: colorPalette.accent.electricBlue, fontSize: '1.2rem' }} />
                <Typography
                  component="a"
                  href={`mailto:${personalInfo.email}`}
                  sx={{
                    color: colorPalette.neutral.white,
                    textDecoration: 'none',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    '&:hover': { color: colorPalette.accent.electricBlue },
                  }}
                >
                  {personalInfo.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: { xs: 'auto', sm: '150px' } }}>
                <PhoneIcon sx={{ color: colorPalette.accent.hotPink, fontSize: '1.2rem' }} />
                <Typography
                  component="a"
                  href={`tel:${personalInfo.phone}`}
                  sx={{
                    color: colorPalette.neutral.white,
                    textDecoration: 'none',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    '&:hover': { color: colorPalette.accent.hotPink },
                  }}
                >
                  {personalInfo.phone}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: { xs: 'auto', sm: '120px' } }}>
                <LinkedInIcon sx={{ color: colorPalette.accent.neonGreen, fontSize: '1.2rem' }} />
                <Typography
                  component="a"
                  href={`https://${personalInfo.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: colorPalette.neutral.white,
                    textDecoration: 'none',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    '&:hover': { color: colorPalette.accent.neonGreen },
                  }}
                >
                  LinkedIn
                </Typography>
              </Box>
            </Stack>

            <motion.div
              whileHover={{ scale: 1.05 }}
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
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 600,
                  minHeight: { xs: '48px', sm: '56px' }, // Touch-friendly minimum size
                  background: `linear-gradient(45deg, ${colorPalette.accent.neonGreen}, ${colorPalette.accent.electricBlue})`,
                  border: 'none',
                  borderRadius: 2,
                  color: colorPalette.primary.black,
                  textTransform: 'none',
                  boxShadow: `0 8px 25px ${colorPalette.accent.neonGreen}40`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${colorPalette.accent.electricBlue}, ${colorPalette.accent.neonGreen})`,
                    boxShadow: `0 12px 35px ${colorPalette.accent.electricBlue}50`,
                    transform: 'translateY(-2px)',
                  },
                  '&:focus': {
                    outline: `3px solid ${colorPalette.neutral.white}`,
                    outlineOffset: '2px',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                Download PDF Resume
              </Button>
            </motion.div>
          </Box>
        </AnimatedSection>

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
                }}
                id="skills-heading"
              >
                <CodeIcon sx={{ color: colorPalette.accent.neonGreen }} aria-hidden="true" />
                Technical Skills
              </Typography>

              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <Card
                  key={category}
                  sx={{
                    mb: 3,
                    background: `linear-gradient(135deg, ${colorPalette.primary.darkGray} 0%, ${colorPalette.primary.mediumGray} 100%)`,
                    border: `1px solid ${colorPalette.accent.neonGreen}30`,
                    borderRadius: 2,
                    boxShadow: `0 8px 25px ${colorPalette.primary.black}50`,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{
                        color: colorPalette.accent.neonGreen,
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
                            backgroundColor: `${getSkillColor(skill.proficiency)}20`,
                            color: getSkillColor(skill.proficiency),
                            border: `1px solid ${getSkillColor(skill.proficiency)}50`,
                            fontWeight: 500,
                            mb: 0.5,
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </AnimatedSection>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Resume;