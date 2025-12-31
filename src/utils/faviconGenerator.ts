import * as sharp from 'sharp';
import { promises as fs } from 'fs';
import * as path from 'path';
import { FaviconGeneration } from '../types/navigation';

/**
 * Favicon generation utility using Sharp
 * Converts the avatar image into multiple favicon formats and sizes
 */
export class FaviconGenerator {
  private config: FaviconGeneration;

  constructor(config: FaviconGeneration) {
    this.config = config;
  }

  /**
   * Generate all favicon formats and sizes
   */
  async generateAll(): Promise<void> {
    try {
      // Ensure output directory exists
      await this.ensureOutputDirectory();

      // Generate standard favicon sizes
      await this.generateFaviconSizes();

      // Generate Apple touch icons
      await this.generateAppleTouchIcons();

      // Generate Android chrome icons
      await this.generateAndroidChromeIcons();

      // Generate SVG favicon if supported
      if (this.config.formats.svg) {
        await this.generateSVGFavicon();
      }

      console.log('✅ All favicons generated successfully');
    } catch (error) {
      console.error('❌ Error generating favicons:', error);
      throw error;
    }
  }

  /**
   * Ensure the output directory exists
   */
  private async ensureOutputDirectory(): Promise<void> {
    try {
      await fs.access(this.config.outputDir);
    } catch {
      await fs.mkdir(this.config.outputDir, { recursive: true });
    }
  }

  /**
   * Generate standard favicon sizes (16x16, 32x32, 48x48)
   */
  private async generateFaviconSizes(): Promise<void> {
    for (const size of this.config.sizes.favicon) {
      const outputPath = path.join(this.config.outputDir, `favicon-${size}x${size}.png`);
      
      await sharp(this.config.inputPath)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPath);
      
      console.log(`Generated favicon: ${size}x${size}`);
    }

    // Generate ICO format if requested
    if (this.config.formats.ico) {
      await this.generateICOFavicon();
    }
  }

  /**
   * Generate ICO favicon (multi-size ICO file)
   */
  private async generateICOFavicon(): Promise<void> {
    // For ICO generation, we'll create a 32x32 PNG and rename it
    // Note: Sharp doesn't natively support ICO, so this is a simplified approach
    const outputPath = path.join(this.config.outputDir, 'favicon.ico');
    
    await sharp(this.config.inputPath)
      .resize(32, 32, {
        fit: 'cover',
        position: 'center'
      })
      .png({ quality: 90 })
      .toFile(outputPath);
    
    console.log('Generated favicon.ico');
  }

  /**
   * Generate Apple touch icons
   */
  private async generateAppleTouchIcons(): Promise<void> {
    for (const size of this.config.sizes.appleTouchIcon) {
      const outputPath = path.join(this.config.outputDir, `apple-touch-icon-${size}x${size}.png`);
      
      await sharp(this.config.inputPath)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPath);
      
      console.log(`Generated Apple touch icon: ${size}x${size}`);
    }

    // Generate the standard apple-touch-icon.png (180x180)
    const standardAppleIcon = path.join(this.config.outputDir, 'apple-touch-icon.png');
    await sharp(this.config.inputPath)
      .resize(180, 180, {
        fit: 'cover',
        position: 'center'
      })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(standardAppleIcon);
    
    console.log('Generated standard apple-touch-icon.png');
  }

  /**
   * Generate Android chrome icons
   */
  private async generateAndroidChromeIcons(): Promise<void> {
    for (const size of this.config.sizes.androidChrome) {
      const outputPath = path.join(this.config.outputDir, `android-chrome-${size}x${size}.png`);
      
      await sharp(this.config.inputPath)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPath);
      
      console.log(`Generated Android chrome icon: ${size}x${size}`);
    }
  }

  /**
   * Generate SVG favicon
   */
  private async generateSVGFavicon(): Promise<void> {
    // For SVG favicon, we'll create a simple SVG wrapper around a base64 encoded image
    const base64Image = await this.getBase64Image(64); // 64x64 for SVG embedding
    
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <image href="data:image/png;base64,${base64Image}" width="64" height="64" />
      </svg>
    `.trim();

    const outputPath = path.join(this.config.outputDir, 'favicon.svg');
    await fs.writeFile(outputPath, svgContent);
    
    console.log('Generated favicon.svg');
  }

  /**
   * Get base64 encoded image for SVG embedding
   */
  private async getBase64Image(size: number): Promise<string> {
    const buffer = await sharp(this.config.inputPath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .png({ quality: 90 })
      .toBuffer();
    
    return buffer.toString('base64');
  }

  /**
   * Generate web app manifest icons
   */
  async generateManifestIcons(): Promise<void> {
    const manifestSizes = [192, 512];
    
    for (const size of manifestSizes) {
      const outputPath = path.join(this.config.outputDir, `icon-${size}x${size}.png`);
      
      await sharp(this.config.inputPath)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPath);
      
      console.log(`Generated manifest icon: ${size}x${size}`);
    }
  }

  /**
   * Optimize all generated images for web delivery
   */
  async optimizeImages(): Promise<void> {
    const files = await fs.readdir(this.config.outputDir);
    const imageFiles = files.filter(file => file.endsWith('.png') || file.endsWith('.jpg'));

    for (const file of imageFiles) {
      const filePath = path.join(this.config.outputDir, file);
      const stats = await fs.stat(filePath);
      
      // Re-optimize PNG files for better compression
      if (file.endsWith('.png')) {
        await sharp(filePath)
          .png({ 
            quality: 85, 
            compressionLevel: 9,
            progressive: true
          })
          .toFile(filePath + '.tmp');
        
        await fs.rename(filePath + '.tmp', filePath);
      }
      
      const newStats = await fs.stat(filePath);
      const savings = ((stats.size - newStats.size) / stats.size * 100).toFixed(1);
      console.log(`Optimized ${file}: ${savings}% size reduction`);
    }
  }
}

/**
 * Convenience function to generate all favicons
 */
export async function generateFavicons(config: FaviconGeneration): Promise<void> {
  const generator = new FaviconGenerator(config);
  await generator.generateAll();
  await generator.generateManifestIcons();
  await generator.optimizeImages();
}

/**
 * Generate HTML link tags for favicons
 */
export function generateFaviconHTML(faviconDir: string = '/favicons'): string {
  return `
    <!-- Standard favicon -->
    <link rel="icon" type="image/x-icon" href="${faviconDir}/favicon.ico">
    <link rel="icon" type="image/png" sizes="16x16" href="${faviconDir}/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="${faviconDir}/favicon-32x32.png">
    <link rel="icon" type="image/svg+xml" href="${faviconDir}/favicon.svg">
    
    <!-- Apple touch icons -->
    <link rel="apple-touch-icon" href="${faviconDir}/apple-touch-icon.png">
    <link rel="apple-touch-icon" sizes="180x180" href="${faviconDir}/apple-touch-icon-180x180.png">
    
    <!-- Android chrome icons -->
    <link rel="icon" type="image/png" sizes="192x192" href="${faviconDir}/android-chrome-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="${faviconDir}/android-chrome-512x512.png">
    
    <!-- Web app manifest -->
    <link rel="manifest" href="/manifest.json">
  `.trim();
}