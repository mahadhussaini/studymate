#!/usr/bin/env node

/**
 * Shortcut Icon Generation Script for StudyMate
 * 
 * Generates colored variations of the main icon for PWA shortcuts
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

const inputSvg = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Define shortcut icons with different color tints
const shortcuts = [
  {
    name: 'study-96x96',
    color: '#10b981', // Green for study
    description: 'Study icon'
  },
  {
    name: 'flashcard-96x96', 
    color: '#8b5cf6', // Purple for flashcards
    description: 'Flashcard icon'
  },
  {
    name: 'ai-96x96',
    color: '#f59e0b', // Orange for AI
    description: 'AI Tutor icon'
  }
];

async function generateShortcutIcons() {
  try {
    console.log('🎨 Generating StudyMate shortcut icons...');
    
    // Check if SVG exists
    if (!fs.existsSync(inputSvg)) {
      console.error('❌ SVG source file not found:', inputSvg);
      process.exit(1);
    }
    
    // Read and modify SVG content for each shortcut
    const originalSvg = fs.readFileSync(inputSvg, 'utf8');
    
    for (const shortcut of shortcuts) {
      // Create a modified SVG with different gradient colors
      const modifiedSvg = originalSvg.replace(
        /stop-color:#0ea5e9/g, 
        `stop-color:${shortcut.color}`
      ).replace(
        /stop-color:#3b82f6/g,
        `stop-color:${shortcut.color}`
      );
      
      const outputFile = path.join(outputDir, `${shortcut.name}.png`);
      
      try {
        await sharp(Buffer.from(modifiedSvg))
          .resize(96, 96)
          .png()
          .toFile(outputFile);
        
        console.log(`✅ Generated ${shortcut.description}`);
      } catch {
        console.error(`❌ Failed to generate ${shortcut.name}`);
      }
    }
    
    console.log('🎉 All shortcut icons generated successfully!');
    
  } catch (error) {
    console.error('❌ Error generating shortcut icons:', error.message);
    process.exit(1);
  }
}

// Run the script
generateShortcutIcons();