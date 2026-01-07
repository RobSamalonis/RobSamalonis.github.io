import jsPDF from 'jspdf';
import { resumeData } from '../data/resumeData';

/**
 * Generates a professional PDF resume from the resume data
 */
export const generateResumePDF = async (): Promise<void> => {
  try {
    // Create new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = margin;

    // Helper function to add wrapped text
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10, fontStyle: string = 'normal'): number => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      const lines = pdf.splitTextToSize(text, maxWidth);
      let currentLineY = y;
      
      lines.forEach((line: string) => {
        pdf.text(line, x, currentLineY);
        currentLineY += fontSize * 0.35277778 * 1.4; // Increased line spacing for readability
      });
      
      return currentLineY;
    };

    // Helper function to add section divider
    const addSectionDivider = (y: number): number => {
      pdf.setDrawColor(70, 130, 180); // Steel blue
      pdf.setLineWidth(0.3);
      pdf.line(margin, y, pageWidth - margin, y);
      return y + 4; // Increased spacing after dividers
    };

    // HEADER SECTION
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(resumeData.personalInfo.name.toUpperCase(), margin, currentY);
    currentY += 7;
    
    pdf.setTextColor(70, 130, 180);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(resumeData.personalInfo.title, margin, currentY);
    currentY += 6;

    // Contact Information (single line to save space)
    pdf.setTextColor(80, 80, 80);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    const contactLine = `${resumeData.personalInfo.email} • ${resumeData.personalInfo.linkedin}`;
    pdf.text(contactLine, margin, currentY);
    currentY += 8;

    // PROFESSIONAL SUMMARY
    currentY = addSectionDivider(currentY);
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PROFESSIONAL SUMMARY', margin, currentY);
    currentY += 6;

    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    currentY = addWrappedText(resumeData.personalInfo.summary, margin, currentY, contentWidth, 9, 'normal');
    currentY += 6;

    // PROFESSIONAL EXPERIENCE
    currentY = addSectionDivider(currentY);
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PROFESSIONAL EXPERIENCE', margin, currentY);
    currentY += 6;

    resumeData.experience.forEach((exp, index) => {
      // Job Title
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(exp.position, margin, currentY);
      
      // Date (right aligned)
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const dateText = `${exp.startDate} - ${exp.endDate}`;
      const dateWidth = pdf.getTextWidth(dateText);
      pdf.text(dateText, pageWidth - margin - dateWidth, currentY);
      currentY += 4;

      // Company
      pdf.setTextColor(70, 130, 180);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text(exp.company, margin, currentY);
      currentY += 4;

      // Responsibilities (add more details back)
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      
      exp.responsibilities.slice(0, 4).forEach(responsibility => {
        currentY = addWrappedText(`• ${responsibility}`, margin + 3, currentY, contentWidth - 3, 8, 'normal');
        currentY += 1; // Better spacing between bullet points
      });

      currentY += (index < resumeData.experience.length - 1) ? 4 : 3;
    });

    // EDUCATION
    currentY = addSectionDivider(currentY);
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EDUCATION', margin, currentY);
    currentY += 6;

    resumeData.education.forEach(edu => {
      // Degree and Institution on same line
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${edu.degree} in ${edu.field}, `, margin, currentY);
      
      // Get width of degree text to position university
      const degreeWidth = pdf.getTextWidth(`${edu.degree} in ${edu.field}, `);
      
      // Temple University in red (Temple's official color: #A41E35)
      pdf.setTextColor(164, 30, 53); // Temple red
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(edu.institution, margin + degreeWidth, currentY);

      // Graduation date (right aligned)
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const gradWidth = pdf.getTextWidth(edu.graduationDate);
      pdf.text(edu.graduationDate, pageWidth - margin - gradWidth, currentY);
      currentY += 5;
    });

    // TECHNICAL SKILLS
    currentY = addSectionDivider(currentY);
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TECHNICAL SKILLS', margin, currentY);
    currentY += 6;

    // Group skills by category
    const skillsByCategory = resumeData.skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof resumeData.skills>);

    // Display skills in compact format (no proficiency levels)
    Object.entries(skillsByCategory).forEach(([category, skills], categoryIndex) => {
      // Category title
      pdf.setTextColor(70, 130, 180);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
      pdf.text(`${categoryTitle}: `, margin, currentY);
      
      // All skills in one line
      const categoryLabelWidth = pdf.getTextWidth(`${categoryTitle}: `);
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      const skillNames = skills.map(s => s.name).join(', ');
      currentY = addWrappedText(skillNames, margin + categoryLabelWidth, currentY, contentWidth - categoryLabelWidth, 8, 'normal');
      currentY += (categoryIndex < Object.entries(skillsByCategory).length - 1) ? 3 : 2;
    });

    // Footer
    currentY += 3;
    const now = new Date();
    const footerText = `Generated on ${now.toLocaleDateString()}`;
    pdf.setFontSize(6);
    pdf.setTextColor(150, 150, 150);
    pdf.setFont('helvetica', 'normal');
    const footerWidth = pdf.getTextWidth(footerText);
    pdf.text(footerText, pageWidth - margin - footerWidth, currentY);

    // Save the PDF
    const fileName = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF resume');
  }
};