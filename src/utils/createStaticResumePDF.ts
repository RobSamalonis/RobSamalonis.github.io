import { resumeData } from '../data/resumeData';

/**
 * Creates an HTML version of the resume for PDF conversion
 */
export const createResumeHTML = (): string => {
  const { personalInfo, experience, education, skills } = resumeData;

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.name} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #00ffff;
            padding-bottom: 20px;
        }
        
        .name {
            font-size: 28px;
            font-weight: bold;
            color: #000;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .title {
            font-size: 16px;
            color: #00ffff;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .contact-info {
            font-size: 11px;
            color: #666;
            line-height: 1.6;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #000;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
            border-bottom: 1px solid #00ffff;
            padding-bottom: 4px;
        }
        
        .summary {
            font-size: 11px;
            line-height: 1.5;
            color: #444;
            text-align: justify;
        }
        
        .experience-item, .education-item {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        
        .job-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
        }
        
        .job-title {
            font-size: 12px;
            font-weight: bold;
            color: #000;
        }
        
        .company {
            font-size: 11px;
            color: #ff1493;
            font-weight: 600;
            margin-top: 2px;
        }
        
        .date-range {
            font-size: 10px;
            color: #888;
            white-space: nowrap;
        }
        
        .responsibilities {
            margin-top: 8px;
        }
        
        .responsibility {
            font-size: 10px;
            color: #444;
            margin-bottom: 4px;
            padding-left: 12px;
            position: relative;
            line-height: 1.4;
        }
        
        .responsibility::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #00ffff;
            font-weight: bold;
        }
        
        .technologies {
            margin-top: 8px;
            font-size: 9px;
            color: #666;
        }
        
        .tech-label {
            font-weight: bold;
            color: #00ffff;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .skill-category {
            margin-bottom: 12px;
        }
        
        .category-title {
            font-size: 11px;
            font-weight: bold;
            color: #00ffff;
            margin-bottom: 6px;
            text-transform: capitalize;
        }
        
        .skill-level {
            font-size: 9px;
            margin-bottom: 3px;
            line-height: 1.3;
        }
        
        .skill-level-title {
            font-weight: bold;
            color: #333;
        }
        
        .education-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .degree {
            font-size: 12px;
            font-weight: bold;
            color: #000;
        }
        
        .institution {
            font-size: 11px;
            color: #ff1493;
            font-weight: 600;
            margin-top: 2px;
        }
        
        @media print {
            body {
                padding: 20px;
                font-size: 10px;
            }
            
            .header {
                margin-bottom: 20px;
            }
            
            .section {
                margin-bottom: 18px;
            }
            
            .experience-item, .education-item {
                page-break-inside: avoid;
                margin-bottom: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${personalInfo.name}</div>
        <div class="title">${personalInfo.title}</div>
        <div class="contact-info">
            ${personalInfo.email} • ${personalInfo.linkedin}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="summary">${personalInfo.summary}</div>
    </div>

    <div class="section">
        <div class="section-title">Professional Experience</div>
        ${experience.map(exp => `
            <div class="experience-item">
                <div class="job-header">
                    <div>
                        <div class="job-title">${exp.position}</div>
                        <div class="company">${exp.company}</div>
                    </div>
                    <div class="date-range">${exp.startDate} - ${exp.endDate}</div>
                </div>
                <div class="responsibilities">
                    ${exp.responsibilities.map(resp => `
                        <div class="responsibility">${resp}</div>
                    `).join('')}
                </div>
                <div class="technologies">
                    <span class="tech-label">Technologies:</span> ${exp.technologies.join(', ')}
                </div>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <div class="section-title">Education</div>
        ${education.map(edu => `
            <div class="education-item">
                <div class="education-header">
                    <div>
                        <div class="degree">${edu.degree} in ${edu.field}</div>
                        <div class="institution">${edu.institution}</div>
                    </div>
                    <div class="date-range">${edu.graduationDate}</div>
                </div>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <div class="section-title">Technical Skills</div>
        <div class="skills-grid">
            ${Object.entries(skillsByCategory).map(([category, categorySkills]) => {
                const expertSkills = categorySkills.filter(s => s.proficiency === 'expert').map(s => s.name);
                const advancedSkills = categorySkills.filter(s => s.proficiency === 'advanced').map(s => s.name);
                const intermediateSkills = categorySkills.filter(s => s.proficiency === 'intermediate').map(s => s.name);
                
                return `
                    <div class="skill-category">
                        <div class="category-title">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
                        ${expertSkills.length > 0 ? `<div class="skill-level"><span class="skill-level-title">Expert:</span> ${expertSkills.join(', ')}</div>` : ''}
                        ${advancedSkills.length > 0 ? `<div class="skill-level"><span class="skill-level-title">Advanced:</span> ${advancedSkills.join(', ')}</div>` : ''}
                        ${intermediateSkills.length > 0 ? `<div class="skill-level"><span class="skill-level-title">Intermediate:</span> ${intermediateSkills.join(', ')}</div>` : ''}
                    </div>
                `;
            }).join('')}
        </div>
    </div>
</body>
</html>
  `.trim();
};

/**
 * Downloads the resume as an HTML file (can be printed to PDF)
 */
export const downloadResumeHTML = (): void => {
  const htmlContent = createResumeHTML();
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};