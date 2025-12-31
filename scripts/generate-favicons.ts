#!/usr/bin/env tsx

import { generateFavicons } from '../src/utils/faviconGenerator';
import { FaviconGeneration } from '../src/types/navigation';
import * as path from 'path';

/**
 * Script to generate all favicon formats and sizes from the avatar image
 * This implements the favicon generation requirements for the modern navigation enhancement
 */
async function main() {
  console.log('🎨 Starting favicon generation...');

  const config: FaviconGeneration = {
    inputPath: path.resolve('src/assets/profile-photo.jpg'),
    outputDir: path.resolve('public/favicons'),
    sizes: {
      favicon: [16, 32, 48],
      appleTouchIcon: [57, 60, 72, 76, 114, 120, 144, 152, 180],
      androidChrome: [36, 48, 72, 96, 144, 192, 256, 384, 512]
    },
    formats: {
      ico: true,
      png: true,
      svg: true
    }
  };

  try {
    await generateFavicons(config);
    console.log('✅ Favicon generation completed successfully!');
    console.log('📁 Generated files in:', config.outputDir);
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);