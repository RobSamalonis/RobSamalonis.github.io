#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Converts the static resume HTML to PDF using Puppeteer
 * This script reads the generated HTML and converts it to PDF
 */
async function convertResumeToPDF() {
  try {
    console.log('🎯 Converting resume HTML to PDF...');
    
    // Try to import Puppeteer
    let puppeteer;
    try {
      puppeteer = await import('puppeteer');
    } catch (e) {
      console.log('⚠️  Puppeteer not installed. Installing...');
      const { execSync } = await import('child_process');
      execSync('npm install --save-dev puppeteer', { stdio: 'inherit' });
      puppeteer = await import('puppeteer');
    }
    
    const browser = await puppeteer.default.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Read the HTML file
    const htmlPath = join(process.cwd(), 'public', 'Robert_Samalonis_Resume.html');
    const fileUrl = `file://${htmlPath}`;
    
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const outputPath = join(process.cwd(), 'public', 'Robert_Samalonis_Resume.pdf');
    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      printBackground: true
    });
    
    await browser.close();
    
    console.log('✅ Resume PDF generated successfully!');
    console.log(`📁 File saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error converting resume to PDF:', error);
    process.exit(1);
  }
}

// Run the script
convertResumeToPDF();
