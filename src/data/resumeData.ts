import { ResumeData } from '../types';

export const resumeData: ResumeData = {
  personalInfo: {
    name: 'Robert Samalonis',
    title: 'Senior Software Engineer',
    email: 'robsamalonis@gmail.com',
    phone: '267-772-1647',
    linkedin: 'linkedin.com/in/robert-samalonis-4a092a137',
    summary: 'Experienced Senior Software Engineer with expertise in React, TypeScript, accessibility, and modern frontend development. Passionate about creating inclusive, performant web applications with exceptional user experiences.'
  },
  experience: [
    {
      id: 'emoney-2022',
      company: 'eMoney Advisor',
      position: 'Senior Software Engineer',
      startDate: 'April 2022',
      endDate: 'Present',
      responsibilities: [
        'Lead frontend development initiatives using React and TypeScript',
        'Implement accessibility best practices and WCAG compliance across applications',
        'Mentor junior developers and conduct code reviews',
        'Collaborate with UX/UI teams to deliver exceptional user experiences',
        'Optimize application performance and implement modern testing strategies'
      ],
      technologies: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Accessibility', 'Jest', 'Testing Library']
    },
    {
      id: 'elsevier-prev',
      company: 'Elsevier',
      position: 'Software Engineer',
      startDate: 'June 2017',
      endDate: 'April 2022',
      responsibilities: [
        'Developed and maintained web applications for scientific publishing platform',
        'Implemented responsive designs and cross-browser compatibility',
        'Collaborated with international teams on large-scale projects',
        'Contributed to frontend architecture decisions and best practices',
        'Participated in agile development processes and sprint planning'
      ],
      technologies: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Node.js', 'Git', 'Agile']
    }
  ],
  education: [
    {
      id: 'temple-university',
      institution: 'Temple University',
      degree: `Bachelor's Degree`,
      field: 'Computer Science',
      graduationDate: '2017'
    }
  ],
  skills: [
    {
      id: 'react',
      name: 'React',
      category: 'frontend',
      proficiency: 'expert'
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      category: 'frontend',
      proficiency: 'expert'
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      category: 'frontend',
      proficiency: 'expert'
    },
    {
      id: 'html5',
      name: 'HTML5',
      category: 'frontend',
      proficiency: 'expert'
    },
    {
      id: 'css3',
      name: 'CSS3',
      category: 'frontend',
      proficiency: 'expert'
    },
    {
      id: 'accessibility',
      name: 'Web Accessibility (WCAG)',
      category: 'frontend',
      proficiency: 'advanced'
    },
    {
      id: 'material-ui',
      name: 'Material-UI',
      category: 'frontend',
      proficiency: 'advanced'
    },
    {
      id: 'framer-motion',
      name: 'Framer Motion',
      category: 'frontend',
      proficiency: 'advanced'
    },
    {
      id: 'jest',
      name: 'Jest',
      category: 'tools',
      proficiency: 'advanced'
    },
    {
      id: 'testing-library',
      name: 'React Testing Library',
      category: 'tools',
      proficiency: 'advanced'
    },
    {
      id: 'git',
      name: 'Git',
      category: 'tools',
      proficiency: 'advanced'
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      category: 'backend',
      proficiency: 'intermediate'
    },
    {
      id: 'vite',
      name: 'Vite',
      category: 'tools',
      proficiency: 'intermediate'
    },
    {
      id: 'figma',
      name: 'Figma',
      category: 'tools',
      proficiency: 'intermediate'
    }
  ]
};