import { ResumeData } from '../types';

export const resumeData: ResumeData = {
  personalInfo: {
    name: 'Robert Samalonis',
    title: 'Senior Software Engineer',
    email: 'robsamalonis@gmail.com',
    linkedin: 'linkedin.com/in/robert-samalonis-4a092a137',
    summary: 'Innovative Senior Software Engineer specializing in React, TypeScript, and accessibility-first development. Expert in leveraging AI-assisted development workflows and rapid prototyping methodologies to deliver exceptional, inclusive web applications with cutting-edge user experiences.'
  },
  experience: [
    {
      id: 'emoney-2022',
      company: 'eMoney Advisor',
      position: 'Senior Software Engineer',
      startDate: 'April 2022',
      endDate: 'Present',
      responsibilities: [
        'Lead frontend development initiatives using React, TypeScript, and modern development workflows',
        'Pioneer AI-assisted development practices to accelerate feature delivery and code quality',
        'Implement comprehensive accessibility standards (WCAG 2.1 AA) across enterprise applications',
        'Mentor development teams on best practices, code architecture, and emerging technologies',
        'Drive performance optimization initiatives resulting in measurable UX improvements',
        'Collaborate cross-functionally with design and product teams to deliver user-centered solutions'
      ],
      technologies: ['React', 'RTK Query', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap 5', 'Web Accessibility', 'AI-Assisted Development', 'Jest', 'Testing Library', 'Performance Optimization']
    },
    {
      id: 'elsevier-prev',
      company: 'Elsevier',
      position: 'Software Engineer',
      startDate: 'June 2017',
      endDate: 'April 2022',
      responsibilities: [
        'Architected and maintained scalable web applications for global scientific publishing platform',
        'Implemented responsive, cross-browser compatible interfaces serving millions of users',
        'Collaborated with distributed international teams on complex, multi-year projects',
        'Contributed to frontend architecture decisions and established development standards',
        'Delivered features through agile methodologies with continuous integration practices'
      ],
      technologies: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Node.js', 'Git', 'Agile Methodologies', 'CI/CD']
    }
  ],
  education: [
    {
      id: 'temple-university',
      institution: 'Temple University',
      degree: `Bachelor's Degree`,
      field: 'Computer Science',
      graduationDate: '2013 - 2017'
    }
  ],
  skills: [
    // Frontend Technologies
    {
      id: 'react',
      name: 'React',
      category: 'frontend',
      proficiency: 'expert'
    },
    {
      id: 'rtk-query',
      name: 'RTK Query',
      category: 'frontend',
      proficiency: 'advanced'
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
      proficiency: 'expert'
    },
    {
      id: 'material-ui',
      name: 'Material-UI',
      category: 'frontend',
      proficiency: 'advanced'
    },
    {
      id: 'bootstrap',
      name: 'Bootstrap 5',
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
      id: 'responsive-design',
      name: 'Responsive Design',
      category: 'frontend',
      proficiency: 'expert'
    },
    
    // Development Methodologies
    {
      id: 'ai-assisted-development',
      name: 'AI-Assisted Development',
      category: 'methodologies',
      proficiency: 'advanced'
    },
    {
      id: 'rapid-prototyping',
      name: 'Rapid Prototyping',
      category: 'methodologies',
      proficiency: 'advanced'
    },
    {
      id: 'agile-development',
      name: 'Agile Development',
      category: 'methodologies',
      proficiency: 'advanced'
    },
    {
      id: 'code-review',
      name: 'Code Review & Mentoring',
      category: 'methodologies',
      proficiency: 'expert'
    },
    
    // Tools & Testing
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
      name: 'Git & Version Control',
      category: 'tools',
      proficiency: 'expert'
    },
    {
      id: 'vite',
      name: 'Vite',
      category: 'tools',
      proficiency: 'advanced'
    },
    {
      id: 'figma',
      name: 'Figma',
      category: 'tools',
      proficiency: 'intermediate'
    },
    {
      id: 'performance-optimization',
      name: 'Performance Optimization',
      category: 'tools',
      proficiency: 'advanced'
    },
    
    // Backend & Infrastructure
    {
      id: 'nodejs',
      name: 'Node.js',
      category: 'backend',
      proficiency: 'intermediate'
    },
    {
      id: 'ci-cd',
      name: 'CI/CD Pipelines',
      category: 'backend',
      proficiency: 'intermediate'
    }
  ]
};