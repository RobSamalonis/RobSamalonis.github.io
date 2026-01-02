#!/usr/bin/env tsx

import { writeFileSync } from 'fs';
import { join } from 'path';
import { createResumeHTML } from '../src/utils/createStaticResumePDF';

/**
 * Generates a static HTML file that can be converted to PDF
 * This script creates an HTML version of the resume that can be:
 * 1. Opened in a browser and printed to PDF
 * 2. Converted to PDF using headless browser tools
 * 3. Used as a fallback when dynamic PDF generation fails
 */
async function generateStaticResume() {
  try {
    console.log('🎯 Generating static resume HTML...');
    
    // Generate HTML content
    const htmlContent = createResumeHTML();
    
    // Write to public directory
    const outputPath = join(process.cwd(), 'public', 'Robert_Samalonis_Resume.html');
    writeFileSync(outputPath, htmlContent, 'utf8');
    
    console.log('✅ Static resume HTML generated successfully!');
    console.log(`📁 File saved to: ${outputPath}`);
    console.log('');
    console.log('📋 To convert to PDF:');
    console.log('1. Open the HTML file in a browser');
    console.log('2. Print to PDF (Ctrl/Cmd + P)');
    console.log('3. Save as Robert_Samalonis_Resume.pdf in the public directory');
    console.log('');
    console.log('🔗 Or use a headless browser tool like Puppeteer for automated conversion');
    
  } catch (error) {
    console.error('❌ Error generating static resume:', error);
    process.exit(1);
  }
}

// Run the script
generateStaticResume();