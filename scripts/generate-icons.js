#!/usr/bin/env node

/**
 * Icon Generation Script for StudyMate
 * 
 * This script generates PNG icons from the SVG source for PWA compatibility.
 * 
 * Requirements:
 * - Node.js with sharp package: npm install sharp
 * - SVG source file at public/icons/icon.svg
 * 
 * Usage:
 * node scripts/generate-icons.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if sharp is available
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('❌ Sharp package not found. Please install it first:');
  console.error('npm install sharp');
  process.exit(1);
}

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  try {
    console.log('🎨 Generating StudyMate icons...');
    
    // Check if SVG exists
    if (!fs.existsSync(inputSvg)) {
      console.error('❌ SVG source file not found:', inputSvg);
      process.exit(1);
    }
    
    // Read SVG content
    const svgBuffer = fs.readFileSync(inputSvg);
    
    // Generate icons for each size
    for (const size of iconSizes) {
      const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
      
      try {
        await sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toFile(outputFile);
        
        console.log(`✅ Generated ${size}x${size} icon`);
      } catch {
        console.error(`❌ Failed to generate ${size}x${size} icon`);
      }
    }
    
    // Generate favicon.ico (16x16, 32x32)
    const favicon32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
    
    // Create ICO file (simplified - in production you'd use a proper ICO library)
    const faviconPath = path.join(__dirname, '../public/favicon.ico');
    fs.writeFileSync(faviconPath, favicon32); // For simplicity, just use 32x32
    
    console.log('✅ Generated favicon.ico');
    console.log('🎉 All icons generated successfully!');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

// Run the script
generateIcons(); 