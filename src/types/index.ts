// Core type definitions for the portfolio website

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | 'present';
  responsibilities: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'other';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMethod {
  type: 'email' | 'phone' | 'linkedin';
  value: string;
  label: string;
  icon: React.ComponentType;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType;
}

export interface ProfileImage {
  src: string;
  alt: string;
  sizes: ImageSizes;
  loading: 'lazy' | 'eager';
}

export interface ImageSizes {
  mobile: string;
  tablet: string;
  desktop: string;
}

export interface CTAButton {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
  icon?: React.ComponentType;
}

export interface HeroProps {
  title: string;
  subtitle: string;
  ctaButtons: CTAButton[];
  profileImage: ProfileImage;
}

// Export animation types
export * from './animation';

// Export theme types
export * from './theme';

// Export modern navigation types
export * from './navigation';
